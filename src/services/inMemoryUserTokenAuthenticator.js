// @flow

import type { UserTokenAuthenticator } from '../types';

const users = {
  TOKEN1: 'User1',
  TOKEN2: 'User2',
  TOKEN3: 'User3',
};

export default (poolId: string): UserTokenAuthenticator => async token => users[token];
