import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateWalletComponent } from '../create-wallet/create-wallet.component'; // updated path
import { ExpenseService } from '../service/expense.service';


@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  @ViewChild('createWalletModal') createWalletModal!: CreateWalletComponent;

  wallets: any[] = [];
  searchText: string = '';


  constructor(private expenseService: ExpenseService) { }
  ngOnInit() {
    this.loadWallets();
  }

  loadWallets() {

    this.expenseService.GetWalletdetails().subscribe((res) => {
      this.wallets = res.result.Data; 
    });

  }

 filteredWallets() {
  if (!this.searchText) return this.wallets;
  return this.wallets.filter(w =>
    w.walletCode.toLowerCase().includes(this.searchText.toLowerCase())
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

  onWalletCreated(event: any) {
  if (event) {
    this.loadWallets(); 
  }
}


  // addWallet(wallet: Wallet) {
  //   this.wallets.push(wallet);
  // }

  // editWallet(wallet: Wallet) { console.log('Edit', wallet); }
  // deleteWallet(wallet: Wallet) { console.log('Delete', wallet); }
  // transferFunds() { console.log('Transfer Funds'); }
}
