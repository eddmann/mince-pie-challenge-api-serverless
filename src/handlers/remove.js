/* @flow */

import type { UserId, Pie } from '../types';

import { notFound, unauthorised, noContent } from '../helpers/http';
import { createHandler, strictHttpAuthentication } from '../helpers/handlers';

const isOwner = (userId: UserId, pie: Pie) => userId === pie.UserId;

const remove = async ({ event, callback, userId, services: { db } }) => {
  const { id } = event.pathParameters || {};

  const pie = await db.get(id);

  if (!pie) {
    callback(undefined, notFound('Unable to find the specified mince pie.'));
    return;
  }

  if (!isOwner(userId, pie)) {
    callback(undefined, unauthorised('This mince pie does not belong to you.'));
    return;
  }

  await db.remove(pie.Id);

  callback(undefined, noContent());
};

export default createHandler(strictHttpAuthentication(remove));
