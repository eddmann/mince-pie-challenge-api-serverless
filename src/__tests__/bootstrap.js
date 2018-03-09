import bootstrap from '../handlers/bootstrap';

const response = () =>
  function cb(error, response) {
    if (error) fail(`Unexpected error: ${error}`);
    cb.response = response;
  };

it('displays bootstrap details', async () => {
  const services = {
    env: {
      USER_POOL_NAME: 'eu-west-1_POOL_NAME',
      USER_POOL_CLIENT_ID: 'CLIENT_ID',
      BASE_ENDPOINT_URL: 'https://base.url',
    },
  };
  const callback = response();

  await bootstrap(services)({}, {}, callback, undefined);

  expect(callback.response).toMatchSnapshot();
});
