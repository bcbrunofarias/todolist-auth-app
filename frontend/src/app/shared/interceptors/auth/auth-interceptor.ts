import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { InterceptorEndpointsExcludedConstants } from '@constants/interceptor-endpoints-excluded.constants';
import { RoutesConstants } from '@constants/routes.constants';
import { AuthService } from '@services/auth/auth.service';
import { catchError, finalize, Observable, switchMap, throwError } from 'rxjs';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (InterceptorEndpointsExcludedConstants.ENDPOINTS.some(endpoint => req.url.endsWith(endpoint))) {
    return next(req);
  }

  const token = authService.getToken$;
  const request = cloneRequestWithToken(req, token());

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) return throwError(() => error);

      return authService.refreshToken().pipe(
        switchMap((success) => {
          if (!success) {
            return handleRefreshTokenUnauthorized(router, authService);
          }

          const newToken = authService.getToken$;
          const request = cloneRequestWithToken(req, newToken());
          return next(request);
        }),
        catchError(() => handleRefreshTokenUnauthorized(router, authService))
      )
    })
  );
};

const handleRefreshTokenUnauthorized = (router: Router, authService: AuthService): Observable<never> => {
  return authService.logout().pipe(
    switchMap(() => throwError(() => new Error('Unauthorized'))),
    finalize(() => router.navigate([RoutesConstants.LOGIN], { queryParams: { returnUrl: router.url } }))
  );
}

const cloneRequestWithToken = (request: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> => {
  if (!token) return request;

  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}
