/* @flow */

import * as db from './services/dynamoPieDB';
import { getUserIdFromToken } from './services/cognitoUserToken';
import remove from './handlers/remove';

export const handler = remove({ getUserIdFromToken, db });
