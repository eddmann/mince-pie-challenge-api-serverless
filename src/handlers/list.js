/* @flow */

import { createHandler } from '../helpers/handlers';
import { ok } from '../helpers/http';
import { Resource } from 'hal';

const list = async ({ callback, services: { db } }) => {
  const pies = (await db.all()).map(
    pie =>
      new Resource(
        {
          id: pie.Id,
          name: pie.Name,
          thumbnail: pie.ThumbnailUrl,
          rating: { avg: pie.AvgRating, total: Object.keys(pie.Ratings).length },
        },
        `/pies/${pie.Id}`,
      ),
  );

  const resource = new Resource({ total: pies.length }, '/pies');

  resource.embed('pies', pies);

  callback(undefined, ok(resource));
};

export default createHandler(list);
