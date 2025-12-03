var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'web');
var APP_DIR_NOMINACIONES = path.resolve(__dirname, 'web/bundles/Nominaciones/react');
var APP_DIR_AGENDAMIENTO = path.resolve(__dirname, 'web/bundles/Agendamiento/react');
var APP_DIR_REIAL = path.resolve(__dirname, 'web/bundles/Reial/react');
var APP_DIR_DORBI = path.resolve(__dirname, 'web/bundles/dorbi/react');
var APP_DIR_GESTIONCARTERA = path.resolve(__dirname, 'web/bundles/GestionCartera/react');
var APP_DIR_LIQUIDACIONYNOTAS = path.resolve(__dirname, 'web/bundles/LiquidacionyNotas/react');
var APP_DIR_APROVECHAMIENTO = path.resolve(__dirname, 'web/bundles/Aprovechamiento/react');


var config = {
  entry: {
    ['nominaciones']: APP_DIR_NOMINACIONES + '/index.js',
    ['agendamiento']: APP_DIR_AGENDAMIENTO + '/index.js',
    ['dorbi']: APP_DIR_DORBI + '/index.js',
    ['reial']: APP_DIR_REIAL + '/index.js',
    ['gestioncartera']: APP_DIR_GESTIONCARTERA + '/index.js',
    ['liquidacionynotas']: APP_DIR_LIQUIDACIONYNOTAS + '/index.js',
    ['aprovechamiento']: APP_DIR_APROVECHAMIENTO + '/index.js',
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: require.resolve('jquery'),
        loader: 'imports?jQuery=jquery'
      },
      {
        test: /.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react'],
          plugins: ['transform-class-properties']
        }
      },
      {
        test: /\.(css|sass|scss)$/,
        include: /react/,
        // exclude: /node_modules/,
        loaders: [
          require.resolve('style-loader'),
          require.resolve('css-loader'),
          require.resolve('sass-loader')
        ]
      }
    ]
  },
  devtool: '#inline-source-map',
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    })
  ],
  mode: 'development'
};

module.exports = config;
