import * as db from './helpers/db';
import { notFound, badRequest, noContent, json } from './helpers/http';
import { strictAuthenticate } from './middleware/auth';

const avgRating = pie => {
  const ratings = Object.values(pie.Ratings);
  return ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;
}

const isValid = rating => rating > 0 && rating < 6;

export const rate = strictAuthenticate(async function (event, context, callback, user) {
  const { id } = event.pathParameters;

  const pie = await db.get(id);

  if (!pie) {
    callback(undefined, notFound('Unable to find the specified mince pie.'));
    return;
  }

  const { rating } = json(event.body);

  if (!isValid(rating)) {
    callback(undefined, badRequest(
      'Invalid request body',
      [{ 'name': 'rating', 'reason': 'You must supply a valid pie rating.' }]));
    return;
  }

  pie.Ratings[user.sub] = rating;
  pie.AvgRating = avgRating(pie);

  const attrs = {
    UpdateExpression: 'SET Ratings = :Ratings, AvgRating = :AvgRating',
    ExpressionAttributeValues: { ':Ratings': pie.Ratings, ':AvgRating': pie.AvgRating },
    ReturnValues: 'ALL_NEW',
  };

  await db.update(pie.Id, attrs);

  callback(undefined, noContent());
});
