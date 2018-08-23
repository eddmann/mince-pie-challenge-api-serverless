import handler from '../handlers/add';

it('requires an authenticated user', async () => {
  const services = { getUserIdFromToken: () => Promise.resolve() };

  const response = parseResponse(await handler(services)({ headers: { Authorization: '' } }, {}));

  expect(response.statusCode).toEqual(401);
});

it('requires a pie name', async () => {
  const services = { getUserIdFromToken: () => Promise.resolve('USER_ID') };

  const response = parseResponse(await handler(services)({ headers: { Authorization: 'TOKEN' } }, {}));

  expect(response.statusCode).toEqual(400);
});

it('adds a new mince pie', async () => {
  const services = {
    getUserIdFromToken: () => Promise.resolve('USER_ID'),
    addPie: jest.fn((userId, name) => ({ Id: '123456', Name: name, UserId: userId, AddedAt: 12345678 })),
  };
  const body = JSON.stringify({ name: 'Mince Pie' });

  const response = parseResponse(await handler(services)({ headers: { Authorization: 'TOKEN' }, body }, {}));

  expect(response.statusCode).toEqual(201);
  expect(services.addPie).toHaveBeenCalledWith('USER_ID', 'Mince Pie');
});
