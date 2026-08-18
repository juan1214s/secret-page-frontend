import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // 401s are handled (retried or turned into a logout) by refreshInterceptor.
      if (err.status !== 401) {
        const message = messageFor(err);
        if (message) {
          toast.show(message, 'danger');
        }
      }
      return throwError(() => err);
    }),
  );
};

function messageFor(err: HttpErrorResponse): string | null {
  switch (err.status) {
    case 0:
      return 'No se pudo conectar con el servidor.';
    case 400:
      return err.error?.message ?? 'Los datos enviados no son válidos.';
    case 403:
      return 'No tienes permiso para hacer esto.';
    case 404:
      return 'No se encontró el recurso solicitado.';
    case 409:
      return err.error?.message ?? 'Ese registro ya existe o está en uso.';
    case 413:
      return 'El archivo supera el tamaño permitido (5 MB).';
    case 429:
      return 'Demasiadas solicitudes. Intenta de nuevo en unos minutos.';
    default:
      return err.status >= 500 ? 'Error del servidor. Intenta de nuevo.' : null;
  }
}
