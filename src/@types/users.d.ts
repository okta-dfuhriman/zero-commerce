import { UserData } from 'auth0';

declare global {
	interface User extends UserData {}
}

export {};
