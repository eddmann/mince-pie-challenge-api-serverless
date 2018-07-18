// @flow

import publicHandler from './handlers/public';
import optionalHandler from './handlers/optional';
import strictHandler from './handlers/strict';
import createUserTokenAuthenticator from './services/userTokenAuthenticator';

const { USER_POOL_ID } = process.env;

if (!USER_POOL_ID) {
  throw new Error('USER_POOL_ID is not present');
}

const getUserIdFromToken = createUserTokenAuthenticator(USER_POOL_ID);

export const public_ = publicHandler({});
export const optional = optionalHandler({ getUserIdFromToken });
export const strict = strictHandler({ getUserIdFromToken });
