import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletModel } from '../Model/Wallet';
import { ExpenseService } from '../service/expense.service';

@Component({
  selector: 'app-create-wallet',
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.css'],
})
export class CreateWalletComponent {
  isOpen: boolean = false;

  walletFrom: FormGroup;
  currencyDetails: any[] = [];
  walletDetails: any[] = [];
  walletName: string = '';
  walletBalance: number | null = null;
  walletCurrency: string = 'USD';
  // walletType: 'bank' | 'cash' | 'card' = 'bank';

  @Output() walletCreated = new EventEmitter<any>();
  walletmodel: WalletModel = new WalletModel();

  open() {
    this.isOpen = true;
  }
  close() {
    this.isOpen = false;
  }

  constructor(private fb: FormBuilder, private expenseService: ExpenseService) {
    this.walletFrom = this.fb.group({
      id: ['0'],
      walletName: ['', Validators.required],
      walletDesc: [''],
      walletType: ['', Validators.required],
      initalCreditedAmt: ['', Validators.required],
      currency: ['', Validators.required],
      balanceAmt: ['0'],
    });
  }
  ngOnInit() {
    this.OnGetWalletMaster();
  }

  OnGetWalletMaster() {
    this.expenseService.GetWalletmaster().subscribe((res) => {
      this.currencyDetails = res.result?.Data.table;
      this.walletDetails = res.result?.Data.table1;

    });
  }
  submitWallet() {
    this.walletmodel = this.walletFrom.value;

    this.expenseService.CreateUpdateWallet(this.walletmodel).subscribe((res) => {
        this.walletFrom.reset();
         this.walletCreated.emit(true);
        this.close();
      });
    if (!this.walletName || this.walletBalance === null) return;

    // const newWallet = {
    //   name: this.walletName,
    //   balance: this.walletBalance,
    //   currency: this.walletCurrency,
    //   type: this.walletType
    // };

    // this.walletCreated.emit(newWallet);
    this.close();
    this.resetForm();
  }

  resetForm() {
    this.walletName = '';
    this.walletBalance = null;
    this.walletCurrency = 'USD';
    // this.walletType = 'bank';
  }
}
