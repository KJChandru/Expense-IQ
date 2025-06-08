import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserModule } from './user/user.module';

const routes: Routes = [
  {
    path:'user',
    loadChildren:()=>import('./user/user.module').then(m=>m.UserModule)
  },
  { 
    path: '', 
    redirectTo: 'user/login', 
    pathMatch: 'full' 
  }, 
  {
    path:'expense',
    loadChildren:() =>import ('./expense/expense.module').then(m=>m.ExpenseModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
