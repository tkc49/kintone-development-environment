# kintone-development-environment

以下のことができます。

- webpack で babel を使ってビルド
- Sass のコンパイル
- ビルドしたファイルを kintone へデプロイ
- kintone に既にアップロードされている js ファイルがある場合は、消さすに残す<br>
例えば(kintone-printcreator-loader-xx.js)とか。

## 必須

- NodeJS version 13.0.1

## 始め方

説明動画

[![](https://img.youtube.com/vi/_OAnC9iuPsM/0.jpg)](https://www.youtube.com/watch?v=_OAnC9iuPsM)

### 1. 開發環境をダウンロード

以下の URL から zip または tar.gz を DL した解凍してください。<br>
https://github.com/tkc49/kintone-development-environment/releases/latest

### 2. 開發環境構築

`package.json` があるディレクトリーで以下のコマンドを実行

`npm install`

### 3. kintone の設定ファイル作成

./env/.sample-dev_kintone ファイルの名前を .dev_kintone に変更<br>
※ .prod_kintone を作成すると本番環境と開発環境の kintone の接続先を変更することができます。

.dev_kintone に記載されていた以下の設定情報を自分の kintone 環境を切り替えることができます。<br>
※ your-kintone-domain.cybozu.com の場合

```
KINTONE_SUBDOMAIN = 'your-kintone-domain'
KINTONE_USER = 'your-user-name'
KINTONE_PASSWORD = 'your-password'
```

### 4. kintone のデプロイ情報を設定

./env/sample-dev_setting_deploy_app.js ファイルの名前を dev_setting_deploy_app.js に変更します。<br>
※ prod_setting_deploy_app.js を作成すると本番環境と開発環境の kintone のデプロイ情報を切り替えることができます。

以下の情報を自身の開発環境や kintone のアプリに応じてい変更をしてください。

```
module.exports = {
    /**********************************************************
   *
   * アプリの設定
   * "任意の名前":アプリの番号
   *
   **********************************************************/
    apps: {
        test: 247,
        test2: 248
    },
    props: {
        otherApiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    },
    /**********************************************************
   *
   * デプロイするファイルがあるディレクトリーを設定
   *
   **********************************************************/
    contentsPath: "./app",
    contents: {
    	// 上記の「アプリの設定」で設定した任意の名前ごとに kintone のデプロイのフォーマットに従い記述
        test: {
            desktop: {
                js: [
                    "https://kintone.github.io/kintoneUtility/kintoneUtility.min.js",
                    "000-test/app.js",
                    "test.js"
                ],
                css: []
            },
            mobile: {
                js: []
            }
        },
        // 上記の「アプリの設定」で設定した任意の名前ごとに kintone のデプロイのフォーマットに従い記述
        test2: {
            desktop: {
                js: ["000-test/app.js"],
                css: []
            },
            mobile: {
                js: []
            }
        }
    }
};

```

### 5. ビルドする

開発者モードで、開発環境設定ファイル（dev_setting_deploy_app.js）を読み込んでビルドする.

`npm run dev -- --env='dev'`

※ ./env/dev_setting_deploy_app.js ファイルが必須

開発者モードで、本番環境設定ファイル（prod_setting_deploy_app.js）を読み込んでビルドする.

`npm run dev -- --env='prod'`

※ ./env/prod_setting_deploy_app.js ファイルが必須

本番モードで、開発環境設定ファイル（dev_setting_deploy_app.js）を読み込んでビルドする.

`npm run build -- --env='dev'`

※ ./env/dev_setting_deploy_app.js ファイルが必須

本番モードで、本番環境設定ファイル（prod_setting_deploy_app.js）を読み込んでビルドする.

`npm run build -- --env='prod'`

※ ./env/prod_setting_deploy_app.js ファイルが必須

### 6. デプロイする

■ 開發環境

`node deploy.js -e dev --all or xxx`

※ ./env/.dev_kintone ファイルが必須<br>
※ xxxはdev_setting_deploy_app.js で設定したアプリの任意の名前

■ 本番環境

`node deploy.js -e prod --all or xxx`

※ ./env/.prod_kintone ファイルが必須<br>
※ xxxはprod_setting_deploy_app.js で設定したアプリの任意の名前

## その他

### VS Code で ESLint を利用する場合

1. VS Code のプラグインで ESLint をインストールする
2. [Cntrl+,] or Preferences -> Settings
3. "eslint.autoFixOnSave": true に設定する

### PhpStorm で ESLint を利用する場合

```
File type: Any
Scope: Project files
Program: ./node_modules/.bin/eslint (specify full path if needed)
Arguments: --fix $FilePath$
Output paths to refresh: $FileDir$
```
https://stackoverflow.com/questions/46641682/how-to-configure-eslint-autofix-on-save-in-phpstorm-webstorm

https://medium.com/@netczuk/even-faster-code-formatting-using-eslint-22b80d061461

## 謝意

- deploy.js は [logicheart/kintone-dev-base](https://github.com/logicheart/kintone-dev-base) の deploy.js を基にカスタマイズさせていただきました。
- webpack.config.js の一部のコードも[logicheart/kintone-dev-base](https://github.com/logicheart/kintone-dev-base)を参考にさせていただきました。

ありがとうございます。
