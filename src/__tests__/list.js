import handler from '../handlers/list';

it('lists mince pies', async () => {
  const pies = [
    {
      Id: '1',
      UserId: 'USER_ID',
      Name: 'Mince Pie',
      TotalRatings: 0,
      AvgRating: 0,
      Ratings: {},
      PhotoUrl: undefined,
      ThumbnailUrl: undefined,
      AddedAt: 123456789,
    },
    {
      Id: '2',
      UserId: 'USER_ID',
      Name: 'Another Mince Pie',
      TotalRatings: 0,
      AvgRating: 0,
      Ratings: {},
      PhotoUrl: undefined,
      ThumbnailUrl: undefined,
      AddedAt: 123456789,
    },
  ];

  const services = {
    allPies: () => Promise.resolve(pies),
  };

  const response = parseResponse(await handler(services)({}, {}));

  expect(response.statusCode).toEqual(200);
  expect(response.body.total).toBe(2);
  expect(response.body._embedded.pies).toHaveLength(2);
});
