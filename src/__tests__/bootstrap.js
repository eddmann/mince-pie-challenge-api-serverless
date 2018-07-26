import handler from '../handlers/bootstrap';

it('displays the bootstrap details', async () => {
  const services = {
    getPoolId: () => 'POOL_ID',
    getClientId: () => 'CLIENT_ID',
    getBaseEndpointUrl: () => 'BASE_ENDPOINT_URL',
  };

  const response = parseResponse(await handler(services)({}, {}));

  expect(response.statusCode).toBe(200);
  expect(response.body.cognito.poolId).toBe('POOL_ID');
  expect(response.body.cognito.clientId).toBe('CLIENT_ID');
  expect(response.body.baseEndpointUrl).toBe('BASE_ENDPOINT_URL');
});
