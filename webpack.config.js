const path = require('path');
const slsw = require('serverless-webpack');
const isLocal = slsw.lib.webpack.isLocal;
const nodeExternals = require('webpack-node-externals');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    mode: isLocal ? 'development' : 'production',
    devtool: isLocal ? 'source-map-support' : 'none',
    entry: slsw.lib.entries,
    externals: [nodeExternals(), 'aws-sdk'],
    target: 'node',
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
    },
    output: {
        libraryTarget: 'commonjs',
        path: path.resolve(__dirname, '.webpack'),
        filename: '[name].js',
    },
    plugins: [new ForkTsCheckerWebpackPlugin()],
    stats: 'detailed',
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    transpileOnly: true
                }
            }
        ]
    }
};