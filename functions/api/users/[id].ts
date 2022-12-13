import { getUsers } from '../../helpers';

export const onRequestGet: PagesFunction<Env> = async (context) =>
	await getUsers(context);
