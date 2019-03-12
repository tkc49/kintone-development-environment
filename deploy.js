// コマンドラインで hogeho と実行したい場合（nodeをつけない）はshebangが必要だけど
// 今回は node hogehoge.js(node を指定する)と実行するのでshebang必要なし
// #!/usr/bin/env node

const path = require("path");
const util = require("util");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
const program = require("commander");
const dotenv = require("dotenv");

/**
 * Parse command line
 * コマンドラインの解析
 */
program
    .version("0.0.1", "-v, --version")
    .usage("[options] <appname ...>")
    .option("-a, --all", "deploy all")
    .option("-e, --env [value]", 'choice "dev" or "prod')
    .parse(process.argv);
if (process.argv.length < 3) {
    program.help(); // exit
}
const mode = program.env;

dotenv.config({ path: `./env/.${mode}_kintone` });

/**
 * envの設定を取得する
 */
const subdomain = process.env.KINTONE_SUBDOMAIN;
const user = process.env.KINTONE_USER;
const password = process.env.KINTONE_PASSWORD;

// デプロイするアプリ情報を読み込み
const settingDeployApp = require(`./env/${mode}_setting_deploy_app.js`);

/**
 * Request to kintone
 */
const kintoneRequest = ({ method, url, data, headers }) => {
    const auth = new Buffer(user + ":" + password).toString("base64");
    return axios({
        method: method,
        baseURL: `https://${subdomain}.cybozu.com/`,
        url: url,
        headers: Object.assign(headers || {}, {
            "X-Cybozu-Authorization": auth
        }),
        data: data
    })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            if (err.response.data) {
                throw new Error(`Request error: ${JSON.stringify(err.response.data)}`);
            } else {
                throw Error(err.message);
            }
        });
};

/**
 * Upload a file
 */
const uploadFile = filePath => {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));
    return kintoneRequest({
        method: "post",
        url: "/k/v1/file.json",
        data: formData,
        headers: formData.getHeaders()
    }).then(results => {
        return results.fileKey;
    });
};

/**
 * Send customize request
 */
const sendCustomize = customize => {
    return kintoneRequest({
        method: "put",
        url: "/k/v1/preview/app/customize.json",
        data: customize
    }).then(response => {
        if (!response.revision) {
            throw new Error("Revision not applied by customize.");
        }
        return response.revision;
    });
};

/**
 * Get customize values
 */
const getCustromizeValues = (contents, browser, ext, settingsAppContents) => {
    const values = [];
    const contentsPath =
    settingDeployApp.contentsPath || path.resolve(__dirname, `./dist/${mode}`);

    return contents
        .reduce(
            (promise, content) => {
                return promise.then(function() {
                    // 順番に処理をする
                    const type = content.match(/^(http|https):/) ? "URL" : "FILE";
                    console.log(`- ${browser}/${ext} ${type}: ${content}`);

                    if (type === "URL") {
                        values.push({ type: "URL", url: content });
                        return;
                    }

                    if (type === "FILE") {
                        const file = path.resolve(contentsPath, content);

                        // デプロイの設定ファイルにはファイル名が設定されているのに、appフォルダーにファイルがない場合は
                        // PrintCreatorのファイルがkintoneに設定されている可能性がある
                        const stat = util.promisify(fs.stat);

                        return stat(file)
                            .then(stats => {
                                // ファイルが存在する
                                return uploadFile(file).then(key => {
                                    values.push({
                                        type: "FILE",
                                        file: { fileKey: key }
                                    });
                                    return;
                                });
                            })
                            .catch(error => {
                                // ファイル存在しない
                                const filePathArray = file.split("/");
                                const fileName = filePathArray[filePathArray.length - 1];

                                for (const settingFile of settingsAppContents) {
                                    if (settingFile["type"] === "FILE") {
                                        if (fileName === settingFile["file"]["name"]) {
                                            values.push({
                                                type: "FILE",
                                                file: { fileKey: settingFile["file"]["fileKey"] }
                                            });
                                        }
                                    }
                                }
                            });
                    }
                });
            },
            Promise.resolve() // 初期値
        )
        .then(() => {
            // 配列の処理が終わるとログ出力する
            console.log("- customize: %s", JSON.stringify(values));
            return values;
        });
};

/**
 * Deploy application contents
 */
const deployAppContents = (app, name, contents, settingAppInfo) => {
    const customize = {
        app: app,
        scope: "ALL",
        desktop: { js: [], css: [] },
        mobile: { js: [] }
    };

    const settings = [
        { browser: "desktop", ext: "js" },
        { browser: "desktop", ext: "css" },
        { browser: "mobile", ext: "js" }
    ];

    return settings
        .reduce((promise, { browser, ext }) => {
            return promise.then(() => {
                const appContents = contents[browser] ? contents[browser][ext] : null;
                const settingsAppContents = settingAppInfo[browser]
                    ? settingAppInfo[browser][ext]
                    : null;
                if (!appContents || appContents.length === 0) {
                    return [];
                }

                return getCustromizeValues(
                    appContents,
                    browser,
                    ext,
                    settingsAppContents
                ).then(values => {
                    customize[browser][ext] = values;
                });
            });
        }, Promise.resolve())
        .then(() => {
            return sendCustomize(customize);
        });
};

/**
 * Send request for deploying applications
 */
const deployApps = apps => {
    const params = {
        apps: apps.map(app => {
            return { app: app };
        })
    };
    return kintoneRequest({
        method: "post",
        url: "/k/v1/preview/app/deploy.json",
        data: params
    });
};

/**
 * Main
 */
const names = program.all ? Object.keys(settingDeployApp.apps) : program.args;
const appConfigs = [];
names.forEach(name => {
    const app = settingDeployApp.apps[name];
    if (!app) {
        throw new Error(`App "${name}" not configured.`);
    }
    const contents = settingDeployApp.contents[name];
    if (contents) {
        appConfigs.push({ app, name, contents });
    }
});
if (appConfigs.length === 0) {
    throw new Error("No apps to deploy.");
}

Promise.resolve()
    .then(() => {
        console.log(`mode: ${mode}`);

        // appごとに繰り返し
        return appConfigs.reduce((promise, { app, name, contents }) => {
            console.log(`app: ${app}/${name}`);

            const param = {
                app: app
            };
            return kintoneRequest({
                method: "GET",
                url: "/k/v1/preview/app/customize.json",
                data: param
            }).then(settingAppInfo => {
                return promise.then(results => {
                    results = results || [];
                    return deployAppContents(app, name, contents, settingAppInfo).then(
                        revision => {
                            console.log(`- revision: ${revision}`);
                            results.push({ app, revision });
                            return results;
                        }
                    );
                });
            });
        }, Promise.resolve());
    })
    .then(results => {
        const apps = results.map(result => result.app);
        console.log(`deploy apps: ${apps}`);
        return deployApps(apps);
    })
    .then(result => {
        console.log(`all deployed.`);
    })
    .catch(err => {
        console.error(err);
    });
