/* @flow */

import * as db from './services/dynamoPieDB';
import list from './handlers/list';

export const handler = list({ db });
