// @flow

import type { Pie, UserId } from '../types';

import uuid from 'uuid/v4';
import AWS from 'aws-sdk';

const config = { region: 'localhost', endpoint: 'http://dynamodb:8000' };

export const allPies = (tableName: string) => (): Promise<Array<Pie>> =>
  new AWS.DynamoDB.DocumentClient(config)
    .scan({ TableName: tableName })
    .promise()
    .then(r => r.Items);

export const addPie = (tableName: string) => (userId: UserId, name: string): Promise<Pie> => {
  const pie = {
    Id: uuid(),
    UserId: userId,
    Name: name,
    TotalRatings: 0,
    AvgRating: 0,
    Ratings: {},
    PhotoUrl: undefined,
    ThumbnailUrl: undefined,
    AddedAt: new Date().getTime(),
  };

  return new AWS.DynamoDB.DocumentClient(config)
    .put({ TableName: tableName, Item: pie })
    .promise()
    .then(() => pie);
};
