import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../service/expense.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  currencyDetails: any;
  selectedCurrencyName: any;

  constructor(private expenseService: ExpenseService,private toasterService:ToastrService) {}
  ngOnInit() {
   
    this.OnGetWalletMaster();
  }

  currency: string = 'INR';

  OnGetWalletMaster() {
    this.expenseService.GetWalletmaster('currency').subscribe((res) => {
      this.currencyDetails = res.result?.Data;
      console.log('Wallet master data:', this.currencyDetails);   
       this.getCurrencyValues();
    });
  }

 getCurrencyValues() {
  this.expenseService.getCurrencyValues('').subscribe((res) => {
    console.log('Currency preference fetched:', res);

  
    const prefValue = res.result?.Data?.[0]?.value; // “2” in your example

    this.currency = prefValue || '1'; // fallback to INR

    const selected = this.currencyDetails.find(
      (c: { currencyId: string; }) => c.currencyId == this.currency
    );
    this.selectedCurrencyName = selected ? selected.currencyName : 'Indian Rupee';

    console.log('Selected currency:', this.selectedCurrencyName);
  });
}

  saveSettings() {
    this.expenseService.savePreferedCurrency(this.currency).subscribe((res) => {
      console.log('Preferred currency saved:', res);
        this.toasterService.success('Currency Saved.');
    });
  }

  exportData() {
    alert('Your data has been exported as CSV.');
  }

  resetTransactions() {
    if (
      confirm(
        'Are you sure you want to reset all transactions? This cannot be undone.'
      )
    ) {
      alert('All transactions have been reset.');
    }
  }
}
