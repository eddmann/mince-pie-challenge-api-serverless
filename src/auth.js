import { createHandler, withOptionalHttpAuthentication, withStrictHttpAuthentication } from './helpers/handlers';
import createUserTokenAuthenticator from './services/userTokenAuthenticator';

const handler = async ({ userId = 'N/A' }) => ({
  statusCode: 200,
  body: JSON.stringify({ userId }),
});

const getUserIdFromToken = createUserTokenAuthenticator(process.env.USER_POOL_ID);

export const public_ = createHandler(handler)({ getUserIdFromToken });
export const optional = createHandler(withOptionalHttpAuthentication(handler))({ getUserIdFromToken });
export const strict = createHandler(withStrictHttpAuthentication(handler))({ getUserIdFromToken });
