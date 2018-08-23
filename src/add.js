// @flow

import add from './handlers/add';
import { addPie } from 'db';
import createUserTokenAuthenticator from 'userTokenAuthenticator';

const { TABLE_NAME, USER_POOL_ID } = process.env;

if (!TABLE_NAME) {
  throw new Error('TABLE_NAME is not present');
}

if (!USER_POOL_ID) {
  throw new Error('USER_POOL_ID is not present');
}

export const handler = add({
  getUserIdFromToken: createUserTokenAuthenticator(USER_POOL_ID),
  addPie: addPie(TABLE_NAME),
});
