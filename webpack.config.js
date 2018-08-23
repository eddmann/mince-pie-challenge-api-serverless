const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin');

const IS_OFFLINE = slsw.lib.webpack.isLocal;

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: IS_OFFLINE ? 'development' : 'production',
  optimization: { minimize: false },
  performance: { hints: false },
  devtool: 'nosources-source-map',
  externals: [nodeExternals()],
  plugins: [new FlowBabelWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader' }],
      },
    ],
  },
  resolve: {
    alias: {
      db: path.resolve(__dirname, `./src/services/${IS_OFFLINE ? 'localDynamoDBPieStore' : 'dynamoDBPieStore'}`),
      userTokenAuthenticator: path.resolve(
        __dirname,
        `src/services/${IS_OFFLINE ? 'inMemoryUserTokenAuthenticator' : 'cognitoUserTokenAuthenticator'}`,
      ),
    },
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
    sourceMapFilename: '[file].map',
  },
};
