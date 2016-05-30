'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const Base = require('@sensoro/base-tool');
Base.setBaseUrl('http://qing.mocha.server.sensoro.com/base');

exports.register = function (server, options, next) {
    var v1_prefix = '/v1/stores/';

    console.log('<--- ---- hello ?');
    const db = server.app.db;
    const docs = db.collection('stores');


    server.ext({
        type: 'onRequest',
        method: function (request, reply) {
            // console.log(request.url);
            console.log('request method ', request.method);
            if(request.method === 'options') {
                return reply.continue();
            }
            const req = request.raw.req;
            const headers = req.headers;
            console.log('<--- -- req.headers[x-session-id]', headers['x-session-id']);

            console.log('<--- -- req.headers', typeof (headers));


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
                return reply({err:'跨域错误，请查看HTTP.HEADERS'});
            }
        }
    });



    /**
     * list stores pre
     */
    const count_stores_by_uid = function (request, reply) {
        docs.count({uid: request.query.uid, is_delete: false},
            function (err, count) {
                if (err) {
                    return reply({err:err});
                }

                return reply({err:err, count:count});
            }
        );
    };
    

    /**
     * list stores
     * @param {} - nothing
     * @returns {array}
     */
    server.route({
        config: {
            pre: [
                {method: count_stores_by_uid, assign: 'count_result'}
            ]
        },
        method: 'GET',
        path: v1_prefix + 'list',
        handler: function(request, reply) {
            console.log('<---- --- /list');
            console.log('<---- --- /list request.uid can ', request.uid);
            return reply('request.uid', request.uid);

            var page_size = Number(request.query.page_size) || 10;
            var current_page = Number(request.query.current_page) || 1;
            var skip = (current_page - 1) * page_size;

            docs.find({uid: request.query.uid, is_delete: false})
                .sort({create_time: -1})
                .limit(page_size)
                .skip(skip, function (err, results) {
                    if(err) {
                        return reply(Boom.badData('Internal MongoDB error', err));
                    }

                    reply({stores: results, count: request.pre.count_result.count});
                });
            
        }
    });


    server.route({
        method: 'GET',
        path: v1_prefix + 'stop',
        handler: function(request, reply) {

            docs.findAndModify({
                query: { _id: request.query.store_id },
                update: { $set: { is_stop: true } },
                new: false
            }, function (err, doc, lastErrorObject) {
                if(err) {
                    return reply(Boom.badData('Internal MongoDB error', err, lastErrorObject));
                }
                return reply(doc);
            })

        }
    });


    server.route({
        method: 'GET',
        path: v1_prefix + 'start',
        handler: function(request, reply) {

            docs.findAndModify({
                query: { _id: request.query.store_id },
                update: { $set: { is_stop: false } },
                new: false
            }, function (err, doc, lastErrorObject) {
                if(err) {
                    return reply(Boom.badData('Internal MongoDB error', err, lastErrorObject));
                }
                return reply(doc);
            })

        }
    });


    server.route({
        method: 'GET',
        path: v1_prefix + 'delete',
        handler: function(request, reply) {

            docs.findAndModify({
                query: { _id: request.query.store_id },
                update: { $set: { is_delete: true } },
                new: false
            }, function (err, doc, lastErrorObject) {
                if(err) {
                    return reply(Boom.badData('Internal MongoDB error', err, lastErrorObject));
                }
                return reply(doc);
            })

        }
    });



    /**
     * create stores
     * @param {string} - store name
     * @param {string} - user id
     * @returns {string}
     */
    server.route({
        method: 'POST',
        path: v1_prefix + 'create',
        handler: function(request, reply) {
            console.log('<---- --- /create');

            const doc = request.payload;

            //generate app id and key
            const id_key = generate_id_key();

            doc.app_id = id_key.id;
            doc.app_key = id_key.key;
            doc.create_time = Date.now();
            doc.update_time = Date.now();
            doc.is_stop = false;
            doc.is_delete = false;



            //Create an id
            doc._id = uuid.v1();

            docs.save(doc, (err, result) => {

                if (err) {
                    return reply(Boom.badData('Internal MongoDB error', err));
                }

                reply(doc);
            });

        }
    });

    /**
     * generate app id and app key
     * @returns {object} - with app id and key
     */
    function generate_id_key() {
        var result = {};
        result.id = uuid.v4();
        result.key = uuid.v4();
        
        return result;
    }

    return next();
};

exports.register.attributes = {
    name: 'routes-stores'
};