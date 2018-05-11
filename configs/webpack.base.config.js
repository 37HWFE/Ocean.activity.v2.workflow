const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const _ = require('lodash');
const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const DefinePlugin = webpack.DefinePlugin;
const AssetsPlugin = require('assets-webpack-plugin');
const pkg = require('../package.json');
const econfig = require('./activity.config');
const srcDir = path.resolve(process.cwd(), 'src'); // 源码目录
const assets = path.resolve(process.cwd(), 'dist'); // 构建目录
const nodeModPath = path.resolve(__dirname, '../node_modules');

// 活动标识
let eventName = econfig.eventName;

// 活动入口资源配置
let entryJsPath = eventName + '/js/pc.js';
let entryHtmlPath = eventName + '/index.html';
let entryMJsPath = eventName + '/js/mobile.js';
let entryMHtmlPath = eventName + '/indexm.html';

// 若configs/activity.config.js 有配置则进行覆盖
if (econfig.entryJsPath && econfig.entryHtmlPath && econfig.entryMJsPath && econfig.entryMHtmlPath) {
    entryJsPath = econfig.entryJsPath;
    entryHtmlPath = econfig.entryHtmlPath;
    entryMJsPath = econfig.entryMJsPath;
    entryMHtmlPath = econfig.entryMHtmlPath;
}

let entries = (() => {
    let map = {};
    // 定義入口js的路徑
    map['index'] = path.resolve(srcDir, entryJsPath);
    map['indexm'] = path.resolve(srcDir, entryMJsPath);
    return map;
})()

