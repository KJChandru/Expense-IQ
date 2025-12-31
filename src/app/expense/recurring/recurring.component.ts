import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from '../service/expense.service';
import { ToastrService } from 'ngx-toastr';

interface RecurringTransaction {
  recurringTransactionId?: number;
  id?: number;
  walletId: number;
  walletName?: string;
  amount: number;
  categoryId: number;
  categoryName?: string;
  notes: string;
  transactionType: 'expense' | 'income';
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  nextOccurrence?: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-recurring',
  templateUrl: './recurring.component.html',
  styleUrls: ['./recurring.component.css']
})
export class RecurringComponent implements OnInit {
  recurringTransactions: RecurringTransaction[] = [];
  isModalOpen = false;
  transactionType: 'expense' | 'income' = 'expense';
  recurringForm: FormGroup;
  wallets: any[] = [];
  categories: any[] = [];
  editingRecurringId: number | null = null;
  isEditMode: boolean = false;
  frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private toastr: ToastrService
  ) {
    this.recurringForm = this.fb.group({
      walletId: ['', Validators.required],
      principalAmount: [''],
      interestRate: [''],
      tenureMonths: [''],
      monthlyEmi: ['', [Validators.required, Validators.min(0.01)]],
      categoryId: ['', Validators.required],
      notes: [''],
      transactionType: ['expense', Validators.required],
      frequency: ['monthly', Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [''],
      paymentDay: [1]
    });
  }

  // Helper to check if the selected category is 'Loan'
  get isLoanCategory(): boolean {
    const catId = this.recurringForm.get('categoryId')?.value;
    if (!catId) return false;
    // Find category by ID. Note: API might return recurringTypeID as string or number
    const cat = this.categories.find(c => c.recurringTypeID == catId);
    if (!cat) return false;
    
    // Check if typeName contains 'Loan' (case insensitive)
    return (cat.typeName || '').toLowerCase().includes('loan');
  }

  // Computed total monthly payable for expenses
  get totalMonthlyPayable(): number {
    if (!this.recurringTransactions || this.recurringTransactions.length === 0) {
      return 0;
    }
    return this.recurringTransactions
      .filter(r => r.transactionType === 'expense')
      .reduce((sum, r) => sum + (r.amount || 0), 0);
  }

  // Calculate EMI based on principal, interest rate and tenure
  private calculateEmi(): void {
    if (!this.isLoanCategory) return;

    const principal = Number(this.recurringForm.get('principalAmount')?.value) || 0;
    const annualRate = Number(this.recurringForm.get('interestRate')?.value) || 0;
    const tenure = Number(this.recurringForm.get('tenureMonths')?.value) || 0;

    if (principal <= 0 || tenure <= 0) {
      // Do not reset to 0 if invalid, just leave as is or set 0
      this.recurringForm.get('monthlyEmi')?.setValue(0, { emitEvent: false });
      return;
    }

    const monthlyRate = annualRate > 0 ? (annualRate / 12 / 100) : 0;
    let emi = 0;

    if (monthlyRate === 0) {
      emi = principal / tenure;
    } else {
      const r = monthlyRate;
      const n = tenure;
      const factor = Math.pow(1 + r, n);
      emi = principal * r * factor / (factor - 1);
    }

    const roundedEmi = Math.round(emi * 100) / 100;
    this.recurringForm.get('monthlyEmi')?.setValue(roundedEmi, { emitEvent: false });
  }

  // Auto-set end date based on start date and tenure (for loans or subscriptions)
  private updateEndDateFromTenure(): void {
    const start = this.recurringForm.get('startDate')?.value;
    const tenure = Number(this.recurringForm.get('tenureMonths')?.value) || 0;

    if (!start || tenure <= 0) return;

    const startDate = new Date(start);
    if (isNaN(startDate.getTime())) return;

    const endDate = new Date(startDate);
    // Add tenure months
    endDate.setMonth(endDate.getMonth() + tenure);
    
    // Prepare YYYY-MM-DD
    const isoEndDate = endDate.toISOString().split('T')[0];
    this.recurringForm.get('endDate')?.setValue(isoEndDate, { emitEvent: false });
  }

  // Sync Payment Day with Start Date
  private syncPaymentDay(): void {
    const start = this.recurringForm.get('startDate')?.value;
    if (start) {
      const date = new Date(start);
      if (!isNaN(date.getTime())) {
        this.recurringForm.get('paymentDay')?.setValue(date.getDate(), { emitEvent: false });
      }
    }
  }

  ngOnInit() {
    // Recalculate EMI variables
    this.recurringForm.get('principalAmount')?.valueChanges.subscribe(() => this.calculateEmi());
    this.recurringForm.get('interestRate')?.valueChanges.subscribe(() => this.calculateEmi());
    this.recurringForm.get('tenureMonths')?.valueChanges.subscribe(() => {
      this.calculateEmi();
      this.updateEndDateFromTenure();
    });

    // Start Date changes -> Sync Day & End Date
    this.recurringForm.get('startDate')?.valueChanges.subscribe(() => {
      this.updateEndDateFromTenure();
      this.syncPaymentDay();
    });

    // Payment Day changes -> Update Start Date logic
    this.recurringForm.get('paymentDay')?.valueChanges.subscribe((day) => {
       const currentStart = this.recurringForm.get('startDate')?.value;
       if (currentStart && day) {
         const date = new Date(currentStart);
         // Prevent shifting month if day is invalid for current month? 
         // JS setDate handles overflow (e.g. Feb 30 -> Mar 2), which is acceptable or we can just clamp.
         // For simplicity, just setDate.
         date.setDate(day);
         const isoDate = date.toISOString().split('T')[0];
         // Only update if different to avoid loop
         if (isoDate !== currentStart) {
             this.recurringForm.get('startDate')?.setValue(isoDate, { emitEvent: false });
         }
       }
    });

    // Category changes -> Toggle validators
    this.recurringForm.get('categoryId')?.valueChanges.subscribe(() => {
      this.updateValidators();
      // Also re-calculate EMI if switching to loan and values exist
      if (this.isLoanCategory) {
          this.calculateEmi();
      } else {
          // If switching to subscription, maybe clear Loan fields? 
          // Optional: this.recurringForm.patchValue({ principalAmount: '', interestRate: '', tenureMonths: '' });
      }
    });

    this.loadInitialData();
  }

  updateValidators() {
    const principalCtrl = this.recurringForm.get('principalAmount');
    const interestCtrl = this.recurringForm.get('interestRate');
    const tenureCtrl = this.recurringForm.get('tenureMonths');
    
    // We don't change monthlyEmi validator because it's required for both
    
    if (this.isLoanCategory) {
      principalCtrl?.setValidators([Validators.required, Validators.min(0.01)]);
      interestCtrl?.setValidators([Validators.required, Validators.min(0)]);
      tenureCtrl?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      principalCtrl?.clearValidators();
      interestCtrl?.clearValidators();
      tenureCtrl?.clearValidators();
    }
    
    principalCtrl?.updateValueAndValidity();
    interestCtrl?.updateValueAndValidity();
    tenureCtrl?.updateValueAndValidity();
  }

  loadInitialData() {
    this.expenseService.getWalletDetails().subscribe((res) => {
      this.wallets = res.result?.Data || [];
      this.loadRecurringTransactions();
    });
    this.expenseService.GetWalletmaster('RecurringType').subscribe((res) => {
      this.categories = res.result?.Data || [];
    });
  }

  loadRecurringTransactions() {
    this.expenseService.getRecurringTransactions().subscribe(
      (res) => {
        console.log('recurringdata',res)
        if (res.result?.Data && Array.isArray(res.result.Data)) {
          this.recurringTransactions = res.result.Data.map((t: any) => {
            // Parse dates safely
            let formattedStartDate = '';
            let formattedEndDate = '';
            let formattedNextOccurrence = '';

            if (t.startDate) {
              try {
                formattedStartDate = this.formatDate(new Date(t.startDate));
              } catch (e) {
                formattedStartDate = this.formatDate(new Date());
              }
            }
            if (t.endDate) {
              try {
                formattedEndDate = this.formatDate(new Date(t.endDate));
              } catch (e) {
                formattedEndDate = '';
              }
            }
            if (t.nextOccurrence) {
              try {
                formattedNextOccurrence = this.formatDate(new Date(t.nextOccurrence));
              } catch (e) {
                formattedNextOccurrence = '';
              }
            }

            const wallet = this.wallets.find(w => w.walletCode === t.walletCode);
            const category = this.categories.find(c => c.TypeName === t.TypeName);

            return {
              recurringTransactionId: t.recurringTransactionId || t.id,
              id: t.recurringTransactionId || t.id,
              walletId: wallet?.walletId || 0,
              walletName: t.walletCode || 'Unknown',
              amount: t.amount,
              categoryId: category?.categoryId || 0,
              categoryName: t.typeName || 'Unknown',
              notes: t.name || '',
              transactionType: t.transactionType || 'expense',
              frequency: t.frequency || 'monthly',
              startDate: formattedStartDate,
              endDate: formattedEndDate,
              nextOccurrence: formattedNextOccurrence,
              isActive: t.isActive !== undefined ? t.isActive : true
            };
          });
        } else {
          this.recurringTransactions = [];
        }
        this.currentPage = 1; // Reset to first page on load
      },
      (err) => {
        this.toastr.error('Failed to load recurring transactions');
        this.recurringTransactions = [];
      }
    );
  }

  openModal() {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.editingRecurringId = null;
    this.transactionType = 'expense';
    
    const today = new Date();
    const isoDate = today.toISOString().split('T')[0];

    this.recurringForm.reset({
      walletId: '',
      principalAmount: '',
      interestRate: '',
      tenureMonths: '',
      monthlyEmi: '',
      categoryId: '',
      notes: '',
      transactionType: 'expense',
      frequency: 'monthly',
      startDate: isoDate,
      endDate: '',
      paymentDay: today.getDate()
    });
    this.updateValidators();
  }

  openEditModal(recurring: RecurringTransaction) {
    this.isModalOpen = true;
    this.isEditMode = true;
    this.editingRecurringId = recurring.recurringTransactionId || recurring.id || null;
    this.transactionType = recurring.transactionType;

    const startDate = this.parseDate(recurring.startDate);
    const isoStartDate = startDate.toISOString().split('T')[0];
    
    const endDate = recurring.endDate ? this.parseDate(recurring.endDate) : null;
    const isoEndDate = endDate ? endDate.toISOString().split('T')[0] : '';
    
    this.recurringForm.patchValue({
      walletId: recurring.walletId,
      principalAmount: '', 
      interestRate: '',
      tenureMonths: '',
      monthlyEmi: recurring.amount,
      categoryId: recurring.categoryId,
      notes: recurring.notes || '',
      transactionType: recurring.transactionType,
      frequency: recurring.frequency,
      startDate: isoStartDate,
      endDate: isoEndDate,
      paymentDay: startDate.getDate()
    });
    
    this.updateValidators();
  }

  closeModal() {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.editingRecurringId = null;
    this.transactionType = 'expense';
    this.recurringForm.reset();
  }

  setTransactionType(type: 'expense' | 'income') {
    this.transactionType = type;
    this.recurringForm.patchValue({ transactionType: type });
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    const day = d.getDate();
    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  }

  parseDate(dateString: string): Date {
    if (!dateString) return new Date();
    const parts = dateString.split('-');
    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const monthIndex = monthNames.indexOf(parts[1].toLowerCase());
    const year = 2000 + parseInt(parts[2]);
    const day = parseInt(parts[0]);
    return new Date(year, monthIndex, day);
  }

  onSubmit() {
    if (this.recurringForm.invalid) {
      this.recurringForm.markAllAsTouched();
      return;
    }

    const formValue = this.recurringForm.value;
    const recurringTransactionId = this.isEditMode && this.editingRecurringId !== null 
      ? this.editingRecurringId 
      : 0;

    const selectedCategory = this.categories.find(c => c.recurringTypeID == formValue.categoryId);

    const recurringData = {
      recurringTransactionId: recurringTransactionId,
      walletId: Number(formValue.walletId),
      amount: Number(formValue.monthlyEmi),
     
      recurringType: selectedCategory?.recurringTypeID || '',
      notes: formValue.notes || 'Recurring Expense',
      transactionType: formValue.transactionType,
      
      paymentDay: Number(formValue.paymentDay),
      startDate: new Date(formValue.startDate).toISOString(),
      
      principalAmount: Number(formValue.principalAmount),
      interestRate: Number(formValue.interestRate),
      tenureMonths: Number(formValue.tenureMonths)
    };

    console.log('Submitting Recurring Transaction:', recurringData);

    if (this.isEditMode && this.editingRecurringId !== null) {
      this.expenseService.updateRecurringTransaction(this.editingRecurringId, recurringData).subscribe(
        (res) => {
          if (res.result?.Out === 1 || res.result?.Out === '1') {
            this.toastr.success('Recurring transaction updated successfully!');
            this.closeModal();
            this.loadRecurringTransactions();
          } else {
            this.toastr.error(res.result?.Message || 'Failed to update recurring transaction');
          }
        },
        (err) => {
          console.error('Error updating recurring transaction:', err);
          this.toastr.error('Failed to update recurring transaction. Please try again.');
        }
      );
    } else {
      this.expenseService.updateRecurringTransaction(0,recurringData).subscribe(
        (res) => {
          if (res.result?.Out === 1 || res.result?.Out === '1') {
            this.toastr.success('Recurring transaction added successfully!');
            this.closeModal();
            this.loadRecurringTransactions();
          } else {
            this.toastr.error(res.result?.Message || 'Failed to add recurring transaction');
          }
        },
        (err) => {
          console.error('Error adding recurring transaction:', err);
          this.toastr.error('Failed to add recurring transaction. Please try again.');
        }
      );
    }
  }

  // Pagination Helpers
  get paginatedTransactions(): RecurringTransaction[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.recurringTransactions.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.recurringTransactions.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
