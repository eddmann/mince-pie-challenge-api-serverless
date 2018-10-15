import handler from '../handlers/view';

const createPie = custom => ({
  Id: '1',
  UserId: 'USER_ID',
  Name: 'Sample Mince Pie',
  AvgRating: 0,
  TotalRatings: 0,
  Ratings: {},
  PhotoUrl: 'http://photo.url',
  ThumbnailUrl: 'http://thumbnail.url',
  AddedAt: 1528217691,
  ...custom
});

it('displays a users pie', async () => {
  const pie = createPie({ UserId: 'ANOTHER_USER_ID' });

  const services = {
    getUserIdFromToken: () => Promise.resolve(),
    getPie: () => Promise.resolve(pie),
  };

  const response = parseResponse(await handler(services)({ headers: {} }, {}));

  expect(response.statusCode).toBe(200);
  expect(response.body.name).toBe('Sample Mince Pie');
  expect(response.body._links).not.toHaveProperty('remove');
  expect(response.body._links).not.toHaveProperty('rate');
  expect(response.body._links).not.toHaveProperty('photo');
});

it('displays the photo action when no photo is present for your pie', async () => {
  const pie = createPie({ PhotoUrl: undefined, ThumbnailUrl: undefined });

  const services = {
    getUserIdFromToken: () => Promise.resolve('USER_ID'),
    getPie: () => Promise.resolve(pie),
  };

  const response = parseResponse(await handler(services)({ headers: { Authorization: 'TOKEN' } }, {}));

  expect(response.statusCode).toBe(200);
  expect(response.body._links).toHaveProperty('photo');
});

it('displays the remove action when viewing your own pie', async () => {
  const pie = createPie({});

  const services = {
    getUserIdFromToken: () => Promise.resolve('USER_ID'),
    getPie: () => Promise.resolve(pie),
  };

  const response = parseResponse(await handler(services)({ headers: { Authorization: 'TOKEN' } }, {}));

  expect(response.statusCode).toBe(200);
  expect(response.body._links).toHaveProperty('remove');
});

it('displays the rate action when we have not yet rated the pie', async () => {
  const pie = createPie({});

  const services = {
    getUserIdFromToken: () => Promise.resolve('USER_ID'),
    getPie: () => Promise.resolve(pie),
  };

  const response = parseResponse(await handler(services)({ headers: { Authorization: 'TOKEN' } }, {}));

  expect(response.statusCode).toBe(200);
  expect(response.body._links).toHaveProperty('rate');
});

it('does not display the rate action when we have rated the pie', async () => {
  const pie = createPie({ Ratings: { 'USER_ID': 3 }, AvgRating: 3, TotalRatings: 1 });

  const services = {
    getUserIdFromToken: () => Promise.resolve('USER_ID'),
    getPie: () => Promise.resolve(pie),
  };

  const response = parseResponse(await handler(services)({ headers: { Authorization: 'TOKEN' } }, {}));

  expect(response.statusCode).toBe(200);
  expect(response.body._links).not.toHaveProperty('rate');
});
