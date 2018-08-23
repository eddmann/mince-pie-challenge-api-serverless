// @flow

import type { APIGatewayEvent, Context, ProxyResult } from 'flow-aws-lambda';

export type Response = ProxyResult;

type Token = string;

type UserId = string;

export type UserTokenAuthenticator = Token => Promise<?UserId>;

type Services = {
  [name: string]: Function,
};

type OptionalUserParameters = {
  event: APIGatewayEvent,
  context: Context,
  services: Services,
  userId?: ?UserId,
};

type AuthenticatedUserParameters = {
  event: APIGatewayEvent,
  context: Context,
  services: Services,
  userId: UserId,
};

type Parameters = OptionalUserParameters | AuthenticatedUserParameters;

type Handler = Parameters => Promise<Response>;

export type HandlerWithServices = Handler => Services => (APIGatewayEvent, Context) => Promise<Response>;

type UserHandlerMiddleware<T: Parameters> = ((T) => Promise<Response>) => Handler;

export type OptionalUserHandlerMiddleware = UserHandlerMiddleware<OptionalUserParameters>;

export type AuthenticatedUserHandlerMiddlware = UserHandlerMiddleware<AuthenticatedUserParameters>;

export type HALResource = {
  _links: { [string]: any },
  toJSON: () => {},
};
