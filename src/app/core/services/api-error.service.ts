import { Injectable, signal } from '@angular/core';
import { UiError } from '../models/api-error.model';

@Injectable({ providedIn: 'root' })
export class ApiErrorService {
  readonly error = signal<UiError | null>(null);
  show(error: UiError): void { this.error.set(error); }
  clear(): void { this.error.set(null); }
}
