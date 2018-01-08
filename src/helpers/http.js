const hal = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': '*',
  'Content-Type': 'application/hal+json',
};

const problem = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': '*',
  'Content-Type': 'application/problem+json',
};

export const ok = resource =>
  ({ statusCode: 200, headers: hal, body: JSON.stringify(resource.toJSON()) });

export const created = resource =>
  ({ statusCode: 201,
     headers: Object.assign({}, hal, { 'Location': resource._links.self.href }),
     body: JSON.stringify(resource.toJSON()) });

export const noContent = () =>
  ({ statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': '*' } });

export const badRequest = (detail, errors) =>
  ({ statusCode: 400, headers: problem, body: JSON.stringify({ title: 'Bad Request', detail, errors }) });

export const unauthorised = detail =>
  ({ statusCode: 401, headers: problem, body: JSON.stringify({ title: 'Unauthorized', detail }) });

export const forbidden = detail =>
  ({ statusCode: 403, headers: problem, body: JSON.stringify({ title: 'Forbidden', detail }) });

export const notFound = detail =>
  ({ statusCode: 404, headers: problem, body: JSON.stringify({ title: 'Not Found', detail }) });

export const json = string => {
  try {
    return JSON.parse(string) || {};
  } catch (e) {
    return {};
  }
};
