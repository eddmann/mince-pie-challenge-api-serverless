import CognitoExpress from 'cognito-express';
import { forbidden } from '../helpers/http';

const { USER_POOL_NAME } = process.env;
const poolId = USER_POOL_NAME.split('/')[1];
const poolRegion = poolId.split('_')[0];

const cognitoExpress = new CognitoExpress({
  region: poolRegion,
  cognitoUserPoolId: poolId,
  tokenUse: 'id',
  tokenExpiration: 3600000, // 1 hour
});

const getUserFrom = (token) => new Promise((res, rej) => {
  cognitoExpress.validate(token, (err, user) => {
    if (err) rej(err)
    else res(user);
  });
});

export const strictAuthenticate = (handler) => async (event, context, callback) => {
  const token = event.headers.Authorization;

  if (!token) {
    return callback(undefined, forbidden('Service requires authenticated user'));
  }

  try {
    return handler(event, context, callback, await getUserFrom(token));
  } catch (e) {
    return callback(undefined, forbidden('Service requires authenticated user'));
  }
};

export const authenticate = (handler) => async (event, context, callback) => {
  const token = event.headers.Authorization;

  if (!token) {
    return handler(event, context, callback, undefined);
  }

  try {
    return handler(event, context, callback, await getUserFrom(token));
  } catch (e) {
    return callback(undefined, forbidden('Service requires authenticated user'));
  }
};
