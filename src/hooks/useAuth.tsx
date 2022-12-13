import { useContext } from 'react';

import { AuthContext } from 'providers';

export const useAuth = () => useContext(AuthContext) as Auth.Context;
