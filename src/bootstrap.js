// @flow

import bootstrap from './handlers/bootstrap';

const { USER_POOL_ID, USER_POOL_CLIENT_ID, BASE_ENDPOINT_URL } = process.env;

if (!USER_POOL_ID) {
  throw new Error('USER_POOL_ID is not present');
}

if (!USER_POOL_CLIENT_ID) {
  throw new Error('USER_POOL_CLIENT_ID is not present');
}

if (!BASE_ENDPOINT_URL) {
  throw new Error('BASE_ENDPOINT_URL is not present');
}

export const handler = bootstrap({
  getPoolId: () => USER_POOL_ID,
  getClientId: () => USER_POOL_CLIENT_ID,
  getBaseEndpointUrl: () => BASE_ENDPOINT_URL,
});
