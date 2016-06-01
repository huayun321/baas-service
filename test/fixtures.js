'use strict';

//config
const Config = require('config');

const fixtures = require('pow-mongodb-fixtures').connect(Config.get('mongo_db'));

////Directories (loads all files in the directory)
const load = function() {
    // console.log('<-- --- --- load ____ _____ __dirname', __dirname);
    fixtures.clearAndLoad(__dirname + '/fixtures', function(error, result) {
        console.log('fixtures error :', error);
        console.log('fixtures result :', result);
    });
};

load();
// console.log('<-- --- --- __dirname', __dirname);

