// @flow

import type { HALResource, Response } from '../types';

export const ok = (resource: HALResource): Response => ({
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': '*',
    'Content-Type': 'application/hal+json',
  },
  body: JSON.stringify(resource.toJSON()),
});

export const unauthorised = (detail: string): Response => ({
  statusCode: 401,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': '*',
    'Content-Type': 'application/problem+json',
  },
  body: JSON.stringify({ title: 'Unauthorized', detail }),
});
