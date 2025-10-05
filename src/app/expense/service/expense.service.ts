import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Environment } from 'src/app/environment/environment';
import { WalletModel } from '../Model/Wallet';

@Injectable({
  providedIn: 'root' 
})

export class  ExpenseService {
constructor(private _httpclient:HttpClient, private cookie:CookieService){}

GetWalletmaster(): Observable<any> {
    return this._httpclient.post<any>(Environment.baseurl + 'v1/expense/get/master', {})
      .pipe(
        tap((res) => {
          // assuming your API returns { token: "..." }
          console.log('Wallet created/updated successfully:', res);
          
        })
      );
  }
CreateUpdateWallet(data: WalletModel): Observable<any> {
    return this._httpclient.post<any>(Environment.baseurl + 'v1/expense/CreateUpdateWallet', data)
      .pipe(
        tap((res) => {
          // assuming your API returns { token: "..." }
          console.log('Wallet created/updated successfully:', res);
          
        })
      );
  }

 
}