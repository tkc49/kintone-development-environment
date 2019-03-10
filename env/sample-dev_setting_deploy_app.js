module.exports = {
    "apps": {
        "test": 247,
        "test2": 248
    },
    "props": {
        "otherApiKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    },
    "contentsPath": "./app",
    "contents": {
        "test": {
            "desktop": {
                "js": [
                    "https://kintone.github.io/kintoneUtility/kintoneUtility.min.js",
                    "000-test/app.js",
                    "test.js"
                ],
                "css": []
            },
            "mobile": {
                "js": []
            }
        },
        "test2": {
            "desktop": {
                "js": [
                    "000-test/app.js"
                ],
                "css": []
            },
            "mobile": {
                "js": []
            }
        }

    }
};
