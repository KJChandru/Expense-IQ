import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
   styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
   currency: string = 'INR';
  currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'INR', label: 'INR - Indian Rupee' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
  ];

  saveSettings() {
    alert(`Currency set to ${this.currency}`);
  }

  exportData() {
    // TODO: Hook with backend CSV export
    alert('Your data has been exported as CSV.');
  }

  resetTransactions() {
    if (confirm('Are you sure you want to reset all transactions? This cannot be undone.')) {
      // TODO: Hook API to reset data
      alert('All transactions have been reset.');
    }
  }
}
