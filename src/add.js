/* @flow */

import * as db from './services/dynamoPieDB';
import { getUserIdFromToken } from './services/cognitoUserToken';
import add from './handlers/add';

export const handler = add({ getUserIdFromToken, db });
