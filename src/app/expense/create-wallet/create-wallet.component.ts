import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-create-wallet',
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.css']
})
export class CreateWalletComponent {
  isOpen: boolean = false;

  walletName: string = '';
  walletBalance: number | null = null;
  walletCurrency: string = 'USD';
  walletType: 'bank' | 'cash' | 'card' = 'bank';

  @Output() walletCreated = new EventEmitter<any>();

  open() { this.isOpen = true; }
  close() { this.isOpen = false; }

  submit() {
    if (!this.walletName || this.walletBalance === null) return;

    const newWallet = {
      name: this.walletName,
      balance: this.walletBalance,
      currency: this.walletCurrency,
      type: this.walletType
    };

    this.walletCreated.emit(newWallet);
    this.close();
    this.resetForm();
  }

  resetForm() {
    this.walletName = '';
    this.walletBalance = null;
    this.walletCurrency = 'USD';
    this.walletType = 'bank';
  }
}
