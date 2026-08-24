import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ApiErrorResponse } from '../models/api-error.model';
import { ApiErrorService } from '../services/api-error.service';

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const errorService = inject(ApiErrorService);
  return next(request).pipe(catchError((error: HttpErrorResponse) => {
    const response = error.error as Partial<ApiErrorResponse> | null;
    errorService.show({
      status: error.status,
      title: response?.erro ?? 'Não foi possível concluir a operação',
      message: response?.mensagem ?? connectionMessage(error.status),
      fields: response?.campos ?? [],
    });
    return throwError(() => error);
  }));
};

function connectionMessage(status: number): string {
  return status === 0
    ? 'Não foi possível conectar ao servidor. Verifique se o backend está em execução.'
    : 'Tente novamente em alguns instantes.';
}
