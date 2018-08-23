// @flow

import { badRequest, created, json } from '../helpers/http';
import { createHandler, withStrictHttpAuthentication } from '../helpers/handlers';
import { Resource } from 'hal';

const add = async ({ event, userId, services: { addPie } }) => {
  const { name } = json(event.body);

  if (!name) {
    return badRequest('Invalid request body', [{ name: 'name', reason: "You must supply the pie's name." }]);
  }

  const pie = await addPie(userId, name);

  const resource = new Resource(
    {
      id: pie.Id,
      name: pie.Name,
      rating: { avg: 0, total: 0 },
      addedAt: new Date(pie.AddedAt).toISOString(),
    },
    `/pies/${pie.Id}`,
  );

  resource.link('photo', `/pies/${pie.Id}/photo`);

  return created(resource);
};

export default createHandler(withStrictHttpAuthentication(add));
