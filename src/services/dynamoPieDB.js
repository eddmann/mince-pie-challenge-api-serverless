/* @flow */

import type { Pie, UUID } from '../types';

import AWS from 'aws-sdk';

const { TABLE_NAME } = process.env;
const dynamo = new AWS.DynamoDB.DocumentClient();

export const all = (): Promise<Array<Pie>> =>
  dynamo
    .scan({ TableName: TABLE_NAME })
    .promise()
    .then(r => r.Items);

export const add = (pie: Pie): Promise<void> =>
  dynamo.put(Object.assign({ TableName: TABLE_NAME, Item: pie })).promise();

export const get = (id: UUID): Promise<Pie> =>
  dynamo
    .get({ TableName: TABLE_NAME, Key: { Id: id } })
    .promise()
    .then(r => r.Item);

export const remove = (id: UUID): Promise<void> => dynamo.delete({ TableName: TABLE_NAME, Key: { Id: id } }).promise();

export const update = (id: UUID, attrs: {}): Promise<void> =>
  dynamo.update(Object.assign({ TableName: TABLE_NAME, Key: { Id: id } }, attrs)).promise();
