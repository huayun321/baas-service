//users.js
var id = require('pow-mongodb-fixtures').createObjectId;

var apps = exports.apps = {
    //正确活动
    app1: {
        "_id": "39ea0ea7-f0ec-49af-a1b2-82c7f3cf5387",
        "name": "asdf",
        "app_key": "93ce81fe-2604-4c5b-b861-1fb53ce5fb0f",
        "create_time": 1464677579279.0,
        "update_time": 1464677579279.0,
        "is_stop": false,
        "is_delete": false,
        "uid": "556ffc246af880885d1edacb"
    },
    
    app2: {
        "_id": "da6267e0-feac-484c-8a11-6a95646ed9ec",
        "name": "你好",
        "app_key": "a3a2fa42-892e-4cf5-a6e8-41c88c277a54",
        "create_time": 1464679164766.0,
        "update_time": 1464679164766.0,
        "is_stop": false,
        "is_delete": false,
        "uid": "556ffc246af880885d1edacb"
    }

}