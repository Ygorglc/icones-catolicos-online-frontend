export interface ApiFieldError { campo: string; mensagem: string; }
export interface ApiErrorResponse {
  instante?: string; status: number; erro: string; mensagem: string;
  caminho?: string; campos?: ApiFieldError[];
}
export interface UiError {
  status: number; title: string; message: string; fields: ApiFieldError[];
}
