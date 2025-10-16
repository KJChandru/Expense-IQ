import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Environment } from '../environment/environment';
import { ApiResponse } from '../Model/model';

export abstract class BaseService {
  protected baseUrl = Environment.baseurl;

  constructor(protected http: HttpClient) {}

  protected post<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(this.baseUrl + endpoint, data).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  protected get<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(this.baseUrl + endpoint).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  protected put<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(this.baseUrl + endpoint, data).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  protected delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(this.baseUrl + endpoint).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    const message =
      error?.error?.message ||
      error?.message ||
      'Unexpected error occurred while communicating with the server.';
    return throwError(() => new Error(message));
  }
}
