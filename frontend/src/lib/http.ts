import axios, { type AxiosError } from 'axios';

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

function resolveErrorMessage(error: AxiosError): string {
  const data = error.response?.data as
    | { message?: string | string[] }
    | undefined;

  if (Array.isArray(data?.message)) {
    return data.message.join(', ');
  }

  if (typeof data?.message === 'string') {
    return data.message;
  }

  return error.message || 'Ocurrió un error inesperado';
}

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      return Promise.reject(new Error(resolveErrorMessage(error)));
    }

    if (error instanceof Error) {
      return Promise.reject(error);
    }

    return Promise.reject(new Error('Ocurrió un error inesperado'));
  },
);

export default http;
