import handler from '../handlers/optional';

it('successfully responds with no user id when access token not found', async () => {
  const services = { getUserIdFromToken: () => Promise.resolve() };

  const response = parseResponse(await handler(services)({ headers: { Authorization: 'TOKEN' } }, {}));

  expect(response.statusCode).toBe(200);
  expect(response.body.userId).toBe('N/A');
});

it('successfully responds with a user id when access token found', async () => {
  const services = { getUserIdFromToken: () => Promise.resolve('USER_ID') };

  const response = parseResponse(await handler(services)({ headers: { Authorization: 'TOKEN' } }, {}));

  expect(response.statusCode).toBe(200);
  expect(response.body.userId).toBe('USER_ID');
});
