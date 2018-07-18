// @flow

import { createHandler, withOptionalHttpAuthentication } from '../helpers/handlers';

const handler = async ({ userId = 'N/A' }) => ({
  statusCode: 200,
  body: JSON.stringify({ userId }),
});

export default createHandler(withOptionalHttpAuthentication(handler));
