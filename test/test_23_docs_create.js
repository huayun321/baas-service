'use strict';

// requires for testing
const Code        = require('code');
const expect      = Code.expect;
const Lab         = require('lab');
const lab         = exports.lab = Lab.script();

// use some BDD verbage instead of lab default
const describe    = lab.describe;
const it          = lab.it;
const after       = lab.after;
const before      = lab.before;

// require hapi server
const Server = require('../server.js');

// tests
describe('test create doc ', () => {
    
    before((done) => {
        done();
    });
    
    it('should create doc', (done) => {

        //make API call to self to test functionality end-to-end
        Server.inject({
            method: 'POST',
            url: '/v1/docs/create',
            payload: {
                "app_id":"39ea0ea7-f0ec-49af-a1b2-82c7f3cf5387",
                "app_key":"93ce81fe-2604-4c5b-b861-1fb53ce5fb0f",
                "obj":{
                    "str":"lu la lu",
                    "num":1234,
                    "obj":{
                        "hello":"hello",
                        "oobj":{"lala":"lalala"}
                    },
                    "arr":[{"arro":"arro","arri":[4,5,6]},[1,2,3]],
                    "boo":"boo11"
                }
            }
        }, (response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.result.obj.str).to.equal('lu la lu');
            done();
        });
    });

    it('should not create doc with wrong app_id app_key', (done) => {

        //make API call to self to test functionality end-to-end
        Server.inject({
            method: 'POST',
            url: '/v1/docs/create',
            payload: {
                "app_id":"39ea0ea7-f0ec-49af-a1b2-82c7f3cf538a",
                "app_key":"93ce81fe-2604-4c5b-b861-1fb53ce5fb0f",
                "obj":{
                    "str":"lu la lu",
                    "num":1234,
                    "obj":{
                        "hello":"hello",
                        "oobj":{"lala":"lalala"}
                    },
                    "arr":[{"arro":"arro","arri":[4,5,6]},[1,2,3]],
                    "boo":"boo11"
                }
            }
        }, (response) => {
            expect(response.statusCode).to.equal(422);
            expect(response.result.message).to.equal('your data is bad and you should feel bad');
            done();
        });
    });

    

    after((done) => {

        // placeholder to do something post tests
        done();
    });
});