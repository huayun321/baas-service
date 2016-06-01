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
describe('test list doc ', () => {
    
    before((done) => {
        done();
    });
    
    it('should list doc', (done) => {

        //make API call to self to test functionality end-to-end
        Server.inject({
            method: 'GET',
            url: '/v1/docs/list?app_id=39ea0ea7-f0ec-49af-a1b2-82c7f3cf5387&app_key=93ce81fe-2604-4c5b-b861-1fb53ce5fb0f'
        }, (response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.result.count).to.equal(2);
            expect(response.result.docs[0].obj.str).to.equal('hello');

            done();
        });
    });

    it('should not list docs with wrong app id', (done) => {

        //make API call to self to test functionality end-to-end
        Server.inject({
            method: 'GET',
            url: '/v1/docs/list?app_id=39ea0ea7-f0ec-49af-a1b2-82c7f3cf538a&app_key=93ce81fe-2604-4c5b-b861-1fb53ce5fb0f'
        }, (response) => {
            expect(response.statusCode).to.equal(404);
            expect(response.result.error).to.equal('Not Found');

            done();
        });
    });

    it('should list specify docs with query_key query_value', (done) => {

        //make API call to self to test functionality end-to-end
        Server.inject({
            method: 'GET',
            url: '/v1/docs/list?app_id=39ea0ea7-f0ec-49af-a1b2-82c7f3cf5387&app_key=93ce81fe-2604-4c5b-b861-1fb53ce5fb0f&query_key=obj.str&query_value=hello'
        }, (response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.result.count).to.equal(1);
            expect(response.result.docs[0].obj.str).to.equal('hello');


            done();
        });
    });

    it('should list docs with page_size current_page', (done) => {

        //make API call to self to test functionality end-to-end
        Server.inject({
            method: 'GET',
            url: '/v1/docs/list?app_id=39ea0ea7-f0ec-49af-a1b2-82c7f3cf5387&app_key=93ce81fe-2604-4c5b-b861-1fb53ce5fb0f&page_size=1&current_page=1'
        }, (response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.result.count).to.equal(2);
            expect(response.result.docs[0].obj.str).to.equal('hello');


            done();
        });
    });

    

    after((done) => {

        // placeholder to do something post tests
        done();
    });
});