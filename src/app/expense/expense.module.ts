import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ExpenseRoutingModule } from './expense-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RecurringComponent } from './recurring/recurring.component';
import { StatsComponent } from './stats/stats.component';
import { SettingsComponent } from './settings/settings.component';


@NgModule({
  declarations: [
    HomeComponent,
    RecurringComponent,
    StatsComponent,
    SettingsComponent
    
  ],
  imports: [
    CommonModule,
    ExpenseRoutingModule,
    SharedModule
  ]
})
export class ExpenseModule { }
