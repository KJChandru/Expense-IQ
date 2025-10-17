import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpenseRoutingModule } from './expense-routing.module';
import { ExpenseComponent } from './expense.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecurringComponent } from './recurring/recurring.component';
import { StatsComponent } from './stats/stats.component';
import { SettingsComponent } from './settings/settings.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { WalletComponent } from './wallet/wallet.component';
import { CreateWalletComponent } from './create-wallet/create-wallet.component';


@NgModule({
  declarations: [
    ExpenseComponent,
    DashboardComponent,
    RecurringComponent,
    StatsComponent,
    SettingsComponent,
    SidebarComponent,
    WalletComponent,
    CreateWalletComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ExpenseRoutingModule,
    ReactiveFormsModule,

]
})
export class ExpenseModule { }
