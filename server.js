'use strict';

const Hapi = require('hapi');
const good = require('good'); // <--- log
const mongojs = require('mongojs');  // <--- mongojs
const Boom = require('boom');



//create a server with an host and port
const server = new Hapi.Server();
server.connection({
    port: 28001,
    routes: {
        cors: {
            origin: ['http://localhost:8002', 'http://localhost:8000', 'http://localhost:1234'],
            additionalHeaders: ['X-Session-ID', 'x-session-id'],
            credentials:true
        },
        // cors: true
    }
});

// const handler = function (request, reply) {
//
//     return reply({ status: 'ok' });
// };
//
// server.route({ method: 'GET', path: '/test', handler: handler });
//
//
const Base = require('@sensoro/base-tool');
Base.setBaseUrl('http://qing.mocha.server.sensoro.com/base');
server.ext({
    type: 'onRequest',
    method: function (request, reply) {
        // console.log(request.url);
        // console.log('request method ', request.method);
        if(request.method === 'options') {
            return reply.continue();
        }
        //check if request from x
        const is_from_x = request.url.path.split('/').indexOf('apps');
        if(is_from_x < 0) {
            return reply.continue();
        }
        const req = request.raw.req;
        const headers = req.headers;
        console.log('<--- -- req.headers[x-session-id]', headers['x-session-id']);

        // console.log('<--- -- req.headers', typeof (headers));


        if (headers['x-session-id']) {
            Base.authentication(headers['x-session-id'], 'baas', 'apps', function(err, result){
                if(err) {
                    return reply({err:err});
                }
                if(result && result.can) {
                    request.uid = result.uid;
                    return reply.continue();
                } else {
                    return reply({err:'权限错误。当前用户没有权限访问该抽奖应用。'});
                }
            });
        } else {
            return reply(Boom.unauthorized('unauthorized'));
        }
    }
});





//connect to db
server.app.db = mongojs('hapi-rest-mongo');


//test injection
// server.inject('/', (res) => {
//
//     console.log('this is the inject');
// });

//Load plugins and start server
server.register([
    
    require('./routes/docs'),
    require('./routes/apps'),

    {
        register: good,
        options : {
            reporters: [{
                reporter: require('good-console'),
                events  : {
                    response: '*',
                    log     : '*'
                }
            }]
        }
    }
], (err) => {

    if(err) {
        throw err;
    }

    //Start the server
    server.start((err) => {
        console.log('Server running at: ', server.info.uri);
    });

});

// server.route({
//     method : 'GET',
//     path   : '/',
//     handler: function(request, reply) {
//         reply('Hello, world!');
//     }
// });
//
// server.route({
//     method : 'GET',
//     path   : '/{name}',
//     handler: function(request, reply) {
//         // reply('Hello,' + request.params.name + '!');  //not safe
//         reply('Hello,' + encodeURIComponent(request.params.name) + '!');
//     }
// });
//
// server.register({
//     register: good,
//     options : {
//         reporters: [{
//             reporter: require('good-console'),
//             events  : {
//                 response: '*',
//                 log     : '*'
//             }
//         }]
//     }
// }, (err) => {

//     if (err) {
//        throw err;
//     }
//
//     server.start((err) => {
//
//         if (err) {
//             throw err;
//         }
//
//         console.log('Server running at: ', server.info.uri);
//     });
// });

module.exports = server;




