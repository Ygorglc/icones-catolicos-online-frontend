import { AbstractControl, ValidationErrors } from '@angular/forms';

export function cpfValidator(control: AbstractControl<string>): ValidationErrors | null {
  const cpf = control.value;
  if (!/^\d{11}$/.test(cpf) || new Set(cpf).size === 1) return { cpf: true };
  const digit = (length: number): number => {
    let sum = 0;
    for (let index = 0; index < length; index++) sum += Number(cpf[index]) * (length + 1 - index);
    const remainder = 11 - sum % 11;
    return remainder >= 10 ? 0 : remainder;
  };
  return digit(9) === Number(cpf[9]) && digit(10) === Number(cpf[10]) ? null : { cpf: true };
}
