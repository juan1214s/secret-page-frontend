import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

const SKIP_REFRESH = ['/auth/login', '/auth/refresh', '/auth/logout'];

/**
 * Rotates the access token on a 401 and retries the original request once.
 * A 401 on /auth/refresh itself means the refresh token was reused, revoked,
 * or expired — that always forces a logout, never another refresh attempt.
 */
export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  const skip = SKIP_REFRESH.some((path) => req.url.includes(path));

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401 || skip) {
        return throwError(() => err);
      }

      return auth.refresh().pipe(
        switchMap((tokens) => {
          const retried = req.clone({ setHeaders: { Authorization: `Bearer ${tokens.accessToken}` } });
          return next(retried);
        }),
        catchError((refreshErr) => {
          toast.show('Tu sesión expiró. Inicia sesión de nuevo.', 'danger');
          router.navigate(['/admin/login']);
          return throwError(() => refreshErr);
        }),
      );
    }),
  );
};
