import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ExpenseService } from '../service/expense.service';
import { TransferModel } from '../Model/Wallet';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  @Input() wallets: any[] = [];
  @Input() fromWallet: any;
  @Output() closed = new EventEmitter<void>();
  @Output() transferSuccess = new EventEmitter<void>();

  transfer = {
    fromWalletId: '',
    toWalletId: '',
    amount: 0,
    notes: ''
  };


  constructor(private expenseService: ExpenseService,private toasterService:ToastrService) {}

  ngOnInit(): void {
    if (this.fromWallet?.walletId) {
      this.transfer.fromWalletId = this.fromWallet.walletId;
    }

    if (this.transfer.fromWalletId) {
      this.getWalletForTransfer(this.transfer.fromWalletId);
    } else if (this.fromWallet?.walletId) {
      this.getWalletForTransfer(this.fromWallet.walletId);
    }

  }

  getWalletForTransfer(walletId: string) {
    this.expenseService.getWalletForTransfer(walletId).subscribe((res) => {
      console.log(res);
      this.wallets = res.result?.Data || [];
    });
  }

  close() {
    this.resetForm();
    this.closed.emit();
  }

  resetForm() {
    this.transfer = {
      fromWalletId: this.fromWallet?.walletId || '',
      toWalletId: '',
      amount: 0,
      notes: ''
    };
  }

   loadWallets() {
    this.expenseService.getWalletDetails().subscribe((res) => {
      this.wallets = res.result.Data || [];
    });
  }

  onTransfer() {
    let model= new TransferModel()
    model.fromwallet=this.transfer.fromWalletId
    model.towallet=this.transfer.toWalletId
    model.amount=this.transfer.amount
    model.description=this.transfer.notes

    this.expenseService.transferAmount(model).subscribe((res) => {
     this.toasterService.success('Transfer successful!');
      this.transferSuccess.emit(); // Emit event to notify parent to refresh wallets
      this.close();
    }, (error) => {
      alert('Transfer failed. Please try again.');
    });
  }
}
