import AWS from 'aws-sdk';

const { TABLE_NAME } = process.env;
const dynamo = new AWS.DynamoDB.DocumentClient;

export const all = () =>
  dynamo.scan({ TableName: TABLE_NAME }).promise().then(r => r.Items);

export const add = item =>
  dynamo.put(Object.assign({ TableName: TABLE_NAME, Item: item })).promise();

export const get = id =>
  dynamo.get({ TableName: TABLE_NAME, Key: { Id: id } }).promise().then(r => r.Item);

export const remove = id =>
  dynamo.delete({ TableName: TABLE_NAME, Key: { Id: id } }).promise();

export const update = (id, attrs) =>
  dynamo.update(Object.assign({ TableName: TABLE_NAME, Key: { Id: id } }, attrs)).promise();
