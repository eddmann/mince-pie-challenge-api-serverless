import remove from '../handlers/remove';

const response = () =>
  function cb(error, response) {
    if (error) fail(`Unexpected error: ${error}`);
    cb.response = response;
  };

it('requires an authenticated user', async () => {
  const services = { getUserIdFromToken: () => Promise.resolve() };
  const callback = response();

  await remove(services)({ headers: { Authorization: '' } }, {}, callback, undefined);

  expect(callback.response).toMatchSnapshot();
});

it('requires a pie to be present', async () => {
  const services = {
    getUserIdFromToken: () => Promise.resolve('USER_ID'),
    db: { get: () => Promise.resolve(undefined) },
  };
  const callback = response();

  await remove(services)({ headers: { Authorization: 'TOKEN' } }, {}, callback, undefined);

  expect(callback.response).toMatchSnapshot();
});

it('requires the user to own the pie', async () => {
  const services = {
    getUserIdFromToken: () => Promise.resolve('USER_ID'),
    db: { get: () => Promise.resolve({ Id: 1, UserId: 'ANOTHER_USER_ID' }) },
  };
  const callback = response();

  await remove(services)({ headers: { Authorization: 'TOKEN' } }, {}, callback, undefined);

  expect(callback.response).toMatchSnapshot();
});

it('remove the users pie', async () => {
  const services = {
    getUserIdFromToken: () => Promise.resolve('USER_ID'),
    db: {
      get: () => Promise.resolve({ Id: 1, UserId: 'USER_ID' }),
      remove: jest.fn(),
    },
  };
  const callback = response();

  await remove(services)({ headers: { Authorization: 'TOKEN' } }, {}, callback, undefined);

  expect(callback.response.statusCode).toEqual(204);
  expect(services.db.remove).toBeCalled();
  expect(services.db.remove.mock.calls[0][0]).toEqual(1);
});
