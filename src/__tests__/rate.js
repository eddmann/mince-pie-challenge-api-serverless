import rate from '../handlers/rate';

const response = () =>
  function cb(error, response) {
    if (error) fail(`Unexpected error: ${error}`);
    cb.response = response;
  };

it('requires an authenticated user', async () => {
  const services = { getUserIdFromToken: () => Promise.resolve() };
  const callback = response();

  await rate(services)({ headers: { Authorization: '' } }, {}, callback, undefined);

  expect(callback.response).toMatchSnapshot();
});

it('ensures only valid ratings are stored', async () => {
  const pie = {
    Id: '1',
    UserId: 'USER_ID',
    Name: 'Another Mince Pie',
    AvgRating: 0,
    PhotoUrl: 'http://photo.url',
    ThumbnailUrl: 'http://thumbnail.url',
    Ratings: {},
    AddedAt: 1528217691,
  };

  const services = {
    getUserIdFromToken: () => Promise.resolve('USER_ID'),
    db: {
      get: () => Promise.resolve(pie),
      update: jest.fn(),
    },
  };
  const body = JSON.stringify({ rating: 7 });
  const callback = response();

  await rate(services)({ headers: { Authorization: 'TOKEN' }, body }, {}, callback, undefined);

  expect(callback.response).toMatchSnapshot();
});

it('rates a pie', async () => {
  const pie = {
    Id: '1',
    UserId: 'USER_ID',
    Name: 'Another Mince Pie',
    AvgRating: 0,
    PhotoUrl: 'http://photo.url',
    ThumbnailUrl: 'http://thumbnail.url',
    Ratings: {},
    AddedAt: 1528217691,
  };

  const services = {
    getUserIdFromToken: () => Promise.resolve('USER_ID'),
    db: {
      get: () => Promise.resolve(pie),
      update: jest.fn(),
    },
  };
  const body = JSON.stringify({ rating: 5 });
  const callback = response();

  await rate(services)({ headers: { Authorization: 'TOKEN' }, body }, {}, callback, undefined);

  expect(callback.response.statusCode).toEqual(204);
  expect(services.db.update).toBeCalled();
  expect(services.db.update.mock.calls[0][0]).toEqual('1');
});
