import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseRoutingModule } from './expense-routing.module';
import { ExpenseComponent } from './expense.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecurringComponent } from './recurring/recurring.component';
import { StatsComponent } from './stats/stats.component';
import { SettingsComponent } from './settings/settings.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { WalletComponent } from './wallet/wallet.component';


@NgModule({
  declarations: [
    ExpenseComponent,
    DashboardComponent,
    RecurringComponent,
    StatsComponent,
    SettingsComponent,
    SidebarComponent,
    WalletComponent
  ],
  imports: [
    CommonModule,
    ExpenseRoutingModule
  ]
})
export class ExpenseModule { }
