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
describe('test get get app by id ', () => {
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
    
    it('should get an app with app id', (done) => {

        //make API call to self to test functionality end-to-end
        Server.inject({
            method: 'GET',
            url: '/v1/apps/get-by-id?app_id=' + apps.app1._id,
            headers: {"x-session-id": session_id}
        }, (response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.result.name).to.equal('asdf');
            done();
        });
    });

    it('should not get app without app id', (done) => {

        //make API call to self to test functionality end-to-end
        Server.inject({
            method: 'GET',
            url: '/v1/apps/get-by-id',
            headers: {"x-session-id": session_id}
        }, (response) => {
            expect(response.statusCode).to.equal(400);
            expect(response.result.error).to.equal('Bad Request');
            done();
        });
    });

    it('should not get app without app id', (done) => {

        //make API call to self to test functionality end-to-end
        Server.inject({
            method: 'GET',
            url: '/v1/apps/get-by-id',
            headers: {"x-session-id": session_id}
        }, (response) => {
            expect(response.statusCode).to.equal(400);
            expect(response.result.error).to.equal('Bad Request');
            done();
        });
    });

    it('should not get app with wrong app id', (done) => {

        //make API call to self to test functionality end-to-end
        Server.inject({
            method: 'GET',
            url: '/v1/apps/get-by-id?app_id=abc',
            headers: {"x-session-id": session_id}
        }, (response) => {
            expect(response.statusCode).to.equal(400);
            expect(response.result.error).to.equal('Bad Request');
            done();
        });
    });

    it('should not get app with wrong app id', (done) => {

        //make API call to self to test functionality end-to-end
        Server.inject({
            method: 'GET',
            url: '/v1/apps/get-by-id?app_id=39ea0ea7-f0ec-49af-a1b2-82c7f3cf5399',
            headers: {"x-session-id": session_id}
        }, (response) => {
            expect(response.statusCode).to.equal(404);
            expect(response.result.error).to.equal('Not Found');
            done();
        });
    });



    after((done) => {

        // placeholder to do something post tests
        done();
    });
});