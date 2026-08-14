interface ImportMetaEnv {
    readonly VITE_API_AI_SERVICE_URL: string;
    readonly VITE_API_AUTH_SERVICE_URL: string;
    readonly VITE_API_USER_SERVICE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}