import AWS from 'aws-sdk';
import * as db from './helpers/db';
import { notFound, unauthorised, badRequest, created, json } from './helpers/http';
import { strictAuthenticate } from './middleware/auth';
import { Resource } from 'hal';

const { PHOTO_BUCKET_NAME, PHOTO_UPLOAD_PATH } = process.env;

const isOwner = (user, pie) => user && user.sub === pie.UserId;

export const photoUpload = strictAuthenticate(async function (event, context, callback, user) {
  const { id } = event.pathParameters;

  const pie = await db.get(id);

  if (!pie) {
    callback(undefined, notFound('Unable to find the specified mince pie.'));
    return;
  }

  if (!isOwner(user, pie)) {
    callback(undefined, unauthorised('This mince pie does not belong to you.'));
    return;
  }

  const { fileExtension, contentType } = json(event.body);

  if (!fileExtension || !contentType) {
    const errors = [];
    if (!fileExtension) errors.push({ 'name': 'fileExtension', 'reason': 'You must supply the file extension.' });
    if (!contentType) errors.push({ 'name': 'contentType', 'reason': 'You must supply the content-type.' });

    callback(undefined, badRequest('Invalid request body', errors));
    return;
  }

  const s3 = new AWS.S3();

  const url = s3.getSignedUrl('putObject', {
    Bucket: PHOTO_BUCKET_NAME,
    Key: `${PHOTO_UPLOAD_PATH}/${pie.Id}.${fileExtension}`,
    Expires: 60,
    ContentType: contentType,
    ACL: 'public-read',
  });

  callback(undefined, created(new Resource({ url }, url)));
});
