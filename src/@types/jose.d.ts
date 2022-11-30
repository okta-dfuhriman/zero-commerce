import { JWTPayload } from 'jose';

declare module 'jose' {
	interface JWTPayload {
		scope: string;
	}
}
