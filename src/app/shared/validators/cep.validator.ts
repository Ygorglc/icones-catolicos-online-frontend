import { AbstractControl, ValidationErrors } from '@angular/forms';

export function cepValidator(control: AbstractControl<string>): ValidationErrors | null {
  const cep = control.value;
  return /^\d{8}$/.test(cep) && new Set(cep).size > 1 ? null : { cep: true };
}
