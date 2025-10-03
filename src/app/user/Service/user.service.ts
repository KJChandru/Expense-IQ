import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Environment } from 'src/app/environment/environment';
import { UserModel } from 'src/app/environment/Model';

@Injectable({
  providedIn: 'root' 
})

export class  UserService {
constructor(private _httpclient:HttpClient, private cookie:CookieService){}

registerUser(data: UserModel):Observable<any>{
    return this._httpclient.post<any>(Environment.baseurl+'user/register',data)
}
loginUser(data: UserModel): Observable<any> {
    return this._httpclient.post<any>(Environment.baseurl + 'user/login', data)
      .pipe(
        tap((res) => {
          // assuming your API returns { token: "..." }
          if (res.result?.Data[0].column1) {
            this.cookie.set('authToken', res.result?.Data[0].column1, 7);
          }
        })
      );
  }

 
}