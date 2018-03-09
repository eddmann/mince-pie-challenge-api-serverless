/* @flow */

import type { Pie } from '../types';

import { notFound, badRequest, noContent, json } from '../helpers/http';
import { createHandler, strictHttpAuthentication } from '../helpers/handlers';

const avgRating = (pie: Pie): number => {
  const ratings = Object.values(pie.Ratings);
  return ratings.reduce((acc: number, rating: any) => acc + rating, 0) / ratings.length;
};

const isValid = (rating: number) => rating > 0 && rating < 6;

const rate = async ({ event, callback, userId, services: { db } }) => {
  const { id } = event.pathParameters || {};

  const pie = await db.get(id);

  if (!pie) {
    callback(undefined, notFound('Unable to find the specified mince pie.'));
    return;
  }

  const { rating } = json(event.body);

  if (!isValid(rating)) {
    callback(
      undefined,
      badRequest('Invalid request body', [{ name: 'rating', reason: 'You must supply a valid pie rating.' }]),
    );
    return;
  }

  pie.Ratings[userId] = rating;
  pie.AvgRating = avgRating(pie);

  const attrs = {
    UpdateExpression: 'SET Ratings = :Ratings, AvgRating = :AvgRating',
    ExpressionAttributeValues: { ':Ratings': pie.Ratings, ':AvgRating': pie.AvgRating },
    ReturnValues: 'ALL_NEW',
  };

  await db.update(pie.Id, attrs);

  callback(undefined, noContent());
};

export default createHandler(strictHttpAuthentication(rate));
