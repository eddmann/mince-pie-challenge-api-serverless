import * as db from './helpers/db';
import { authenticate } from './middleware/auth';
import { ok } from './helpers/http';
import { Resource } from 'hal';

const { USER_POOL_NAME, USER_POOL_CLIENT_ID } = process.env;

export const bootstrap = authenticate(async function (event, context, callback, user) {
  const resource = new Resource({
    cognito: {
      poolId: USER_POOL_NAME.split('/')[1],
      clientId: USER_POOL_CLIENT_ID,
    },
    baseEndpointUrl: 'https://api.mincepiechallenge.com',
  }, '/');

  resource.link('list', '/pies');
  resource.link('add', '/pies');
  resource.link('view', { href: '/pies/{id}', templated: true });

  callback(undefined, ok(resource));
});
