import { ValidationError } from "yup";

interface Errors {
  [key: string]: string; // faz com que pegue todos os campos de input
}

export default function getValidatrionErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};

  err.inner.forEach((error) => {
    validationErrors[error.path] = error.message;
  });
  return validationErrors;
}
