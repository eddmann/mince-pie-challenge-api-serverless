/* @flow */

import type { UserIdToken } from '../types';

import https from 'https';
import jose from 'node-jose';

const { USER_POOL_NAME } = process.env;

const fetchKey = token => {
  const { kid } = JSON.parse(jose.util.base64url.decode(token.split('.')[0]));

  const poolId = (USER_POOL_NAME && USER_POOL_NAME.split('/')[1]) || '';
  const poolRegion = (poolId && poolId.split('_')[0]) || '';
  const keysUrl = `https://cognito-idp.${poolRegion}.amazonaws.com/${poolId}/.well-known/jwks.json`;

  return new Promise((res, rej) => {
    https.get(keysUrl, response => {
      if (response.statusCode !== 200) {
        rej('Unable to fetch keys');
        return;
      }

      response.on('data', body => {
        const { keys } = JSON.parse(body);
        const key = keys.find(key => key.kid === kid);

        if (!key) {
          rej('Unable to find key');
          return;
        }

        jose.JWK.asKey(key).then(res);
      });
    });
  });
};

const parseClaims = (token, key) =>
  jose.JWS.createVerify(key)
    .verify(token)
    .then(({ payload }) => {
      const claims = JSON.parse(payload);

      if (Math.floor(new Date() / 1000) > claims.exp) {
        throw Error('Token is expired');
      }

      return claims;
    });

export const getUserIdFromToken: UserIdToken = async token => {
  const key = await fetchKey(token);
  const claims = await parseClaims(token, key);
  return claims.sub;
};
