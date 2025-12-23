import {
  ChangeDetectorRef,
  Component,
  ComponentRef,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CreateWalletComponent } from '../create-wallet/create-wallet.component';
import { ExpenseService } from '../service/expense.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { TransferComponent } from '../transfer/transfer.component';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
})
export class WalletComponent implements OnInit {
  @ViewChild('createWalletModal') createWalletModal!: CreateWalletComponent;
  @ViewChild('deleteDialog') deleteDialog!: ConfirmationDialogComponent;
  @ViewChild('transferModal') transferAmountModal!: TransferComponent;

  @ViewChild('transferTemplate', { read: TemplateRef })
  transferTemplate!: TemplateRef<any>;
  @ViewChild('transferContainer', { read: ViewContainerRef })
  transferContainer!: ViewContainerRef;

  wallets: any[] = [];
  searchText: string = '';
  walletToDelete: any;
  initialwallet: any;

  // Added for currency preference
  currencyDetails: any[] = [];
  currency: string = '';
  selectedCurrencyName: string = '';
  selectedCurrencyCode: string = '';
  isGridView: any;
  fromWallet: any;
  private transferRef?: ComponentRef<TransferComponent>;
  constructor(
    private expenseService: ExpenseService,
    private toasterService: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadWallets();
  }

  loadWallets() {
    this.expenseService.getWalletDetails().subscribe((res) => {
      this.wallets = res.result.Data || [];
      this.loadCurrencyMasterAndPreference();
    });
  }

  loadCurrencyMasterAndPreference() {
    this.expenseService.GetWalletmaster().subscribe((res) => {
      this.currencyDetails = res.result?.Data.table || [];
      this.getCurrencyValues();
    });
  }

  getCurrencyValues() {
    this.expenseService.getCurrencyValues('').subscribe((res) => {
      const prefValue = res.result?.Data?.[0]?.value; // “2” in example
      this.currency = prefValue || '1'; // fallback to INR

      const selected = this.currencyDetails.find(
        (c) => c.currencyId == this.currency
      );

      if (selected) {
        this.selectedCurrencyName = selected.currencyName;
        this.selectedCurrencyCode = selected.currencyCode;
      } else {
        this.selectedCurrencyName = 'Indian Rupee';
        this.selectedCurrencyCode = 'INR';
      }
    });
  }

  filteredWallets() {
    if (!this.searchText) return this.wallets;
    return this.wallets.filter((w) =>
      w.walletCode.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  getWalletIcon(type: string): string {
    switch (type?.toLowerCase()) {
      case 'bank':
        return 'account_balance';
      case 'cash':
        return 'attach_money';
      case 'card':
        return 'credit_card';
      case 'upi':
        return 'qr_code';
      default:
        return 'account_balance_wallet';
    }
  }

  toggleView() {
    this.isGridView = !this.isGridView;
  }

  getTotalBalance(): number {
    return this.wallets.reduce((sum, w) => sum + (w.balance || 0), 0);
  }

  getWalletCount(): number {
    return this.wallets.length;
  }

  createWallet() {
    this.createWalletModal.open();
  }

  onWalletCreated(event: any) {
    if (event) {
      this.loadWallets();
    }
  }

  deleteDialogOpen(row: any) {
    this.walletToDelete = row.walletId;
    this.deleteDialog.open();
  }

  confirmDelete(event: any) {
    if (event) {
      this.expenseService.deleteWallet(this.walletToDelete).subscribe(
        (res) => {
          if (res.result.Out == 1) {
            this.toasterService.success('Wallet deleted successfully');
            this.loadWallets();
          }
        },
        (err) => {
          console.error(err);
        }
      );
    } else {
      this.deleteDialog.close();
    }

    this.walletToDelete = 0;
  }

  ontransferAmount(wallet: any) {
    Promise.resolve().then(() => {
      this.transferContainer.clear();

      this.transferRef =
        this.transferContainer.createComponent(TransferComponent);

      this.transferRef.instance.fromWallet = wallet;

      if (this.transferRef.instance.transfer) {
        this.transferRef.instance.transfer.fromWalletId =
          wallet?.walletId ?? '';
      }

      if (this.transferRef.instance.closed) {
        const sub = this.transferRef.instance.closed.subscribe(() => {
          sub.unsubscribe();
          this.closeTransfer();
        });
      }

      if (this.transferRef.instance.transferSuccess) {
        const successSub = this.transferRef.instance.transferSuccess.subscribe(() => {
          successSub.unsubscribe();
          this.loadWallets(); // Refresh wallets after successful transfer
        });
      }
      this.transferRef.changeDetectorRef.detectChanges();
    });
  }

  closeTransfer() {
    this.transferContainer.clear();
    this.transferRef = undefined;
    this.cdr.detectChanges();
  }
}
