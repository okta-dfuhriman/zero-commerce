import { Request, Response } from 'express';
import { Auth0Client } from '../../api/_AuthClient';

declare module 'express' {
	interface Request {
		authClient?: Auth0Client;
	}
}
