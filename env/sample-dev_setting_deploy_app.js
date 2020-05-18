module.exports = {
  /**
   *
   * アプリの設定
   * "任意の名前":アプリの番号
   *
   **/
  apps: {
    test: 247,
    test2: 248,
  },
  props: {
    otherApiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  },
  /**
   *
   * デプロイするファイルがあるディレクトリーを設定
   *
   **/
  contentsPath: './app',
  contents: {
    // 上記の「アプリの設定」で設定した任意の名前ごとに kintone のデプロイのフォーマットに従い記述
    test: {
      desktop: {
        js: [
          'https://kintone.github.io/kintoneUtility/kintoneUtility.min.js',
          '000-test/app.js',
          'test.js',
        ],
        css: [],
      },
      mobile: {
        js: [],
      },
    },
    // 上記の「アプリの設定」で設定した任意の名前ごとに kintone のデプロイのフォーマットに従い記述
    test2: {
      desktop: {
        js: ['000-test/app.js'],
        css: [],
      },
      mobile: {
        js: [],
      },
    },
  },
};
