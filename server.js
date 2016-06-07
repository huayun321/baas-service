'use strict';

const Hapi = require('hapi');
const good = require('good'); // <--- log
const mongojs = require('mongojs');  // <--- mongojs
const Boom = require('boom');
const Config = require('config');



//create a server with an host and port
const server = new Hapi.Server();
server.connection({
    port: Config.get('server_port'),
    routes: {
        cors: {
            origin: Config.get('origin'),
            additionalHeaders: ['x-session-id'],
            credentials:true
        },
        // cors: true
    }
});


const Base = require('@sensoro/base-tool');
Base.setBaseUrl(Config.get('base_url'));
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
            Base.authentication(headers['x-session-id'], 'nine', 'apps', function(err, result){
                if(err) {
                    return reply({err:err});
                }
                if(result && result.can) {
                    console.log('<--- -- result.uid', result.uid);

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
server.app.db = mongojs(Config.get('mongo_db'));

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


module.exports = server;




