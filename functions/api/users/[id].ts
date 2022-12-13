import { getUsers } from '../../_utils/_getUsers';

import type { CustomContext } from '@cloudflare/workers-types';

export const onRequestGet = async (context: CustomContext) =>
	await getUsers(context);
