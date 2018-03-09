import add from '../handlers/add';

const response = () =>
  function cb(error, response) {
    if (error) fail(`Unexpected error: ${error}`);
    cb.response = response;
  };

it('requires an authenticated user', async () => {
  const services = { getUserIdFromToken: () => Promise.resolve() };
  const callback = response();

  await add(services)({ headers: { Authorization: '' } }, {}, callback, undefined);

  expect(callback.response).toMatchSnapshot();
});

it('requires a pie name', async () => {
  const services = { getUserIdFromToken: () => Promise.resolve('USER_ID') };
  const callback = response();

  await add(services)({ headers: { Authorization: 'TOKEN' } }, {}, callback, undefined);

  expect(callback.response).toMatchSnapshot();
});

it('adds a new mince pie', async () => {
  const services = {
    getUserIdFromToken: () => Promise.resolve('USER_ID'),
    db: { add: jest.fn() },
  };
  const callback = response();
  const body = JSON.stringify({ name: 'Mince Pie' });

  await add(services)({ headers: { Authorization: 'TOKEN' }, body }, {}, callback, undefined);

  expect(callback.response.statusCode).toEqual(201);
  expect(services.db.add).toBeCalled();
  const newPie = services.db.add.mock.calls[0][0];
  expect(newPie.UserId).toEqual('USER_ID');
  expect(newPie.Name).toEqual('Mince Pie');
});
