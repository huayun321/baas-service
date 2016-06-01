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
describe('test get apps list ', () => {
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
    
    it('should get apps list', (done) => {

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

    it('should get apps list with page_size current_page', (done) => {

        //make API call to self to test functionality end-to-end
        Server.inject({
            method: 'GET',
            url: '/v1/apps/list?page_size=1&current_page=1',
            headers: {"x-session-id": session_id}
        }, (response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.result.count).to.equal(2);
            expect(response.result.stores[0].name).to.equal('你好');
            expect(response.result.stores.length).to.equal(1);


            done();
        });
    });

    it('should get apps list with page_size current_page', (done) => {

        //make API call to self to test functionality end-to-end
        Server.inject({
            method: 'GET',
            url: '/v1/apps/list?page_size=1&current_page=10',
            headers: {"x-session-id": session_id}
        }, (response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.result.count).to.equal(2);
            expect(response.result.stores.length).to.equal(0);

            done();
        });
    });

    it('should not apps list with -page_size -current_page', (done) => {

        //make API call to self to test functionality end-to-end
        Server.inject({
            method: 'GET',
            url: '/v1/apps/list?page_size=-1&current_page=-10',
            headers: {"x-session-id": session_id}
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