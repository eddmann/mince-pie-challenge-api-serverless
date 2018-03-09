/* @flow */

import * as db from './services/dynamoPieDB';
import { getUserIdFromToken } from './services/cognitoUserToken';
import AWS from 'aws-sdk';
import photoUpload from './handlers/photoUpload';

export const handler = photoUpload({ getUserIdFromToken, db, env: process.env, S3: AWS.S3 });
