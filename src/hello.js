const { GREETING } = process.env;

export const handler = async event => {
  const { name } = event.pathParameters || {};
  return {
    statusCode: 200,
    body: JSON.stringify({ greeting: `${GREETING} ${name}` }),
  };
};
