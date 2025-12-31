import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Environment } from 'src/app/environment/environment';
import { TransferModel } from '../Model/Wallet';


@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  constructor(private http: HttpClient, private cookie: CookieService) {}

  GetWalletmaster(type : string): Observable<any> {
    return this.http.get<any>(`${Environment.baseurl}v1/expense/get/master/${type}`, {})
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

  deleteWallet(id:any):Observable<any>{ 
    return this.http.put<any>(`${Environment.baseurl}v1/expense/delete/wallet/${id}`,id)
    .pipe(
      catchError(this.handleError)
    );
  }

  savePreferedCurrency(value: string): Observable<any> {
    return this.http.post<any>(`${Environment.baseurl}v1/expense/save/userPreference/currency/${value}`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  getCurrencyValues(key:any): Observable<any> {
    return this.http.get<any>(`${Environment.baseurl}v1/expense/get/userPreference/currency`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getWalletForTransfer(walletId: string): Observable<any> {
     return this.http.get<any>(`${Environment.baseurl}v1/expense/get/Wallet/forTransfer/${walletId}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  transferAmount(params: TransferModel): Observable<any> {
     return this.http.post<any>(Environment.baseurl+'v1/expense/transfer',params)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Transaction API Methods
  addTransaction(data: any): Observable<any> {
    return this.http.post<any>(`${Environment.baseurl}v1/expense/addUpdate/transaction`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateTransaction(id: number, data: any): Observable<any> {
    return this.http.post<any>(`${Environment.baseurl}v1/expense/addUpdate/transaction`, { ...data, id: id })
      .pipe(
        catchError(this.handleError)
      );
  }

  getTransactions(): Observable<any> {
    return this.http.get<any>(`${Environment.baseurl}v1/expense/transaction/get`)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.put<any>(`${Environment.baseurl}v1/expense/delete/transaction/${id}`, id)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Recurring Transaction API Methods
  addRecurringTransaction(data: any): Observable<any> {
    if (!data.recurringTransactionId) {
      data.recurringTransactionId = 0;
    }
    return this.http.post<any>(`${Environment.baseurl}v1/expense/recurring/addUpdate`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateRecurringTransaction(id: number, data: any): Observable<any> {
    return this.http.post<any>(`${Environment.baseurl}v1/expense/recurring/addUpdate`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  getRecurringTransactions(): Observable<any> {
    return this.http.get<any>(`${Environment.baseurl}v1/expense/recurringtransaction/get`)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteRecurringTransaction(id: number): Observable<any> {
    return this.http.put<any>(`${Environment.baseurl}v1/expense/recurring/delete/${id}`, id)
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
