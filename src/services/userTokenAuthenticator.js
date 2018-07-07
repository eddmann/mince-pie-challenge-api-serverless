// @flow

import type { UserTokenAuthenticator } from '../types';

import https from 'https';
import jose from 'node-jose';

const generateKeySetUrl = poolId => {
  const region = poolId.split('_')[0];
  return `https://cognito-idp.${region}.amazonaws.com/${poolId}/.well-known/jwks.json`;
};

const fetchKey = (poolId, token) => {
  const { kid } = JSON.parse(jose.util.base64url.decode(token.split('.')[0]));

  return new Promise((res, rej) => {
    https.get(generateKeySetUrl(poolId), response => {
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
        throw Error('Token has expired');
      }

      return claims;
    });

export default (poolId: string): UserTokenAuthenticator => async token => {
  try {
    const key = await fetchKey(poolId, token);
    const claims = await parseClaims(token, key);
    return claims.sub;
  } catch (e) {
    return undefined;
  }
};
