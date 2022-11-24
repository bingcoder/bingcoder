/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const FriendlyErrorsWebpackPlugin = require('@nuxtjs/friendly-errors-webpack-plugin');
const chalk = require('chalk');
const CopyPlugin = require('copy-webpack-plugin');

const development = 'development';
const production = 'production';

/** @type { () => import('webpack').Configuration} */
module.exports = (env) => {
  if (!(env.production || env.development)) {
    console.log(chalk.red('please set env: ', development, 'or', production));
    process.exit(1);
  }
  if (env.production) {
    console.log(chalk.green('Creating an optimized production build...'));
  }
  process.env.BABEL_ENV = process.env.NODE_ENV = env.production ? production : development;
  const { development: isDev, production: isProd, analyze: isAnalyze } = env;

  const when =
    (c) =>
    (...p) =>
      c ? p : [];
  const whenDev = when(isDev);
  const whenProd = when(isProd);
  const whenAnalyzer = when(isAnalyze);

  const cssRegex = /\.css$/;
  const cssModuleRegex = /\.module\.css$/;
  const lessRegex = /\.less$/;
  const lessModuleRegex = /\.module\.less$/;

  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      ...whenDev('style-loader'),
      ...whenProd(MiniCssExtractPlugin.loader),
      {
        loader: 'css-loader',
        options: Object.assign(
          {
            sourceMap: true,
          },
          cssOptions.modules
            ? {
                ...cssOptions,
                modules: {
                  localIdentName: '[local]-[hash:base64:5]',
                },
              }
            : cssOptions
        ),
      },
      ...when(preProcessor)({
        loader: 'less-loader',
        options: {
          lessOptions: {
            javascriptEnabled: true,
          },
          sourceMap: true,
        },
      }),
    ];
    return loaders;
  };

  /** @type {(t: 'js'|'css'|'media', ds: string, ps: string) => string} */
  const getName = (asset, devSuffix, prodSuffix) => {
    // const prefix = isDev ? 'static' : `${process.env.current_time}/static`;
    return `static/${asset}/[name].${isProd ? prodSuffix : devSuffix}`;
  };

  return {
    target: ['browserslist'],
    mode: isProd ? production : isDev && development,
    bail: isProd,
    devtool: isProd ? false : isDev && 'cheap-module-source-map',
    entry: path.resolve('src/main'),
    stats: 'none', // 注释它可获取更多打包信息
    // 开发
    devServer: {
      open: false,
      compress: true,
      port: 8088, // TODO 端口号
      historyApiFallback: true,
      allowedHosts: 'all',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      client: {
        logging: 'none',
        overlay: false,
      },
    },
    output: {
      assetModuleFilename: getName('media', '[ext]', '[hash][ext]'),
      filename: getName('js', 'js', '[contenthash:8].js'),
      chunkFilename: getName('js', 'chunk.js', '[contenthash:8].chunk.js'),
      path: path.resolve('docs'),
      publicPath: './',
      clean: true,
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      antd: 'antd',
      dayjs: 'dayjs',
    },
    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserPlugin({
          exclude: /\.min\.js$/,
          parallel: true,
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
              drop_debugger: true,
              drop_console: true,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          extractComments: false,
        }),
        new CssMinimizerPlugin(),
      ],
    },
    resolve: {
      alias: {
        src: path.resolve('src'),
      },
      extensions: ['.tsx', '.ts', '.json', '.js', '.jsx'],
    },

    plugins: [
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: path.resolve('index.html'),
          },
          isProd
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              }
            : undefined
        )
      ),
      new CopyPlugin({
        patterns: [{ from: 'public/logo.svg' }],
      }),

      new FriendlyErrorsWebpackPlugin(),
      new ForkTsCheckerWebpackPlugin({
        async: isDev,
      }),
      new ESLintPlugin({
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        cache: true,
        cacheLocation: path.resolve('node_modules/.cache/.eslintcache'),
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          CURRENT_TIME: JSON.stringify(process.env.current_time),
        },
      }),
      // 忽略moment语言文件，入口引入
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      ...whenProd(
        new MiniCssExtractPlugin({
          filename: getName('css', 'css', '[contenthash:8].css'),
          chunkFilename: getName('css', 'chunk.css', '[contenthash:8].chunk.css'),
        })
      ),
      ...whenDev(
        new ReactRefreshWebpackPlugin({
          overlay: false,
        })
      ),
      ...whenAnalyzer(
        new BundleAnalyzerPlugin({
          // analyzerMode: 'static',
        })
      ),
    ],

    module: {
      rules: [
        {
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              type: 'asset',
              parser: {
                dataUrlCondition: {
                  maxSize: 10 * 1024,
                },
              },
            },
            {
              test: /\.svg$/,
              use: [
                {
                  loader: require.resolve('@svgr/webpack'),
                  options: {
                    prettier: false,
                    svgo: false,
                    svgoConfig: {
                      plugins: [{ removeViewBox: false }],
                    },
                    titleProp: true,
                    ref: true,
                  },
                },
                // {
                //   loader: require.resolve('file-loader'),
                //   options: {
                //     name: assetModuleFilename,
                //   },
                // },
              ],
              issuer: {
                and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
              },
            },
            {
              test: /\.(ts|tsx|js|jsx)$/,
              include: path.resolve('src'),
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      useBuiltIns: 'entry',
                      corejs: 3,
                      exclude: ['transform-typeof-symbol'],
                    },
                  ],
                  [
                    '@babel/preset-react',
                    {
                      development: isDev,
                      runtime: 'automatic',
                    },
                  ],
                  '@babel/preset-typescript',
                ],

                plugins: [
                  [
                    '@babel/plugin-proposal-class-properties',
                    {
                      loose: true,
                    },
                  ],
                  [
                    '@babel/plugin-proposal-private-methods',
                    {
                      loose: true,
                    },
                  ],
                  [
                    '@babel/plugin-proposal-private-property-in-object',
                    {
                      loose: true,
                    },
                  ],
                  // '@babel/plugin-transform-runtime',
                  '@babel/plugin-proposal-optional-chaining',
                  '@babel/plugin-proposal-nullish-coalescing-operator',
                  ...whenDev('react-refresh/babel'),
                ],
                cacheDirectory: true,
                cacheCompression: false,
                compact: isProd,
                sourceMaps: true,
                inputSourceMap: true,
              },
            },

            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
              }),
              sideEffects: true,
            },
            {
              test: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                modules: true,
              }),
            },
            {
              test: lessRegex,
              exclude: lessModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 2,
                },
                'less-loader'
              ),
              sideEffects: true,
            },
            {
              test: lessModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 2,
                  modules: true,
                },
                'less-loader'
              ),
            },

            {
              exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              type: 'asset/resource',
            },
            // ** STOP ** Are you adding a new loader?
            // Make sure to add the new loader(s) before the "file" loader.
          ],
        },
      ],
    },
  };
};
