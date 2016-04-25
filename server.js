'use strict';

const Hapi = require('hapi');
const good = require('good'); // <--- log
const mongojs = require('mongojs');  // <--- mongojs


//create a server with an host and port
const server = new Hapi.Server();
server.connection({
    port: 28001,
    routes: {
        // cors: {
        //     origin: ['http://localhost:1234', 'http://localhost:8000']
        // }
        cors: {
            headers: ['X-Session-ID', 'Accept', 'Authorization', 'Content-Type', 'If-None-Match']
        }
    }
});

server.ext({
    type: 'onRequest',
    method: function (request, reply) {
        // console.log(request.url);


        const req = request.raw.req;
        const headers = req.headers;
        console.log('<--- -- req.headers', headers);
        console.log('<--- -- req.headers', typeof (headers));
        

        // Change all requests to '/test'
        request.setUrl('/test');
        return reply.continue();
    }
});

const handler = function (request, reply) {

    return reply({ status: 'ok' });
};

server.route({ method: 'GET', path: '/test', handler: handler });





//connect to db
server.app.db = mongojs('hapi-rest-mongo');


//test injection
// server.inject('/', (res) => {
//
//     console.log('this is the inject');
// });

//Load plugins and start server
server.register([
    
    require('./routes/books'),
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



