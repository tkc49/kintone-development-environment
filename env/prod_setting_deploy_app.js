module.exports = {
    "apps": {
        "customers": 81,
        "schedule": 85
    },
    "subdomain": "1234x",
    "auth": "xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "props": {
        "otherApiKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    },
    "contentsPath": "./dist/prod",
    "contents": {
        "customers": {
            "desktop": {
                "js": [
                    "https://js.cybozu.com/vuejs/v2.5.11/vue.min.js",
                    "js/customers.js"
                ],
                "css": [
                    "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
                    "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
                    "css/customers.css"
                ]
            },
            "mobile": {
                "js": [
                    "js/customersMobile.js"
                ]
            }
        },
        "schedule": {
            "desktop": {
                "js": [
                    "https://apis.google.com/js/api.js",
                    "js/schedule.js"
                ],
                "css": []
            }
        }
    }
};
