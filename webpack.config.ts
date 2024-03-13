import * as webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

type Config = webpack.Configuration & { devServer?: WebpackDevServer.Configuration };

const ASSET_PATH = process.env.ASSET_PATH || '/';

export default (env: {
	stage?: 'development' | 'production' | 'ci' | 'none';
	analyze?: 'true' | 'false';
	circular?: 'true' | 'false';
}): Config => {
	const build: Config = {
		entry: {
			main: './playground.ts',
		},
		output: {
			publicPath: ASSET_PATH,
			path: path.resolve(__dirname, 'dist'),
			filename: env.stage === 'production' ? '[name]-[contenthash].js' : '[name].js',
			chunkFilename: env.stage === 'production' ? '[name]-[contenthash].js' : '[name].js',
		},
		devServer: {
			host: '0.0.0.0',
			open: false,
			hot: env.stage !== 'ci',
			compress: true,
			client: {
				overlay: false,
			},
			historyApiFallback: {
				disableDotRule: true,
				rewrites: [{ from: /^\/list(\/|$)/i, to: '/list.html' }],
			},
		},
		cache: {
			type: 'filesystem',
		},
		mode: env.stage === 'production' ? 'production' : 'development',
		/** @see https://webpack.github.io/analyse/ */
		stats: 'normal',
		module: {
			rules: [
				{
					test: /\.m?js/,
					resolve: {
						fullySpecified: false,
					},
				},
				{
					test: /\.(ts|js)$/,
					exclude: [path.resolve('graphql')],
					use: [
						{
							loader: 'esbuild-loader',
							options: {
								loader: 'ts',
								target: 'es2018',
							},
						},
					],
				},
			],
		},
		resolve: {
			symlinks: false,
			extensions: ['.js', '.ts'],
		},
		optimization: {
			minimize: env.stage === 'production',
			splitChunks: {
				cacheGroups: {
					shared: {
						test: /\/config|\/src\/styles\/|\/shared\/|node_modules\/((?!video\.js|videojs-vtt|@videojs|mpd-parser|m3u8-parser|@xmldom).)*$/,
						name: 'shared',
						chunks: 'all',
					},
				},
			},
			// minimizer: env.stage === 'production' ? [new TerserPlugin()] : [],
			// https://github.com/webpack/webpack/issues/959#issuecomment-426545529
			concatenateModules: env.stage === 'production',
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: './index.ejs',
				filename: 'index.html',
				chunksSortMode: 'auto',
				chunks: ['main'],
				inject: 'head',
				minify: {
					removeComments: true,
					collapseWhitespace: true,
					minifyJS: true,
					minifyCSS: { level: 1 },
				},

				// Variables
				NODE_ENV: env.stage,
			}),
		],
	};
	// add splash entries if config enabled
	if (!build.plugins) {
		throw new Error('Assert plugins defined');
	}

	if (env.stage === 'production') {
		build.devtool = 'source-map';
	} else if (env.stage === 'development') {
		build.devtool = 'inline-source-map';
		// build.devtool = 'eval-source-map';
	}

	return build;
};
