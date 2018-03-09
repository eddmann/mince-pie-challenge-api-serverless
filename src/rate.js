/* @flow */

import * as db from './services/dynamoPieDB';
import { getUserIdFromToken } from './services/cognitoUserToken';
import rate from './handlers/rate';

export const handler = rate({ getUserIdFromToken, db });
