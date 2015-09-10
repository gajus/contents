var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    context: __dirname + '/src',
    entry: {
        contents: './index.js'
    },
    output: {
        path: __dirname + '/dist/browser',
        filename: '[name].js'
    },
    plugins: [
        new webpack.OldWatchingPlugin(),
        // new webpack.NewWatchingPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: [
                    /node_modules/
                ],
                loader: 'babel'
            }
        ]
    },
    resolve: {
        extensions: [
            '',
            '.js'
        ]
    }
};
