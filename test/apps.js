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

// require hapi server
const Server = require('../server.js');

// tests
describe('app create ', () => {

    it('without login', (done) => {

        // make API call to self to test functionality end-to-end
        Server.inject({
            method: 'GET',
            url: '/v1/apps/list'
        }, (response) => {
            expect(response.statusCode).to.equal(401);
            expect(response.result.message).to.equal('unauthorized');
            done();
        });
    });



    it('should get products', (done) => {

        // make API call to self to test functionality end-to-end
        Server.inject({
            method: 'GET',
            url: '/v1/apps/list',
            headers: {"x-session-id": "stvSzYjI8ARKneM5eaX66op63NYdTw1d"}
        }, (response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.result.count).to.equal(7);
            done();
        });
    });


    // it('should get single product', (done) => {
    //
    //     Server.inject({
    //         method: 'GET',
    //         url: '/api/products/1'
    //     }, (response) => {
    //
    //         expect(response.statusCode).to.equal(200);
    //         done();
    //     });
    // });

    after((done) => {

        // placeholder to do something post tests
        done();
    });
});