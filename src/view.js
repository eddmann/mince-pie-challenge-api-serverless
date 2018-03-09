/* @flow */

import * as db from './services/dynamoPieDB';
import { getUserIdFromToken } from './services/cognitoUserToken';
import view from './handlers/view';

export const handler = view({ getUserIdFromToken, db });
