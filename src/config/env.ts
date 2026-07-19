export const env = {
    aiServiceBaseUrl: import.meta.env.VITE_API_AI_SERVICE_URL,
    authServiceBaseUrl: import.meta.env.VITE_API_AUTH_SERVICE_URL,
    userServiceBaseUrl: import.meta.env.VITE_API_USER_SERVICE_URL,
} as const;