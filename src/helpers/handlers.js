import { unauthorised } from './http';

export const createHandler = handler => services => (event, context) =>
  handler({ event, context, services });

export const withOptionalHttpAuthentication = handler => async params => {
  const { event, services } = params;
  const userId = await services.getUserIdFromToken(event.headers.Authorization);
  return handler({ ...params, userId });
};

export const withStrictHttpAuthentication = handler => async params => {
  const { event, services } = params;
  const userId = await services.getUserIdFromToken(event.headers.Authorization);
  return userId ? handler({ ...params, userId }) : unauthorised('Service requires an authenticated user');
};
