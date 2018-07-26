// @flow

import { createHandler } from '../helpers/handlers';
import { ok } from '../helpers/http';
import { Resource } from 'hal';

const bootstrap = async ({ services: { getPoolId, getClientId, getBaseEndpointUrl } }) => {
  const resource = new Resource(
    {
      cognito: {
        poolId: getPoolId(),
        clientId: getClientId(),
      },
      baseEndpointUrl: getBaseEndpointUrl(),
    },
    '/',
  );

  resource.link('list', '/pies');
  resource.link('add', '/pies');
  resource.link('view', { href: '/pies/{id}', templated: true });

  return ok(resource);
};

export default createHandler(bootstrap);
