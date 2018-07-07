// @flow

import { createHandler, withOptionalHttpAuthentication, withStrictHttpAuthentication } from './helpers/handlers';
import createUserTokenAuthenticator from './services/userTokenAuthenticator';

const handler = async ({ userId = 'N/A' }) => ({
  statusCode: 200,
  body: JSON.stringify({ userId }),
});

const { USER_POOL_ID } = process.env;

if (!USER_POOL_ID) {
  throw new Error('USER_POOL_ID is not present');
}

const getUserIdFromToken = createUserTokenAuthenticator(USER_POOL_ID);

export const public_ = createHandler(handler)({});
export const optional = createHandler(withOptionalHttpAuthentication(handler))({ getUserIdFromToken });
export const strict = createHandler(withStrictHttpAuthentication(handler))({ getUserIdFromToken });
