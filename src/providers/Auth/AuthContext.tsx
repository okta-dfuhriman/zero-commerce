import { createContext } from 'react';

import { initialAuthState } from './AuthState';

export const AuthContext = createContext(initialAuthState);
