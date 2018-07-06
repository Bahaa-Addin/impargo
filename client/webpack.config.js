const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlWebpackPlugin = new HtmlWebPackPlugin({
    template: "./src/index.html",
    filename: "./index.html"
});

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                        presets: ['react', 'env'],
                        plugins: ["transform-object-rest-spread", "transform-class-properties"]
                    }
                }
            },
        ]
    },
    plugins: [htmlWebpackPlugin]
};
