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


// require base login
const login = require('./base_login.js').login;


// require hapi server
const Server = require('../server.js');

//require fixtures for test
var apps = require('./fixtures/apps').apps;


// tests
describe('test create app ', () => {
    //session-id
    let session_id = '';
    
    before((done) => {
        //get session di before tests
        login((err, data) => {
            if(err) {
                return done(err);
            }
            session_id = data.sessionID;
            done();
        });
    });
    
    it('should create one app', (done) => {

        //make API call to self to test functionality end-to-end
        Server.inject({
            method: 'POST',
            url: '/v1/apps/create',
            headers: {"x-session-id": session_id},
            payload: {"name": "asdf"}
        }, (response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.result.name).to.equal('asdf');
            done();
        });
    });

    it('should not create app without name', (done) => {

        //make API call to self to test functionality end-to-end
        Server.inject({
            method: 'POST',
            url: '/v1/apps/create',
            headers: {"x-session-id": session_id},
        }, (response) => {
            expect(response.statusCode).to.equal(400);
            expect(response.result.error).to.equal('Bad Request');
            done();
        });
    });

    it('should not create app without name', (done) => {

        //make API call to self to test functionality end-to-end
        Server.inject({
            method: 'POST',
            url: '/v1/apps/create',
            headers: {"x-session-id": session_id},
            payload: {"name": ""}
        }, (response) => {
            expect(response.statusCode).to.equal(400);
            expect(response.result.error).to.equal('Bad Request');
            done();
        });
    });

    it('should not create app with name length bigger than 20', (done) => {

        //make API call to self to test functionality end-to-end
        Server.inject({
            method: 'POST',
            url: '/v1/apps/create',
            headers: {"x-session-id": session_id},
            payload: {"name": "hello hello hello hello"}
        }, (response) => {
            expect(response.statusCode).to.equal(400);
            expect(response.result.error).to.equal('Bad Request');
            done();
        });
    });


    after((done) => {

        // placeholder to do something post tests
        done();
    });
});