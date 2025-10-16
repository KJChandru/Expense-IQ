import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {  Observable, tap} from 'rxjs';
import { Environment } from 'src/app/environment/environment';

@Injectable({
  providedIn: 'root' 
})

export class  LogoutService {
constructor(private _httpclient:HttpClient, private cookie:CookieService){}



LogOutuser(): Observable<any> {
    return this._httpclient.post<any>(Environment.baseurl + 'user/logout', {})
      .pipe(
        tap((res) => {
          this.cookie.delete('authToken');
          
        })
      );
  }
 
}