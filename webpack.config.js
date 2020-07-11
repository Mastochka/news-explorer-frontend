const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackMd5Hash = require('webpack-md5-hash');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';


module.exports = {
    entry: {
        main: './src/index.js',
        mynews: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[chunkhash].js'

    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: [(isDev ? {loader: 'style-loader'} : {loader: MiniCssExtractPlugin.loader,
                  options: {
                  publicPath: '../',
                } }), {
                  loader:'css-loader',
                  options: {
                      importLoaders: 2
                  }
              }, 'postcss-loader']


            },
            {
                test: /\.(png|jpg|gif|ico|svg)$/,
                use: [{
                        loader: 'file-loader',
                        options: {
                          name: '[name].[ext]',
                          outputPath: 'images',
                        }
                      },
                        {
                                loader: 'image-webpack-loader',
                                options: {}
                        },
                ]
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: 'file-loader?name=./vendor/fonts/[name].[ext]'
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({filename: 'css/[name].[contenthash].css',}),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                    preset: ['default'],
            },
            canPrint: true
    }),
        new HtmlWebpackPlugin({
            inject: true,
            template: './src/index.html',
            filename: './index.html',
            chunks: ['main'],
            minify: {
              collapseWhitespace: true
            },
          }),
        new HtmlWebpackPlugin({
          inject: true,
          template: './src/mynews/mynews.html',
          filename: 'mynews.html',
          chunks: ['mynews'],
          minify: {
            collapseWhitespace: true
          },
        }),
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new WebpackMd5Hash(),
    ]
};
