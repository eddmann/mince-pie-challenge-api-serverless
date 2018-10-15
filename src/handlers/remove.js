// @flow

import type { UserId, Pie } from '../types';

import { notFound, forbidden, noContent } from '../helpers/http';
import { createHandler, withStrictHttpAuthentication } from '../helpers/handlers';
import { Resource } from 'hal';

const isOwner = (userId: UserId, pie: Pie) => userId === pie.UserId;

const remove = async ({ event, userId, services: { getPie, removePie } }) => {
  const { id } = event.pathParameters || {};

  const pie = await getPie(id);

  if (!pie) {
    return notFound('Unable to find the specified mince pie.');
  }

  if (!isOwner(userId, pie)) {
    return forbidden('This mince pie does not belong to you.');
  }

  await removePie(pie.Id);

  return noContent();
};

export default createHandler(withStrictHttpAuthentication(remove));
