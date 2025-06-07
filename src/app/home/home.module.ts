import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav/sidenav.component';
import { NavComponent } from './nav/nav.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    NavComponent
  ],
  imports: [
    CommonModule,
    SharedModule,

  ]
})
export class HomeModule { }
