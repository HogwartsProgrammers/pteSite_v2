const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
    entry: {
        'mainBundle': './script.js',
        'officeBundle': './office-script.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public/js')
    },
    optimization: {
        minimizer: [
            new OptimizeCssAssetsPlugin({}),
            new UglifyJsPlugin({})
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new ExtractTextPlugin('../css/[name].css')
    ],
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.css$/, use: ExtractTextPlugin.extract({
                use: 'css-loader'
            }) }
        ]
    }
}