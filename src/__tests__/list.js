import list from '../handlers/list';

const response = () =>
  function cb(error, response) {
    if (error) fail(`Unexpected error: ${error}`);
    cb.response = response;
  };

it('list mince pies', async () => {
  const pies = [
    {
      Id: '1',
      UserId: 'USER_ID',
      Name: 'Mince Pie',
      AvgRating: 0,
      PhotoUrl: undefined,
      ThumbnailUrl: undefined,
      Ratings: {},
      AddedAt: '123456789',
    },
    {
      Id: '2',
      UserId: 'USER_ID',
      Name: 'Another Mince Pie',
      AvgRating: 0,
      PhotoUrl: undefined,
      ThumbnailUrl: undefined,
      Ratings: {},
      AddedAt: '123456789',
    },
  ];

  const services = {
    db: { all: jest.fn(() => Promise.resolve(pies)) },
  };

  const callback = response();

  await list(services)({}, {}, callback, undefined);

  expect(callback.response).toMatchSnapshot();
});
