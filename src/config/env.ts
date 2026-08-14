declare global {
  interface Window {
    _env_: Record<string, string>;
  }
}

const _env = window._env_ ?? {};

export const env = {
  aiServiceBaseUrl: _env.VITE_API_AI_SERVICE_URL || import.meta.env.VITE_API_AI_SERVICE_URL || '',
  authServiceBaseUrl: _env.VITE_API_AUTH_SERVICE_URL || import.meta.env.VITE_API_AUTH_SERVICE_URL || '',
  userServiceBaseUrl: _env.VITE_API_USER_SERVICE_URL || import.meta.env.VITE_API_USER_SERVICE_URL || '',
} as const;
