import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletModel } from '../Model/Wallet';
import { ExpenseService } from '../service/expense.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-wallet',
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.css'],
})
export class CreateWalletComponent {
  isOpen = false;
  walletFrom: FormGroup;
  currencyDetails: any[] = [];
  walletDetails: any[] = [];
  @Output() walletCreated = new EventEmitter<any>();
  walletmodel: WalletModel = new WalletModel();

  constructor(private fb: FormBuilder, private expenseService: ExpenseService,private toasterService:ToastrService) {
    this.walletFrom = this.fb.group({
      id: ['0'],
      walletName: ['', Validators.required],
      walletDesc: [''],
      walletType: ['', Validators.required],
      initalCreditedAmt: [
        '',
        [Validators.required, Validators.min(1)],
      ],
      currency: ['', Validators.required],
      balanceAmt: ['0'],
    });
  }

  ngOnInit() {
    this.OnGetWalletMaster();
  }

  get f() {
    return this.walletFrom.controls;
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  OnGetWalletMaster() {
    this.expenseService.GetWalletmaster().subscribe((res) => {
      this.currencyDetails = res.result?.Data.table;
      this.walletDetails = res.result?.Data.table1;
    });
  }

  submitWallet() {
    if (this.walletFrom.invalid) {
      this.walletFrom.markAllAsTouched();
      return;
    }

    this.walletmodel = this.walletFrom.value;

    this.expenseService.CreateUpdateWallet(this.walletmodel).subscribe(
      (res) => {
        console.log(res);
        if (res.result.Out == 1) {
          this.walletFrom.reset();
          this.walletCreated.emit(true);
          this.close();
          this.toasterService.success('Wallet created successfully');
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
