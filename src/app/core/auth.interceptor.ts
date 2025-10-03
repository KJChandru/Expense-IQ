import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Environment } from 'src/app/environment/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private cookie: CookieService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let requestToHandle = req;

    const isApiRequest = req.url.startsWith(Environment.baseurl);
    const isAuthEndpoint = req.url.includes('user/login') || req.url.includes('user/register');

    if (isApiRequest && !isAuthEndpoint) {
      const token = this.cookie.get('authToken');
      if (token) {
        console.log('Adding Authorization header with token:', token);
        requestToHandle = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
      }
    }

    return next.handle(requestToHandle).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.cookie.delete('authToken', '/');
          this.router.navigate(['/user/login']);
        }
        return throwError(() => error);
      })
    );
  }
}


