declare global {
	interface Env {
		readonly ALLOWED_ORIGINS?: string;
		readonly AUTH_DOMAIN: string;
		readonly AUTH_MANAGEMENT_API_DOMAIN: string;
		readonly AUTH_CLIENT_ID: string;
		readonly AUTH_CLIENT_SECRET: string;
		readonly AUTH_AUDIENCE: string;
		readonly AUTH_API_AUDIENCE: string;
		readonly AUTH_ADMIN_ROLE: string;
		readonly AUTH_ADMIN_PERMISSION: string;
	}
}

export {};
