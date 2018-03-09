/* @flow */

import { ok } from '../helpers/http';
import { createHandler } from '../helpers/handlers';
import { Resource } from 'hal';

const bootstrap = async ({ callback, services: { env } }) => {
  const resource = new Resource(
    {
      cognito: {
        poolId: env.USER_POOL_NAME.split('/')[1],
        clientId: env.USER_POOL_CLIENT_ID,
      },
      baseEndpointUrl: env.BASE_ENDPOINT_URL,
    },
    '/',
  );

  resource.link('list', '/pies');
  resource.link('add', '/pies');
  resource.link('view', { href: '/pies/{id}', templated: true });

  callback(undefined, ok(resource));
};

export default createHandler(bootstrap);
