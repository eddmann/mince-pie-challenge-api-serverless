// @flow

import view from './handlers/view';
import { getPie } from 'db';
import createUserTokenAuthenticator from 'userTokenAuthenticator';

const { TABLE_NAME, USER_POOL_ID } = process.env;

if (!TABLE_NAME) {
  throw new Error('TABLE_NAME is not present');
}

if (!USER_POOL_ID) {
  throw new Error('USER_POOL_ID is not present');
}

export const handler = view({
  getUserIdFromToken: createUserTokenAuthenticator(USER_POOL_ID),
  getPie: getPie(TABLE_NAME),
});
