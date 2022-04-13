const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: "development", // "production" | "development" | "none"',
    entry: "./src/index.js", // string | object | array
    output:{
        path:path.resolve(__dirname, "dist"), 
        clean:true,
        filename: "[name].js",
    },
    devServer: {
        static: {
          directory: path.join(__dirname, 'index.html'),
        },
        compress: true,
        port: 9000,
      },
      resolve: {
        // 如果确认不需要node polyfill，设置resolve.alias设置为false
        alias: {
          crypto: false,
          assert: require.resolve("assert/"),
          os:false
        }
      },
    resolveLoader: {
        modules: ['./loaders','node_modules'],
    },
    module: {
        // 模块配置相关
        rules: [
            {
                test: /\.jsx?$/,
                //use:'jsx_transform.js',
                exclude: [
                    path.resolve(__dirname, "node_modules")
                ] ,
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin()]
}