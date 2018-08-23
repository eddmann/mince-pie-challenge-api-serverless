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

export const created = (resource: HALResource): Response => ({
  statusCode: 201,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': '*',
    'Content-Type': 'application/hal+json',
    Location: resource._links.self.href,
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

export const badRequest = (detail: string, errors: Array<{ name: string, reason: string }>): Response => ({
  statusCode: 400,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': '*',
    'Content-Type': 'application/problem+json',
  },
  body: JSON.stringify({ title: 'Bad Request', detail, errors }),
});

export const json = (input: ?string): { [string]: any } => {
  try {
    return input ? JSON.parse(input) : {};
  } catch (e) {
    return {};
  }
};
