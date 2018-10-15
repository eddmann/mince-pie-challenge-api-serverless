import handler from '../handlers/remove';

it('requires an authenticated user', async () => {
  const services = { getUserIdFromToken: () => Promise.resolve() };

  const response = parseResponse(
    await handler(services)({ headers: {}, pathParameters: { id: '1' } }, {}),
  );

  expect(response.statusCode).toBe(401);
});

it('requires a pie to be present', async () => {
  const services = {
    getUserIdFromToken: () => Promise.resolve('USER_ID'),
    getPie: () => Promise.resolve(),
  };

  const response = parseResponse(
    await handler(services)({ headers: { Authorization: 'TOKEN' }, pathParameters: { id: '1' } }, {}),
  );

  expect(response.statusCode).toBe(404);
});

it('requires the user to own the pie', async () => {
  const services = {
    getUserIdFromToken: () => Promise.resolve('USER_ID'),
    getPie: () => Promise.resolve({ Id: '1', UserId: 'ANOTHER_USER_ID' }),
  };

  const response = parseResponse(
    await handler(services)({ headers: { Authorization: 'TOKEN' }, pathParameters: { id: '1' } }, {}),
  );

  expect(response.statusCode).toBe(403);
});

it('removes the users pie', async () => {
  const services = {
    getUserIdFromToken: () => Promise.resolve('USER_ID'),
    getPie: () => Promise.resolve({ Id: '1', UserId: 'USER_ID' }),
    removePie: jest.fn(),
  };

  const response = parseResponse(
    await handler(services)({ headers: { Authorization: 'TOKEN' }, pathParameters: { id: '1' } }, {}),
  );

  expect(response.statusCode).toBe(204);
  expect(services.removePie).toHaveBeenCalledWith('1');
});
