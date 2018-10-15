// @flow

import type { UserId, Pie } from '../types';

import { notFound, ok } from '../helpers/http';
import { createHandler, withOptionalHttpAuthentication } from '../helpers/handlers';
import { Resource } from 'hal';

const hasNotRated = (userId: ?UserId, pie: Pie) => userId && !pie.Ratings[userId];
const isOwner = (userId: ?UserId, pie: Pie) => userId && userId === pie.UserId;
const isAbleToUploadPhoto = (userId: ?UserId, pie: Pie) => isOwner(userId, pie) && !pie.PhotoUrl;

const view = async ({ event, userId, services: { getPie } }) => {
  const { id } = event.pathParameters || {};

  const pie = await getPie(id);

  if (!pie) {
    return notFound('Unable to find the specified mince pie.');
  }

  const resource = new Resource(
    {
      id: pie.Id,
      name: pie.Name,
      rating: { avg: pie.AvgRating, total: pie.TotalRatings },
      photo: pie.PhotoUrl,
      thumbnail: pie.ThumbnailUrl,
      addedAt: new Date(pie.AddedAt).toISOString(),
    },
    `/pies/${pie.Id}`,
  );

  if (hasNotRated(userId, pie)) resource.link('rate', `/pies/${pie.Id}/rate`);
  if (isOwner(userId, pie)) resource.link('remove', `/pies/${pie.Id}`);
  if (isAbleToUploadPhoto(userId, pie)) resource.link('photo', `/pies/${pie.Id}/photo`);

  return ok(resource);
};

export default createHandler(withOptionalHttpAuthentication(view));
