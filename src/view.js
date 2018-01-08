import * as db from './helpers/db';
import { notFound, ok } from './helpers/http';
import { authenticate } from './middleware/auth';
import { Resource } from 'hal';

const hasNotRated = (user, pie) => user && !pie.Ratings[user.sub];
const isOwner = (user, pie) => user && user.sub === pie.UserId;
const isAbleToUploadPhoto = (user, pie) => isOwner(user, pie) && !pie.PhotoUrl;

export const view = authenticate(async function (event, context, callback, user) {
  const { id } = event.pathParameters;

  const pie = await db.get(id);

  if (!pie) {
    callback(undefined, notFound('Unable to find the specified mince pie.'));
    return;
  }

  const resource = new Resource({
    id: pie.Id,
    name: pie.Name,
    rating: { avg: pie.AvgRating, total: Object.keys(pie.Ratings).length },
    photo: pie.PhotoUrl,
    thumbnail: pie.ThumbnailUrl,
    addedAt: new Date(pie.AddedAt).toISOString(),
  }, `/pies/${pie.Id}`);

  if (hasNotRated(user, pie)) resource.link('rate', `/pies/${pie.Id}/rate`);
  if (isOwner(user, pie)) resource.link('remove', `/pies/${pie.Id}`);
  if (isAbleToUploadPhoto(user, pie)) resource.link('photo', `/pies/${pie.Id}/photo`);

  callback(undefined, ok(resource));
});
