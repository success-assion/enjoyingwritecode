const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");//cnpm i -D extract-text-webpack-plugin@next
const CleanWebpackPlugin = require('clean-webpack-plugin');
const glob = require('glob-all');
const PurifyCSSPlugin = require('purifycss-webpack');
const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const happypack = require('happypack');
console.log(path.join(__dirname, 'dist/index.html'));
// 去除无用的css
plugins: [
    new PurifyCSSPlugin({
      // 路劲扫描 nodejs内置 路劲检查
      paths: glob.sync(path.join(__dirname, 'pages/*/*.html'))
    })
]

module.exports = {
		devtool: 'eval-source-map',
		mode: 'develoment',
		entry: {
			vendor: ['./src/scripts/jquery.js'],
			app: './src/app.js',
			index: './src/index.js'
		},
		output: {
			path: path.resolve(__dirname, "dist"), // string,
			filename: 'static/js/[name]_bundle.js'
		},
		resolve: {
			extensions: ['.js', '.less', '.css', '.png', '.jpg'], //第一个是空字符串! 对应不需要后缀的情况.
			alias: {
				jquery: path.resolve(__dirname,'./src/scripts/jquery.js')
			}
		},
		devServer: {
			contentBase: path.join(__dirname, 'dist'),
			port: 9090,
			host: 'localhost',
			overlay: true,
      open: true,
			compress: true // 服务器返回浏览器的时候是否启动gzip压缩
	 	},
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
		module: {
			rules: [
				{
					test: /\.(jsx|js)$/,
					exclude: /node_modules/,
					include: path.resolve(__dirname, "src"),
					use: [
						{
							loader: 'babel-loader'
						}
					]
				},
				{
					test: /\.(css|sass)$/,
					include: path.resolve(__dirname, "src"),
					use: ExtractTextPlugin.extract({
	          fallback: 'style-loader',
	          //如果需要，可以在 sass-loader 之前将 resolve-url-loader 链接进来
	          use: [
							{
									loader: 'css-loader',
									options: {
                    url: false,
                    minimize: true,
                    sourceMap: true
                	}
							},
							{
								loader: 'postcss-loader',
								options: {
									options: {
										importLoaders: 1,
										plugin: [
											require('autoprefixer')
										]
									}
								}
							},
							'sass-loader'
            ]
	        })
				}
			]
		},
		optimization: {
			splitChunks: {
				name: "vendor",// 将entry名为vendor的公共模块提取，生成名为`manifest`的chunk
        minChunks: Infinity //Infinity
			}
		},
		plugins: [
			new CleanWebpackPlugin(['dist/static'],{ exclude:  ['index.html'],}),
			new HtmlWebpackPlugin({
				title: 'webpack.V4 react',
				favicon: './src/icon.png',
				template: './src/index.html',
				minify: { //集成html-minifier
					inifyCSS: true,
					minifyJS: true,
					removeAttributeQuotes: true //移除属性的引号 可解决#Cannot use 'in' operator to search for 'html5' in true
				},
      	inject: 'body',
				cache: true //默认值是 true。表示只有在内容变化时才生成一个新的文件
			}),
			new WebpackParallelUglifyPlugin({
	     		uglifyJS: {
		        output: {
	          beautify: false, //不需要格式化
		          comments: false //不保留注释
	        },
	        compress: {
	          warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
	          drop_console: true, // 删除所有的 `console` 语句，可以兼容ie浏览器
	          collapse_vars: true, // 内嵌定义了但是只用到一次的变量
	          reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
	        }
      }
    	}),
			new ExtractTextPlugin('static/css/main.css'),
			//必须放在ExtractTextPlugin后
			new PurifyCSSPlugin({
				minimize: true,
				// 路劲扫描 nodejs内置 路劲检查
				paths: glob.sync(path.join(__dirname, 'dist/index.html'))
			})
	  ],
    stats: { //object
     assets: true,
     colors: true,
     errors: true,
     errorDetails: true,
     hash: true
    }
}
