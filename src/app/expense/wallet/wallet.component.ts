import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateWalletComponent } from '../create-wallet/create-wallet.component'; // updated path

interface Wallet {
  name: string;
  balance: number;
  currency: string;
  type: 'bank' | 'cash' | 'card';
}

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  @ViewChild('createWalletModal') createWalletModal!: CreateWalletComponent;

  wallets: Wallet[] = [];
  searchText: string = '';

  ngOnInit() {
    this.loadWallets();
  }

  loadWallets() {
    this.wallets = [
      { name: 'Main Bank', balance: 1200, currency: 'USD', type: 'bank' },
      { name: 'Cash Wallet', balance: 500, currency: 'USD', type: 'cash' },
      { name: 'Travel Card', balance: 800, currency: 'USD', type: 'card' },
      { name: 'Cash Wallet', balance: 500, currency: 'USD', type: 'cash' },
      { name: 'Travel Card', balance: 800, currency: 'USD', type: 'card' },
      { name: 'Cash Wallet', balance: 500, currency: 'USD', type: 'cash' },
      { name: 'Travel Card', balance: 800, currency: 'USD', type: 'card' },
      { name: 'Cash Wallet', balance: 500, currency: 'USD', type: 'cash' },
      { name: 'Travel Card', balance: 800, currency: 'USD', type: 'card' },
      { name: 'Cash Wallet', balance: 500, currency: 'USD', type: 'cash' },
      { name: 'Travel Card', balance: 800, currency: 'USD', type: 'card' }
    ];
  }

  filteredWallets() {
    if (!this.searchText) return this.wallets;
    return this.wallets.filter(w =>
      w.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  getTotalBalance(): number {
    return this.wallets.reduce((sum, w) => sum + (w.balance || 0), 0);
  }

  getWalletCount(): number {
    return this.wallets.length;
  }

  getWalletIcon(type: string): string {
    switch(type) {
      case 'bank': return 'account_balance';
      case 'cash': return 'attach_money';
      case 'card': return 'credit_card';
      default: return 'account_balance_wallet';
    }
  }

  createWallet() {
    this.createWalletModal.open();
  }

  addWallet(wallet: Wallet) {
    this.wallets.push(wallet);
  }

  editWallet(wallet: Wallet) { console.log('Edit', wallet); }
  deleteWallet(wallet: Wallet) { console.log('Delete', wallet); }
  transferFunds() { console.log('Transfer Funds'); }
}
