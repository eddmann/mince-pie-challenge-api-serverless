import uuid from 'uuid';
import * as db from './helpers/db';
import { badRequest, created, json } from './helpers/http';
import { strictAuthenticate } from './middleware/auth';
import { Resource } from 'hal';

export const add = strictAuthenticate(async function (event, context, callback, user) {
  const { name } = json(event.body);

  if (!name) {
    callback(undefined, badRequest(
      'Invalid request body',
      [{ 'name': 'name', 'reason': "You must supply the pie's name." }]));
    return;
  }

  const pie = {
    Id: uuid.v1(),
    UserId: user.sub,
    Name: name,
    AvgRating: 0,
    PhotoUrl: undefined,
    ThumbnailUrl: undefined,
    Ratings: {},
    AddedAt: new Date().getTime(),
  };

  await db.add(pie);

  const resource = new Resource({
    id: pie.Id,
    name: pie.Name,
    rating: { avg: 0, total: 0 },
    addedAt: new Date(pie.AddedAt).toISOString(),
  }, `/pies/${pie.Id}`);

  resource.link('photo', `/pies/${pie.Id}/photo`);

  callback(undefined, created(resource));
});
