// @flow

import type { HandlerWithServices, OptionalUserHandlerMiddleware, AuthenticatedUserHandlerMiddlware } from '../types';

import { unauthorised } from './http';

export const createHandler: HandlerWithServices = handler => services => (event, context) =>
  handler({ event, context, services });

export const withOptionalHttpAuthentication: OptionalUserHandlerMiddleware = handler => async ({
  event,
  context,
  services,
}) => {
  const userId = await services.getUserIdFromToken(event.headers.Authorization);
  return handler({ event, context, services, userId });
};

export const withStrictHttpAuthentication: AuthenticatedUserHandlerMiddlware = handler => async ({
  event,
  context,
  services,
}) => {
  const userId = await services.getUserIdFromToken(event.headers.Authorization);
  return userId
    ? handler({ event, context, services, userId })
    : unauthorised('Service requires an authenticated user');
};
