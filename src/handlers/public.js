// @flow

import { createHandler } from '../helpers/handlers';

const handler = async () => ({
  statusCode: 200,
  body: JSON.stringify({ userId: 'N/A' }),
});

export default createHandler(handler);
