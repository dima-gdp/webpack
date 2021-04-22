const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')


const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`
const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

module.exports = {
	context: path.resolve(__dirname, 'src'),
	entry: './index.js',
	mode: 'development',
	output: {
		filename: filename('js'),
		path: path.resolve(__dirname, 'dist'),
	},

	devServer: {
		historyApiFallback: true,
		contentBase: path.resolve(__dirname, 'dist'),
		open: true,
		compress: true,
		port: 3000,
		hot: true
	},

	devtool: isProd ? false : 'source-map',

	plugins: [
		new CleanWebpackPlugin(),
		new HTMLWebpackPlugin({
			template: 'index.html',
			inject: 'body',
			minify: {
				removeComments: isProd,
				collapseWhitespace: isProd
			}
		}),
		new MiniCssExtractPlugin({
			filename: `./css/${filename('css')}`
		}),
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, 'src/assets'),
					to: path.resolve(__dirname, 'dist/assets'),
				}
			]
		}),
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			},
			{
				test: /\.html$/i,
				loader: 'html-loader',
			},
			{
				test: /\.css$/i,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: isDev
						},
					},
					'css-loader',
					'postcss-loader'
				],
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: (resourcePath, context) => {
								return path.relative(path.dirname(resourcePath), context) + '/';
							},
						}
					},
					'css-loader',
					'postcss-loader',
					'sass-loader'],
			},
			{
				test: /\.(?:|woff|woff2)$/,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext]'
				}
			},
			{
				test: /\.(?:|gif|png|jpg|jpeg|svg)$/,
				type: 'asset/resource',
				generator: {
					filename: 'img/[hash][ext]'
				}
			}
		]
	}
}