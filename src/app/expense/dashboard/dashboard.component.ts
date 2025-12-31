import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from '../service/expense.service';
import { ToastrService } from 'ngx-toastr';

interface Transaction {
  id: number;
  wallet: number;
  walletName?: string;
  amount: number;
  category: number;
  categoryName?: string;
  notes: string;
  date: string;
  type: 'expense' | 'income';
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  transactions: Transaction[] = [];
  isModalOpen = false;
  transactionType: 'expense' | 'income' = 'expense';
  transactionForm: FormGroup;
  wallets: any[] = [];
  categories: any[] = [];
  selectedDate: Date = new Date();
  editingTransactionId: number | null = null;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private toastr: ToastrService
  ) {
    this.transactionForm = this.fb.group({
      wallet: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      notes: [''],
      date: [new Date(), Validators.required]
    });
  }

  ngOnInit() {
    this.loadInitialData();
    this.loadTransactions();
  }

  loadInitialData() {
    // Load wallets
    this.expenseService.getWalletDetails().subscribe((res) => {
      this.wallets = res.result?.Data || [];
    });
    this.expenseService.GetWalletmaster('category').subscribe((res) => {
       this.categories = res.result?.Data || [];
       console.log('Categories loaded:', this.categories);
    });

    // Load categories - if service method exists, otherwise use temp data
    // this.categories = [
    //   { id: 1, name: 'Food & Dining' },
    //   { id: 2, name: 'Transportation' },
    //   { id: 3, name: 'Shopping' },
    //   { id: 4, name: 'Bills & Utilities' },
    //   { id: 5, name: 'Entertainment' },
    //   { id: 6, name: 'Healthcare' },
    //   { id: 7, name: 'Education' },
    //   { id: 8, name: 'Salary' },
    //   { id: 9, name: 'Freelance' },
    //   { id: 10, name: 'Investment' }
    // ];
  }

  loadTransactions() {
    // Load transactions from API
    this.expenseService.getTransactions().subscribe(
      (res) => {
        console.log('Transactions API Response:', res);
        if (res.result?.Data && Array.isArray(res.result.Data)) {
          this.transactions = res.result.Data.map((t: any) => {
            // Parse date - handle both ISO string and formatted date
            let formattedDate = '';
            if (t.date) {
              try {
                formattedDate = this.formatDate(new Date(t.date));
              } catch (e) {
                formattedDate = t.date; // Use as-is if parsing fails
              }
            } else if (t.createdDate) {
              try {
                formattedDate = this.formatDate(new Date(t.createdDate));
              } catch (e) {
                formattedDate = this.formatDate(new Date());
              }
            } else {
              formattedDate = this.formatDate(new Date());
            }

            return {
              id: t.transactionId || t.id,
              wallet: t.walletId || t.wallet,
              walletName: t.walletName || t.walletCode || 'Unknown',
              amount: t.amount,
              category: t.categoryId || t.category,
              categoryName: t.categoryName || 'Unknown',
              notes: t.notes || t.description || '',
              date: formattedDate,
              type: t.type || (t.amount < 0 ? 'expense' : 'income')
            };
          });
          console.log('Loaded transactions:', this.transactions);
        } else {
          // Fallback to empty array if no data
          this.transactions = [];
          console.log('No transactions found in response');
        }
      },
      (err) => {
        console.error('Error loading transactions:', err);
        this.toastr.error('Failed to load transactions');
        // Fallback to empty array on error
        this.transactions = [];
      }
    );
  }

  openModal() {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.editingTransactionId = null;
    this.transactionType = 'expense';
    this.transactionForm.reset({
      wallet: '',
      amount: '',
      category: '',
      notes: '',
      date: new Date()
    });
  }

  openEditModal(transaction: Transaction) {
    this.isModalOpen = true;
    this.isEditMode = true;
    this.editingTransactionId = transaction.id;
    this.transactionType = transaction.type;
    
    // Parse the date string back to Date object
    const dateParts = transaction.date.split('-');
    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const monthIndex = monthNames.indexOf(dateParts[1].toLowerCase());
    const year = 2000 + parseInt(dateParts[2]); // Assuming 2-digit year
    const day = parseInt(dateParts[0]);
    const dateObj = new Date(year, monthIndex, day);
    
    this.transactionForm.patchValue({
      wallet: transaction.wallet,
      amount: transaction.amount,
      category: transaction.category,
      notes: transaction.notes || '',
      date: dateObj
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.editingTransactionId = null;
    this.transactionType = 'expense';
    this.transactionForm.reset();
  }

  setTransactionType(type: 'expense' | 'income') {
    this.transactionType = type;
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

  onSubmit() {
    console.log('data',this.transactionForm.value);
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    const formValue = this.transactionForm.value;
    
    // Print raw form input JSON
    console.log('=== RAW FORM INPUT JSON ===');
    console.log(JSON.stringify(formValue, null, 2));
    console.log('==========================');
    
    const walletName = this.wallets.find(w => w.walletId == formValue.wallet)?.walletCode || 'Unknown';
    const categoryName = this.categories.find(c => c.categoryId == formValue.category)?.categoryName || 'Unknown';

    // Here you would typically call your API
    const transactionId = this.isEditMode && this.editingTransactionId !== null 
      ? this.editingTransactionId 
      : 0;
    
    const transactionData = {
      transactionId: transactionId,
      walletId: Number(formValue.wallet),
      amount: Number(formValue.amount),
      categoryId: Number(formValue.category),
      notes: formValue.notes || '',
      date: new Date(formValue.date).toISOString(),
      type: this.transactionType
    };

    console.log('transactionData',transactionData);

    if (this.isEditMode && this.editingTransactionId !== null) {
      // Update existing transaction
      const editTransactionId = this.editingTransactionId;
      this.expenseService.updateTransaction(editTransactionId, transactionData).subscribe(
        (res) => {
          if (res.result?.Out === 1 || res.result?.Out === '1') {
            this.toastr.success(`${this.transactionType === 'expense' ? 'Expense' : 'Income'} updated successfully!`);
            this.closeModal();
            // Reload transactions from API
            this.loadTransactions();
          } else {
            this.toastr.error(res.result?.Message || 'Failed to update transaction');
          }
        },
        (err) => {
          console.error('Error updating transaction:', err);
          this.toastr.error('Failed to update transaction. Please try again.');
        }
      );
    } else {
      console.log('transactionData1',new Date(formValue.date).toISOString());
      // Create new transaction
      this.expenseService.addTransaction(transactionData).subscribe(
        (res) => {
          if (res.result?.Out === 1 || res.result?.Out === '1') {
            this.toastr.success(`${this.transactionType === 'expense' ? 'Expense' : 'Income'} added successfully!`);
            this.closeModal();
            // Reload transactions from API
            this.loadTransactions();
          } else {
            this.toastr.error(res.result?.Message || 'Failed to add transaction');
          }
        },
        (err) => {
          console.error('Error adding transaction:', err);
          this.toastr.error('Failed to add transaction. Please try again.');
        }
      );
    }
  }

  deleteTransaction(transactionId: number) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.expenseService.deleteTransaction(transactionId).subscribe(
        (res) => {
          if (res.result?.Out === 1 || res.result?.Out === '1') {
            this.toastr.success('Transaction deleted successfully!');
            // Reload transactions from API
            this.loadTransactions();
          } else {
            this.toastr.error(res.result?.Message || 'Failed to delete transaction');
          }
        },
        (err) => {
          console.error('Error deleting transaction:', err);
          this.toastr.error('Failed to delete transaction. Please try again.');
        }
      );
    }
  }
  

  getTransactionIcon(type: 'expense' | 'income'): string {
    return type === 'expense' ? 'arrow_downward' : 'arrow_upward';
  }

  getTransactionColor(type: 'expense' | 'income'): string {
    return type === 'expense' ? 'text-red-600' : 'text-green-600';
  }

  getTransactionBgColor(type: 'expense' | 'income'): string {
    return type === 'expense' ? 'bg-red-50' : 'bg-green-50';
  }

  
}
