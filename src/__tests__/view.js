import view from '../handlers/view';

const response = () =>
  function cb(error, response) {
    if (error) fail(`Unexpected error: ${error}`);
    cb.response = response;
  };

it('views a users pie', async () => {
  const pie = {
    Id: '1',
    UserId: 'ANOTHER_USER_ID',
    Name: 'Another Mince Pie',
    AvgRating: 0,
    PhotoUrl: 'http://photo.url',
    ThumbnailUrl: 'http://thumbnail.url',
    Ratings: {},
    AddedAt: 1528217691,
  };

  const services = {
    db: { get: () => Promise.resolve(pie) },
  };

  const callback = response();

  await view(services)({ headers: {} }, {}, callback, undefined);

  expect(callback.response).toMatchSnapshot();
});

it('displays the photo action when no photo is present for your pie', async () => {
  const pie = {
    Id: '1',
    UserId: 'USER_ID',
    Name: 'Another Mince Pie',
    AvgRating: 0,
    PhotoUrl: undefined,
    ThumbnailUrl: undefined,
    Ratings: {},
    AddedAt: 1528217691,
  };

  const services = {
    getUserIdFromToken: () => Promise.resolve('USER_ID'),
    db: { get: () => Promise.resolve(pie) },
  };

  const callback = response();

  await view(services)({ headers: { Authorization: 'TOKEN' } }, {}, callback, undefined);

  expect(callback.response).toMatchSnapshot();
});

it('displays the remove action when viewing your own pie', async () => {
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
    db: { get: () => Promise.resolve(pie) },
  };

  const callback = response();

  await view(services)({ headers: { Authorization: 'TOKEN' } }, {}, callback, undefined);

  expect(callback.response).toMatchSnapshot();
});
