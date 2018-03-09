// @flow

import type { APIGatewayEvent, Context, Callback, ProxyResult } from 'flow-aws-lambda';

export type Response = ProxyResult;

export type UUID = string;

export type UserId = string;

export type HALResource = {
  _links: { [string]: any },
  toJSON: Function,
};

type URL = string;

export type Pie = {
  Id: UUID,
  UserId: UserId,
  Name: string,
  AvgRating: number,
  PhotoUrl: ?URL,
  ThumbnailUrl: ?URL,
  Ratings: { [UserId]: number },
  AddedAt: number,
};

export type UserIdToken = string => Promise<UserId>;

type Services = { [string]: any };

type OptionalUserParameters = {
  event: APIGatewayEvent,
  context: Context,
  callback: Callback,
  services: Services,
  userId?: UserId,
};

type AuthenticatedUserParameters = {
  event: APIGatewayEvent,
  context: Context,
  callback: Callback,
  services: Services,
  userId: UserId,
};

type Parameters = OptionalUserParameters | AuthenticatedUserParameters;

export type Handler = Parameters => Promise<void>;

export type OptionalUserHandlerMiddleware = ((OptionalUserParameters) => Promise<void>) => Handler;

export type AuthenticatedUserHandlerMiddlware = ((AuthenticatedUserParameters) => Promise<void>) => Handler;

export type HandlerWithServices = Handler => Services => (APIGatewayEvent, Context, Callback) => Promise<void>;
