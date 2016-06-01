//users.js
var id = require('pow-mongodb-fixtures').createObjectId;

var docs = exports.docs = {
    //正确活动
    doc1: {
        "_id": "1226996f-5d5e-4fe7-8b03-8fd6f7377d6d",
        "app_id": "39ea0ea7-f0ec-49af-a1b2-82c7f3cf5387",
        "app_key": "93ce81fe-2604-4c5b-b861-1fb53ce5fb0f",
        "obj": {
            "str": "lu la lu",
            "num": 1234,
            "obj": {
                "hello": "hello",
                "oobj": {
                    "lala": "lalala"
                }
            },
            "arr": [
                {
                    "arro": "arro",
                    "arri": [
                        4,
                        5,
                        6
                    ]
                },
                [
                    1,
                    2,
                    3
                ]
            ],
            "boo": "boo11"
        },
        "create_time": 1464763384232.0,
        "update_time": 1464763384232.0,
        "is_delete": false
    },
    doc2: {
        "_id": "1226996f-5d5e-4fe7-8b03-8fd6f7377d6e",
        "app_id": "39ea0ea7-f0ec-49af-a1b2-82c7f3cf5387",
        "app_key": "93ce81fe-2604-4c5b-b861-1fb53ce5fb0f",
        "obj": {
            "str": "hello",
            "num": 1234,
            "obj": {
                "hello": "hello",
                "oobj": {
                    "lala": "lalala"
                }
            },
            "arr": [
                {
                    "arro": "arro",
                    "arri": [
                        4,
                        5,
                        6
                    ]
                },
                [
                    1,
                    2,
                    3
                ]
            ],
            "boo": "boo11"
        },
        "create_time": 1464765164775.0,
        "update_time": 1464763384232.0,
        "is_delete": false
    }

}