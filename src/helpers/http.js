/* @flow */

import type { HALResource, Response } from '../types';

const hal = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': '*',
  'Content-Type': 'application/hal+json',
};

const problem = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': '*',
  'Content-Type': 'application/problem+json',
};

export const ok = (resource: HALResource): Response => ({
  statusCode: 200,
  headers: hal,
  body: JSON.stringify(resource.toJSON()),
});

export const created = (resource: HALResource): Response => ({
  statusCode: 201,
  headers: Object.assign({}, hal, { Location: resource._links.self.href }),
  body: JSON.stringify(resource.toJSON()),
});

export const noContent = (): Response => ({
  statusCode: 204,
  headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': '*' },
  body: '',
});

export const badRequest = (detail: string, errors: Array<{ name: string, reason: string }>): Response => ({
  statusCode: 400,
  headers: problem,
  body: JSON.stringify({ title: 'Bad Request', detail, errors }),
});

export const unauthorised = (detail: string): Response => ({
  statusCode: 401,
  headers: problem,
  body: JSON.stringify({ title: 'Unauthorized', detail }),
});

export const forbidden = (detail: string): Response => ({
  statusCode: 403,
  headers: problem,
  body: JSON.stringify({ title: 'Forbidden', detail }),
});

export const notFound = (detail: string): Response => ({
  statusCode: 404,
  headers: problem,
  body: JSON.stringify({ title: 'Not Found', detail }),
});

export const json = (input: ?string): { [string]: any } => {
  try {
    return input ? JSON.parse(input) : {};
  } catch (e) {
    return {};
  }
};
