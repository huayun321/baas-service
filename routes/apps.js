'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');

exports.register = function (server, options, next) {

    var v1_prefix = '/v1/apps/';

    console.log('<--- ---- hello ?');
    const db = server.app.db;
    const apps = db.collection('apps');

    server.route({
        method: 'GET',
        path: v1_prefix + 'get-by-id',
        config: {
            validate: {
                query: {
                    app_id: Joi.string().regex(/^[a-zA-Z0-9-]{36}$/).required()
                }
            }
        },
        handler: function (request, reply) {

            apps.findOne({
                _id: request.query.app_id
            }, (err, doc) => {

                if (err) {
                    return reply(Boom.badData('Internal MongoDB error', err));
                }

                if (!doc) {
                    return reply(Boom.notFound('hello'));
                }

                reply(doc);
            })

        }
    });


    /**
     * list stores pre
     */
    const count_stores_by_uid = function (request, reply) {
        apps.count({uid: request.uid, is_delete: false},
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
            ],
            validate: {
                query: {
                    page_size: [Joi.number().positive()],
                    current_page: [Joi.number().positive()]
                }
            }
        },
        method: 'GET',
        path: v1_prefix + 'list',
        handler: function(request, reply) {
            console.log('<---- --- /list');
            console.log('<---- --- /list request.uid can ', request.uid);
            console.log('<---- --- /list request.pre.count_result.count ', request.pre.count_result.count);


            var page_size = Number(request.query.page_size) || 10;
            var current_page = Number(request.query.current_page) || 1;
            var skip = (current_page - 1) * page_size;

            apps.find({uid: request.uid, is_delete: false})
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
        config: {
            validate: {
                query: {
                    app_id: Joi.string().regex(/^[a-zA-Z0-9-]{36}$/)
                }
            }
        },
        handler: function(request, reply) {

            apps.findAndModify({
                query: { _id: request.query.app_id },
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
        config: {
            validate: {
                query: {
                    app_id: Joi.string().regex(/^[a-zA-Z0-9-]{36}$/)
                }
            }
        },
        handler: function(request, reply) {

            apps.findAndModify({
                query: { _id: request.query.app_id },
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
        config: {
            validate: {
                query: {
                    app_id: Joi.string().regex(/^[a-zA-Z0-9-]{36}$/)
                }
            }
        },
        handler: function(request, reply) {

            apps.findAndModify({
                query: { _id: request.query.app_id },
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
        config: {
            validate: {
                payload: {
                    name: Joi.string().min(1, 'utf8').max(20, 'utf8').required()
                }
            }
        },
        handler: function(request, reply) {
            console.log('<---- --- /create');

            const app = request.payload;

            app.app_key = uuid.v4();
            app.create_time = Date.now();
            app.update_time = Date.now();
            app.is_stop = false;
            app.is_delete = false;
            app.uid = request.uid;

            //Create an id
            app._id = uuid.v4();

            apps.save(app, (err, result) => {

                if (err) {
                    return reply(Boom.badData('Internal MongoDB error', err));
                }

                reply(app);
            });

        }

    });


    /**
     * update stores
     * @param {string} - store name
     * @param {string} - user id
     * @returns {string}
     */
    server.route({
        method: 'PUT',
        path: v1_prefix + 'update-key',
        config: {
            validate: {
                payload: {
                    app_id: Joi.string().regex(/^[a-zA-Z0-9-]{36}$/)
                }
            }
        },
        handler: function(request, reply) {
            console.log('<---- --- /update-key');
            const arg = request.payload;
            //generate new key
            const key = uuid.v4();

            apps.findAndModify({
                query: { _id: arg.app_id },
                update: { $set: {app_key: key, update_time: Date.now()} },
                new: false
            }, function (err, doc, lastErrorObject) {
                if(err) {
                    return reply(Boom.badData('Internal MongoDB error', err, lastErrorObject));
                }
                return reply(key);
            })

        }
    });
    
    //---------------------
    const docs = db.collection('docs');

    const check_if_mongo_query = function (request, reply) {
        var query = {app_id: request.query.app_id, app_key: request.query.app_key, is_delete:false};
        if(request.query.query_key && request.query.query_value) {
            query[request.query.query_key] = request.query.query_value;
        }
        reply(query);
    };

    const count_docs_by_id_key = function (request, reply) {
        console.log('count_docs_by_id_key <--- docs', docs);

        docs.count(
            request.pre.check_result,
            function (err, count) {
                if (err) {
                    console.log('count_docs_by_id_key <--- err', err);
                    return reply({err:err});
                }

                return reply({err:err, count:count});
            }
        );
    };


    //PLACEHOLDER
    //----------------------------------------//
    //Here the routes definitions will be inserted in the next steps
    server.route({
        config: {
            pre: [
                {method: check_if_mongo_query, assign: 'check_result'},
                {method: count_docs_by_id_key, assign: 'count_result'}
            ],
            validate: {
                query: {
                    page_size: [Joi.number().positive()],
                    current_page: [Joi.number().positive()],
                    app_id: Joi.string().regex(/^[a-zA-Z0-9-]{36}$/),
                    app_key: Joi.string().regex(/^[a-zA-Z0-9-]{36}$/),
                    query_key: [Joi.string().regex(/^(obj\.)[a-zA-Z0-9-_$\.]{1,50}$/)],
                    query_value: [Joi.string().min(1).max(999)],
                }
            }
        },
        method: 'GET',
        path: v1_prefix + 'docs/list',
        handler: function (request, reply) {

            console.log('docs list <----- check result', request.pre.check_result);
            console.log('docs list <----- count_result', request.pre.count_result);


            if(request.pre.count_result.err) {
                return reply(Boom.badData('Internal MongoDB error', err));
            }

            var page_size = Number(request.query.page_size) || 10;
            var current_page = Number(request.query.current_page) || 1;
            var skip = (current_page - 1) * page_size;

            docs.find(request.pre.check_result)
                .sort({create_time: -1})
                .limit(page_size)
                .skip(skip, function (err, docs) {
                    if (err) {
                        return reply(Boom.badData('Internal MongoDB error', err));
                    }

                    reply({docs: docs, count: request.pre.count_result.count});
                });
        }
    });


    server.route({
        method: 'GET',
        path: v1_prefix + 'docs/delete',
        config:{
            validate: {
                query: {
                    doc_id: Joi.string().regex(/^[a-zA-Z0-9-]{36}$/),
                }
            }
        },
        handler: function(request, reply) {

            docs.findAndModify({
                query: { _id: request.query.doc_id },
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

    //----------------------
    
    
    
    

    return next();
};

exports.register.attributes = {
    name: 'routes-stores'
};