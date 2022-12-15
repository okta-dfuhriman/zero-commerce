declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly ALLOWED_ORIGINS?: string;
			readonly VITE_AUTH_DOMAIN: string;
			readonly AUTH_MANAGEMENT_API_DOMAIN: string;
			readonly AUTH_CLIENT_ID: string;
			readonly AUTH_CLIENT_SECRET: string;
			readonly AUTH_AUDIENCE: string;
			readonly VITE_AUTH_API_AUDIENCE: string;
			readonly AUTH_ADMIN_ROLE: string;
			readonly AUTH_ADMIN_PERMISSION: string;
		}
	}
}

export {};
