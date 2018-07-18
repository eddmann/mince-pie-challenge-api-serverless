// @flow

import { createHandler, withStrictHttpAuthentication } from '../helpers/handlers';

const handler = async ({ userId }) => ({
  statusCode: 200,
  body: JSON.stringify({ userId }),
});

export default createHandler(withStrictHttpAuthentication(handler));
