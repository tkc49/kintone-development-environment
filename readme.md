# kintone-development-environment

以下のことができます。

- webpack で babel を使ってビルド
- Sass のコンパイル
- ビルドしたファイルを kintone へデプロイ

## 必須

- NodeJS latest

## 始め方

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

dev（開發環境としてビルド）

`npm run dev`

※ ./env/dev_setting_deploy_app.js ファイルが必須

prod（本番環境としてビルド）

`npm run build`

※ ./env/prod_setting_deploy_app.js ファイルが必須

### 6. デプロイする

■ 開發環境

`node deploy.js -e dev`

※ ./env/.dev_kintone ファイルが必須<br>

■ 本番環境

`node deploy.js -e prod`

※ ./env/.prod_kintone ファイルが必須<br>

## 謝意

- deploy.js は [logicheart/kintone-dev-base](https://github.com/logicheart/kintone-dev-base) の deploy.js を基にカスタマイズさせていただきました。
- webpack.config.js の一部のコードも[logicheart/kintone-dev-base](https://github.com/logicheart/kintone-dev-base)を参考にさせていただきました。

ありがとうございます。
