import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Environment } from 'src/app/environment/environment';
import { WalletModel } from '../Model/Wallet';


@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  constructor(private http: HttpClient, private cookie: CookieService) {}

  GetWalletmaster(): Observable<any> {
    return this.http.get<any>(`${Environment.baseurl}v1/expense/get/master`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  CreateUpdateWallet(data: any): Observable<any> {
    return this.http.post<any>(`${Environment.baseurl}v1/expense/CreateUpdateWallet`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  getWalletDetails(): Observable<any> {
    return this.http.get<any>(`${Environment.baseurl}v1/expense/get/walletDetails`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Server returned code: ${error.status}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
