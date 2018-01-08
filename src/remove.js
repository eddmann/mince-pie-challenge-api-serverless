import * as db from './helpers/db';
import { notFound, unauthorised, noContent } from './helpers/http';
import { strictAuthenticate } from './middleware/auth';

const isOwner = (user, pie) => user && user.sub === pie.UserId;

export const remove = strictAuthenticate(async function (event, context, callback, user) {
  const { id } = event.pathParameters;

  const pie = await db.get(id);

  if (!pie) {
    callback(undefined, notFound('Unable to find the specified mince pie.'));
    return;
  }

  if (!isOwner(user, pie)) {
    callback(undefined, unauthorised('This mince pie does not belong to you.'));
    return;
  }

  await db.remove(pie.Id);

  callback(undefined, noContent());
});
