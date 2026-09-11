import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

export class ApiClientError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(
    message: string,
    options?: { status?: number; code?: string; details?: unknown },
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.status = options?.status;
    this.code = options?.code;
    this.details = options?.details;
  }
}

function getBaseUrl(): string {
  // Relative `/api` keeps cookies same-origin in the browser.
  return process.env.NEXT_PUBLIC_API_URL || '/api';
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: unknown) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    if (error.response) {
      const message =
        error.response.data?.message ??
        error.response.data?.error ??
        error.message ??
        'Request failed';

      return Promise.reject(
        new ApiClientError(message, {
          status: error.response.status,
          code: error.code,
          details: error.response.data,
        }),
      );
    }

    if (error.request) {
      return Promise.reject(
        new ApiClientError('Network error: no response from server', {
          code: error.code,
        }),
      );
    }

    return Promise.reject(
      new ApiClientError(error.message || 'Unexpected API error', {
        code: error.code,
      }),
    );
  },
);

export default apiClient;
