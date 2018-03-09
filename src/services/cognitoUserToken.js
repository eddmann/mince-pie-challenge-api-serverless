/* @flow */

import type { UserIdToken } from '../types';

import CognitoExpress from 'cognito-express';

const { USER_POOL_NAME } = process.env;
const poolId = USER_POOL_NAME && USER_POOL_NAME.split('/')[1];
const poolRegion = poolId && poolId.split('_')[0];

export const getUserIdFromToken: UserIdToken = token =>
  new Promise((res, rej) => {
    const cognitoExpress = new CognitoExpress({
      region: poolRegion,
      cognitoUserPoolId: poolId,
      tokenUse: 'id',
      tokenExpiration: 3600000, // 1 hour
    });

    cognitoExpress.validate(token, (err, user) => {
      if (err) rej(err);
      else res(user && user.sub);
    });
  });
