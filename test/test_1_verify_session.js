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

// tests
describe('test server authentication with session id ', () => {
    //session-id
    let session_id = '';

    before((done) => {
        // placeholder to do something before tests
        login((err, data) => {
            if(err) {
                return done(err);
            }
            session_id = data.sessionID;
            done();
        });

    });

    it('should get products', (done) => {
        expect(session_id).to.be.a.string();
        console.log(session_id);
        done();
    });

    it('should get products', (done) => {

        //make API call to self to test functionality end-to-end
        Server.inject({
            method: 'GET',
            url: '/v1/apps/list',
            headers: {"x-session-id": session_id}
        }, (response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.result.count).to.equal(2);
            done();
        });
    });

    after((done) => {

        // placeholder to do something post tests
        done();
    });
});