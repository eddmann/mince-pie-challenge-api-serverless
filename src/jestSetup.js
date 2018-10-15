global.parseResponse = response => {
  expect(response).toMatchSnapshot();
  response.body = JSON.parse(response.body || '{}');
  return response;
};
