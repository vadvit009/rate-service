export interface ErrorDetail {
  field?: string;
  message: string;
  details?: { [key: string]: any };
}

export interface IAbstractError {
  details: ErrorDetail[];
}
