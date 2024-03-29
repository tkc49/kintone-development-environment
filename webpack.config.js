// nodeに元から入っているモジュール
// ファイルパスの文字列の解析、操作などができる
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = (env, argv) => {
  // argv.modeにはwebpackを実行したmodeが格納されている
  // 例えば webpack --mode development と実行すれば
  // argv.mode には 'development' が格納されている
  // そのためdevelopmentモードで実行したかどうかを判定できる

  // モードの確認.
  let IS_DEVELOPMENT = false;
  if (argv.mode === 'development') {
    IS_DEVELOPMENT = true;
  }

  // 環境（開発か本番）
  let mode;
  if (argv.env === 'dev') {
    mode = 'dev';
  } else if (argv.env === 'prod') {
    mode = 'prod';
  }
  const settingDeployApp = require(`./env/${mode}_setting_deploy_app.js`);

  const types = ['desktop', 'mobile'];
  const entries = {};
  Object.keys(settingDeployApp.contents).forEach(name => {
    const contents = settingDeployApp.contents[name];

    types.forEach(type => {
      if (contents[type] && contents[type].js) {
        contents[type].js.forEach(file => {
          if (file.match(/^(http|https):/)) {
            return;
          }
          // console.log(file);
          const fileArray = file.split('/');
          if (fileArray.length !== 2) {
            return;
          }
          const fileName = fileArray.slice(-1)[0].replace(/\.js$/, '');
          entries[fileArray[0]] =
            './src/' + [fileArray[0] + '/' + fileName + '.js'];
        });
      }
    });
  });

  return {
    // 開発元
    entry: entries,
    // 開発元をコンパイルした時の出力先を設定
    output: {
      path: path.join(__dirname, './app'),
      filename: '[name]/app.js',
    },
    // // 各モジュールのインポート文が相対パスだらけにならないようにルートを設定
    resolve: {
      modules: [
        'node_modules',
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'env'),
      ],
      alias: {
        vue$: 'vue/dist/vue.esm.js',
      },
    },
    externals: {
      kintone: 'kintone',
    },
    module: {
      rules: [
        /**
         * jsファイルをbabel-loderを利用して古いバージョンのJSに出力する
         */
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
            },
          ],
        },
        /**
         *
         * woffファイル
         *
         **/
        {
          test: /\.(otf|eot|svg|ttf|woff|woff2)(\?.+)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                esModule: false,
              },
            },
          ],
        },
        /**
         *
         * CSSの設定
         *
         **/
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader!css-loader',
            },
          ],
        },
        /**
         * SASSの設定
         */
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
                sourceMap: IS_DEVELOPMENT,
                // 0 => no loaders(defalut)
                // 1 => postcss-loader;
                // 2 => postcss-loader, sass-loader
                importLoaders: 2,
              },
            },

            // Sassコンパイル
            {
              loader: 'sass-loader',
              options: {
                // ソースマップの利用有無
                sourceMap: IS_DEVELOPMENT,
              },
            },
          ],
        },
        /**
         *
         * Vue
         *
         **/
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
      ],
    },
    plugins: [
      // make sure to include the plugin!
      new VueLoaderPlugin(),
    ],
  };
};
