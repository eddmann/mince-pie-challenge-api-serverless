/* @flow */

import bootstrap from './handlers/bootstrap';

export const handler = bootstrap({ env: process.env });
