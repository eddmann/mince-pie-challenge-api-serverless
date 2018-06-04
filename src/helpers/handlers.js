/* @flow */

import type { HandlerWithServices, OptionalUserHandlerMiddleware, AuthenticatedUserHandlerMiddlware } from '../types';

import { forbidden } from '../helpers/http';

export const createHandler: HandlerWithServices = handler => services => (event, context, callback) =>
  handler({ event, context, callback, services });

export const optionalHttpAuthentication: OptionalUserHandlerMiddleware = handler => async params => {
  const { event, services } = params;
  const userId = event.headers.Authorization && (await services.getUserIdFromToken(event.headers.Authorization));
  await handler(Object.assign({}, params, { userId }));
};

export const strictHttpAuthentication: AuthenticatedUserHandlerMiddlware = handler => async params => {
  const { event, callback, services } = params;
  const userId = event.headers.Authorization && (await services.getUserIdFromToken(event.headers.Authorization));

  if (!userId) {
    callback(undefined, forbidden('Service requires authenticated user'));
    return;
  }

  await handler(Object.assign({}, params, { userId }));
};
