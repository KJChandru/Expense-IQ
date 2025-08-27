import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Environment } from 'src/app/environment/environment';
import { UserModel } from 'src/app/environment/Model';

@Injectable({
  providedIn: 'root' 
})

export class  UserService {
constructor(private _httpclient:HttpClient){}

registerUser(data: UserModel):Observable<any>{
    return this._httpclient.post<any>(Environment.baseurl+'user/register',data)
    
    
}
 
}