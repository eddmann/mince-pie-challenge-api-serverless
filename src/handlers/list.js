// @flow

import { createHandler } from '../helpers/handlers';
import { ok } from '../helpers/http';
import { Resource } from 'hal';

const list = async ({ services: { allPies } }) => {
  const pies = (await allPies()).map(
    pie =>
      new Resource(
        {
          id: pie.Id,
          name: pie.Name,
          thumbnail: pie.ThumbnailUrl,
          rating: { avg: pie.AvgRating, total: pie.TotalRatings },
        },
        `/pies/${pie.Id}`,
      ),
  );

  const resource = new Resource({ total: pies.length }, '/pies');

  resource.embed('pies', pies);

  return ok(resource);
};

export default createHandler(list);
