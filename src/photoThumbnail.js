import AWS from 'aws-sdk';
import * as db from './services/dynamoPieDB';
const gm = require('gm').subClass({ imageMagick: true });

const { PHOTO_THUMBNAIL_PATH, PHOTO_THUMBNAIL_SIZE } = process.env;
const [width, height] = PHOTO_THUMBNAIL_SIZE.split('x');

const s3 = new AWS.S3();

const resizeAndAssign = record => {
  const bucket = record.s3.bucket.name;
  const uploadKey = record.s3.object.key;
  const id = uploadKey.split('/')[1].split('.')[0];
  const thumbnailKey = `${PHOTO_THUMBNAIL_PATH}/${id}.png`;

  const resize = s3
    .getObject({ Bucket: bucket, Key: uploadKey })
    .promise()
    .then(
      ({ Body }) =>
        new Promise((res, rej) => {
          gm(Body)
            .resize(width, height, '^')
            .gravity('Center')
            .crop(width, height)
            .setFormat('png')
            .toBuffer((err, buffer) => {
              if (err) rej(err);
              else res(buffer);
            });
        }),
    )
    .then(buffer =>
      s3
        .putObject({
          Bucket: bucket,
          Key: thumbnailKey,
          ACL: 'public-read',
          Body: buffer,
          ContentType: 'image/png',
        })
        .promise(),
    );

  const assign = resize.then(() => db.get(id)).then(pie =>
    db.update(pie.Id, {
      UpdateExpression: 'SET PhotoUrl = :PhotoUrl, ThumbnailUrl = :ThumbnailUrl',
      ExpressionAttributeValues: {
        ':PhotoUrl': `https://s3-${record.awsRegion}.amazonaws.com/${bucket}/${uploadKey}`,
        ':ThumbnailUrl': `https://s3-${record.awsRegion}.amazonaws.com/${bucket}/${thumbnailKey}`,
      },
      ReturnValues: 'ALL_NEW',
    }),
  );

  return assign
    .then(() => `Successfully resized ${uploadKey} to ${thumbnailKey}`)
    .catch(error => JSON.stringify({ message: `Failed to resize ${uploadKey} to ${thumbnailKey}`, error }));
};

export const handler = event => Promise.all(event.Records.map(resizeAndAssign)).then(console.log);
