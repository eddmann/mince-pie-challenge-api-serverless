export const unauthorised = detail => ({
  statusCode: 401,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': '*',
    'Content-Type': 'application/problem+json',
  },
  body: JSON.stringify({ title: 'Unauthorized', detail }),
});
