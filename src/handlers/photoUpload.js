/* @flow */

import type { UserId, Pie } from '../types';

import { notFound, unauthorised, badRequest, created, json } from '../helpers/http';
import { createHandler, strictHttpAuthentication } from '../helpers/handlers';
import { Resource } from 'hal';

const isOwner = (userId: UserId, pie: Pie) => userId === pie.UserId;

const validatePayload = ({ fileExtension, contentType }) => {
  const errors = [];
  if (!fileExtension) errors.push({ name: 'fileExtension', reason: 'You must supply the file extension.' });
  if (!contentType) errors.push({ name: 'contentType', reason: 'You must supply the content-type.' });
  return errors;
};

const photoUpload = async ({ event, callback, userId, services: { db, S3, env } }) => {
  const { id } = event.pathParameters || {};

  const pie = await db.get(id);

  if (!pie) {
    callback(undefined, notFound('Unable to find the specified mince pie.'));
    return;
  }

  if (!isOwner(userId, pie)) {
    callback(undefined, unauthorised('This mince pie does not belong to you.'));
    return;
  }

  const { fileExtension, contentType } = json(event.body);

  const errors = validatePayload({ fileExtension, contentType });
  if (errors.length > 0) {
    callback(undefined, badRequest('Invalid request body', errors));
    return;
  }

  const s3 = new S3();

  const url = s3.getSignedUrl('putObject', {
    Bucket: env.PHOTO_BUCKET_NAME,
    Key: `${env.PHOTO_UPLOAD_PATH}/${pie.Id}.${fileExtension}`,
    Expires: 60,
    ContentType: contentType,
    ACL: 'public-read',
  });

  callback(undefined, created(new Resource({ url }, url)));
};

export default createHandler(strictHttpAuthentication(photoUpload));
