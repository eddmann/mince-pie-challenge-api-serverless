// @flow

import list from './handlers/list';
import { allPies } from 'db';

const { TABLE_NAME } = process.env;

if (!TABLE_NAME) {
  throw new Error('TABLE_NAME is not present');
}

export const handler = list({
  allPies: allPies(TABLE_NAME),
});