module.exports = (options) => {
    options = options || {};

    let dev = options.dev !== undefined ? options.dev : true
    // 这里publicPath要使用绝对路径，不然scss/css最终生成的css图片引用路径是错误的，应该是scss-loader的bug
    let publicPath = '/';
    let extractCSS;
    let extractSass;
    let cssLoader;
    let sassLoader;
    let plugins = [];

    // 添加本地服务模板插件
    plugins.push(
        new HtmlWebpackPlugin({
            // 文件路徑
            template: path.resolve(srcDir, entryHtmlPath),
            // src後面的路徑，前面不要加/ 
            filename: entryHtmlPath,
            inject: 'body',
            // 需要加載的js，對應entries屬性名
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            // 文件路徑
            template: path.resolve(srcDir, entryMHtmlPath),
            // src後面的路徑，前面不要加/ 
            filename: entryMHtmlPath,
            inject: 'body',
            // 需要加載的js，對應entries屬性名
            chunks: ['indexm']
        })
    );

    // 从js中拆分css到独立文件
    extractSass = new ExtractTextPlugin({
        filename: eventName + '/css/[chunkhash:8].[name].min.css',
        disable: process.env.NODE_ENV === "development"
    });

    if (dev) {
        // npm run dev使用到的配置
        plugins.push(extractSass);
    } else {
        // npm run build使用到的配置
        extractCSS = new ExtractTextPlugin(eventName + '/css/[contenthash:8].[name].min.css', {
            // 当allChunks指定为false时，css loader必须指定怎么处理
            // additional chunk所依赖的css，即指定`ExtractTextPlugin.extract()`
            // 第一个参数`notExtractLoader`，一般是使用style-loader
            // @see https://github.com/webpack/extract-text-webpack-plugin
            allChunks: false
        });
        cssLoader = extractCSS.extract('style', ['css?minimize']);
        sassLoader = extractCSS.extract('style', ['css?minimize', 'sass']);

        plugins.push(
            extractCSS,
            // 使用js压缩模块
            new UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                output: {
                    comments: false
                },
                mangle: {
                    except: ['$', 'exports', 'require']
                }
            }),
            // 创建一个在编译时可以配置的全局常量
            new DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            // 输出一个带有生成资源路径的json文件，以便您可以从其他位置找到它们
            new AssetsPlugin({
                filename: path.resolve(assets, 'source-map.json')
            })
            // new webpack.optimize.DedupePlugin()
            //new webpack.NoErrorsPlugin()
        );
    }

    let config = {
        entry: Object.assign(entries, {
            // 用到什么公共lib（例如React.js），就把它加进vender去，目的是将公用库单独提取打包
            // 'vender': ['zepto'],
            // 'reactStuff': 'assets/dll/js/reactStuff.js'
        }),

        output: {
            path: assets,
            filename: dev ? '[name].js' : eventName + '/js/[chunkhash:8].[name].min.js',
            // chunkFilename: dev ? '[chunkhash:8].chunk.js' : 'js/[chunkhash:8].chunk.min.js',
            hotUpdateChunkFilename: dev ? '[id].js' : eventName + '/js/[id].[chunkhash:8].min.js',
            publicPath: publicPath
        },

        resolve: {
            // root: [srcDir, nodeModPath],
            alias: {
                // 活动工作流常用组件路径map
                jquery: path.resolve(srcDir, "commonres/components/jquery/jquery"),
                zepto: path.resolve(srcDir, "commonres/components/zepto/zepto.1.1.6.min"),
                jsencrypt: path.resolve(srcDir, "commonres/libs/umd.jsencrypt.min"),
                rsa: path.resolve(srcDir, "commonres/common/rsa"),
                facebook: path.resolve(srcDir, "commonres/common/FbSDK"),
                alert: path.resolve(srcDir, "commonres/plugins/jquery.alert"),
                mousewheel: path.resolve(srcDir, "commonres/plugins/jquery.mousewheel.min"),
                header: path.resolve(srcDir, "commonres/components/header/index"),
                HeaderBuider: path.resolve(srcDir, "commonres/components/header/HeaderBuider"),
                mheader: path.resolve(srcDir, "commonres/components/mheader/index"),
                footer: path.resolve(srcDir, "commonres/components/footer/index"),
                ocean: path.resolve(srcDir, "commonres/components/ocean/index"),
                createClass: path.resolve(srcDir, "commonres/components/ocean/createClass"),
                query: path.resolve(srcDir, "commonres/components/ocean/query"),
                templateEngine: path.resolve(srcDir, "commonres/components/ocean/templateEngine"),
                Select: path.resolve(srcDir, "commonres/components/selector/index"),
                activityConfig: path.resolve(srcDir, "commonres/common/activity_config"),
                BaseModel: path.resolve(srcDir, "commonres/models/BaseModel"),
                MessageModel: path.resolve(srcDir, "commonres/models/Message"),
                MessagesCollector: path.resolve(srcDir, "commonres/models/collectors/Messages"),
                SignModel: path.resolve(srcDir, "commonres/models/Sign"),
                RewardLists: path.resolve(srcDir, "commonres/models/collectors/RewardLists"),
                SignDates: path.resolve(srcDir, "commonres/models/collectors/SignDates"),
                UserModel: path.resolve(srcDir, "commonres/models/User"),
                ActivityModel: path.resolve(srcDir, "commonres/models/Activity"),
                FBModel: path.resolve(srcDir, "commonres/models/FB"),
                RewardListModel: path.resolve(srcDir, "commonres/models/RewardList"),
                gmStore: path.resolve(srcDir, "commonres/components/gmStore.min"),
                fb: path.resolve(srcDir, "commonres/components/fbtoolkit/fb"),
                jqueryCookies: path.resolve(srcDir, "commonres/components/jquery-cookies/jquery.cookies.2.2.0"),
                jqueryMsSlidePic: path.resolve(srcDir, "commonres/components/jquery-msSlidePic/jquery.msSlidePic"),
                swipe: path.resolve(srcDir, "commonres/components/swipe/swipe_response"),
                swiper: path.resolve(srcDir, "commonres/components/swiper/swiper.min"),
                jqueryMousewheel: path.resolve(srcDir, "commonres/plugins/jquery.mousewheel.min"),
                rotate: path.resolve(srcDir, "commonres/plugins/jquery.rotate.min"),
                Caroursel: path.resolve(srcDir, "commonres/plugins/jquery.carousel"),
                LazyImg: path.resolve(srcDir, "commonres/common/LazyImg"),
                jsencrypt: path.resolve(srcDir, "commonres/common/jsencrypt"),
                Utils: path.resolve(srcDir, "commonres/common/utils"),
                Sequence: path.resolve(srcDir, "commonres/common/Sequence"),
                jQueryRotate_2_2: path.resolve(srcDir, "commonres/plugins/jQueryRotate.2.2"),
                touch: path.resolve(srcDir, "commonres/plugins/touch.min"),
                switchPage: path.resolve(srcDir, "commonres/plugins/switch.page"),
                reqanimframeAnimate: path.resolve(srcDir, "commonres/plugins/reqanimframe.animate"),
                OceanAlert: path.resolve(srcDir, "commonres/plugins/ocean.alert"),
                slide3d: path.resolve(srcDir, "commonres/plugins/slide3d"),
                PlaceholderFix: path.resolve(srcDir, "commonres/common/$PlaceholderFix"),
                Clipboard: path.resolve(srcDir, "commonres/plugins/clipboard.min"),
                copyText: path.resolve(srcDir, "commonres/plugins/copy.text"),
                RotateComponent: path.resolve(srcDir, "commonres/common/$RotateComponent"),
                cardGame: path.resolve(srcDir, "commonres/plugins/cardGame/cardGame"),
                card: path.resolve(srcDir, "commonres/plugins/cardGame/card"),
                writeCss: path.resolve(srcDir, "commonres/plugins/cardGame/writeCss"),
                popup: path.resolve(srcDir, "commonres/plugins/popup")
            },
            extensions: ['.js', '.css', '.scss', '.tpl', '.png', '.jpg']
        },

        module: {
            loaders: [{
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        minimize: true,
                        removeComments: false,
                        collapseWhitespace: false
                    }
                }]
            }, {
                test: /\.jpg$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: eventName + '/img/[name].[ext]?[hash:8]'
                    }
                }]
            }, {
                test: /\.png$/,
                use: ["url-loader?mimetype=image/png"]
            }, {
                test: /\.css$/,
                // loader: "style!css"
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ['css-loader', 'file-loader']
                })
            }, {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    // fallback: 'style-loader',
                    //如果需要，可以在 sass-loader 之前将 resolve-url-loader 链接进来
                    //use: ['css-loader', 'resolve-url-loader', 'sass-loader?sourceMap'],
                    use: [{
                        loader: "css-loader",
                        options: {
                            minimize: true || { /* CSSNano Options */ },
                            sourceMap: true
                        }
                    }, {
                        loader: "resolve-url-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // 在开发环境使用 style-loader
                    fallback: "style-loader"
                })
            }, {
                test: /mobile\.scss$/,
                loader: 'webpack-px-to-rem',
                // 这个配置是可选的 
                query: {
                    // 1rem=npx 默认为 10 
                    basePx: 75,
                    // 只会转换大于min的px 默认为0 
                    // 因为很小的px（比如border的1px）转换为rem后在很小的设备上结果会小于1px，有的设备就会不显示 
                    min: 1,
                    // 转换后的rem值保留的小数点后位数 默认为3 
                    floatWidth: 3
                }
            }, {
                test: /\.js?$/,
                loader: "babel-loader",
                exclude: /(node_modules|bower_components)/,
                options: {
                    presets: ['es2015']
                }
            }, {
                test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: eventName + '/fonts/[name].[ext]?[hash:8]'
                    }
                }]
            }]
        },

        plugins: [
            // 这里可继续扩展插件
        ].concat(plugins),

        devServer: {
            hot: true,
            noInfo: false,
            inline: true,
            publicPath: publicPath,
            stats: {
                cached: false,
                colors: true
            }
        }
    };

    if (dev) {
        // 为实现webpack-hot-middleware做相关配置
        // @see https://github.com/glenjamin/webpack-hot-middleware
        ((entry) => {
            for (let key of Object.keys(entry)) {
                if (!Array.isArray(entry[key])) {
                    entry[key] = Array.of(entry[key]);
                }
                entry[key].push('webpack-hot-middleware/client?reload=true');
            }
        })(config.entry);

        config.plugins.push(new webpack.HotModuleReplacementPlugin())
        config.plugins.push(new webpack.NoEmitOnErrorsPlugin());
    } else {
        // @see https://github.com/th0r/webpack-bundle-analyzer
        // config.plugins.push(new BundleAnalyzerPlugin(pkg.bundleAnalyzerConf))
    }
    return config;
};