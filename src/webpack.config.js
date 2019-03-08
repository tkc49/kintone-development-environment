// nodeに元から入っているモジュール
// ファイルパスの文字列の解析、操作などができる
const path = require('path');


module.exports = (env, argv) => {

    // argv.modeにはwebpackを実行したmodeが格納されている
    // 例えば webpack --mode development と実行すれば
    // argv.mode には 'development' が格納されている
    // そのためdevelopmentモードで実行したかどうかを判定できる
    const IS_DEVELOPMENT = argv.mode === 'development';


    return {
        // 開発元
        entry: {
            "000-test": "./000-test/app.js"
        },
        // 開発元をコンパイルした時の出力先を設定
        output: {
            path: path.join(__dirname, "../app"),
            filename: "[name]/app.js"
        },
        // 各モジュールのインポート文が相対パスだらけにならないようにルートを設定
        resolve: {
            modules: [
                path.join(__dirname, "./src")
            ]
        },
        module: {
            rules: [
                /**********************************************************
                *
                * jsファイルをbabel-loderを利用して古いバージョンのJSに出力する
                *
                **********************************************************/
                {
                    // test: /\.js$/,
                    // 公式ドキュメントにあわせる
                    // https://github.com/babel/babel-loader
                    test: /\.m?js$/,
                    // exclude: /node_modules/,
                    // 公式ドキュメントを参照
                    // https://github.com/babel/babel-loader
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                // babel7を利用するので。
                                // presets: ['env']
                                presets: ['@babel/preset-env']
                            }
                        }
                    ]
                },
                /**********************************************************
                *
                * SASSの設定
                *
                **********************************************************/
                {
                    test: /\.scss/,
                    use: [
                        // linkタグを出力する機能
                        'style-loader',

                        // CSSをバンドルするための機能
                        {
                            loader: 'css-loader',
                            options: {
                                // オプションでCSS内のurl()メソッドの取り込みを禁止する
                                url: false,
                                // ソースマップの利用の有無
                                sourceMap: IS_DEVELOPMENT ? 'source-map' : 'none',
                                // 0 => no loaders(defalut)
                                // 1 => postcss-loader;
                                // 2 => postcss-loader, sass-loader
                                importLoader: 2
                            }
                        },

                        // Sassコンパイル
                        {
                            loader: 'sass-loader',
                            options: {
                                // ソースマップの利用有無
                                sourceMap: IS_DEVELOPMENT ? 'source-map' : 'none'
                            }
                        }
                    ]
                }
            ]
        }
    };
};
