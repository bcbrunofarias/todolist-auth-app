import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';

import { environment } from '@env/environment';
import { jwtDecode } from 'jwt-decode';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';

import { DecodedToken } from './decoded-token';
import { LoginRequest } from './login.request';
import { LoginResponse } from './login.response';
import { RefreshTokenResponse } from './refresh-token.response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpClient = inject(HttpClient);

  private token$ = signal<string | null>(null);
  private decodedToken$ = signal<DecodedToken | null>(null);
  private isAuthenticated$ = signal<boolean>(false);
  private logoutInProgress = false;

  public login(request: LoginRequest): Observable<LoginResponse> {
    return this.httpClient
      .post<LoginResponse>(`${environment.api.urlBase}/${environment.api.endpoints.auth.login}`, request, { withCredentials: true })
      .pipe(tap(res => {
        this.handleToken(res.accessToken);
        this.isAuthenticated$.set(true)
      }));
  }

  public logout(): Observable<void> {
    if (this.logoutInProgress) {
      return of();
    }

    this.logoutInProgress = true;

    return this.httpClient
      .post<void>(`${environment.api.urlBase}/${environment.api.endpoints.auth.logout}`, {}, { withCredentials: true })
      .pipe(
        catchError(() => of()),
        finalize(() => {
          this.clearToken();
          this.logoutInProgress = false;
        })
      );
  }

  public refreshToken(): Observable<boolean> {
    return this.httpClient
      .post<RefreshTokenResponse>(`${environment.api.urlBase}/${environment.api.endpoints.auth.refreshToken}`, {}, { withCredentials: true })
      .pipe(
        tap(res => {
          this.handleToken(res.accessToken);
          this.isAuthenticated$.set(true)
        }),
        map(_ => true),
        catchError(_ => {
          this.clearToken();
          return of(false);
        })
      );
  }

  public get getToken$(): Signal<string | null> {
    return this.token$.asReadonly();
  }

  public get getDecodedToken$(): Signal<DecodedToken | null> {
    return this.decodedToken$.asReadonly();
  }

  public get isSignedIn$(): Signal<boolean> {
    return this.isAuthenticated$.asReadonly();
  }

  public get isSignedIn(): boolean {
    return this.isAuthenticated$();
  }

  private handleToken(accessToken: string): void {
    this.token$.set(accessToken);
    this.decodedToken$.set(jwtDecode<DecodedToken>(accessToken));
  }

  private clearToken(): void {
    this.token$.set(null);
    this.decodedToken$.set(null);
    this.isAuthenticated$.set(false);
  }
}
