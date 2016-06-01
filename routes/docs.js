'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');

exports.register = function (server, options, next) {
    const v1_prefix = "/v1/docs/";

    console.log('<--- ---- hello ?', v1_prefix);
    const db = server.app.db;
    const docs = db.collection('docs');
    const apps = db.collection('apps');

    const check_app_key = function (request, reply) {
        apps.findOne({
            _id: request.query.app_id,
            app_key: request.query.app_key,
            is_delete: false,
            is_stop: false
        }, (err, doc) => {

            if (err) {
                return reply({err_inner: err});
            }

            if (!doc) {
                console.log('app not found');
                return reply({err_not_found: true});
            }

            reply({});
        })
    };

    const check_if_mongo_query = function (request, reply) {
        console.log('check_if_mongo_query <------, request.query', request.query);
        
        var query = {app_id: request.query.app_id, app_key: request.query.app_key};
        if(request.query.query_key && request.query.query_value) {
            query[request.query.query_key] = request.query.query_value;
        }
        reply(query);
    };

    const count_docs_by_id_key = function (request, reply) {
        docs.count(
            request.pre.check_result,
            function (err, count) {
                if (err) {
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
                {method: count_docs_by_id_key, assign: 'count_result'},
                {method: check_app_key, assign: 'check_id_result'}
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
        path: v1_prefix + 'list',
        handler: function (request, reply) {
            //check if valid id key
            if(request.pre.check_id_result.err_inner) {
                console.log('inner');
                return reply(Boom.badData('Internal MongoDB error', err));
            }
            if(request.pre.check_id_result.err_not_found) {
                console.log('404 app_id app_key not valid');

                return reply(Boom.notFound('app_id app_key not valid'));
            }
            
            console.log('check result', request.pre.check_result);
            
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

    //---------------------
    const check_id_key = function (request, reply) {
        const app = request.payload;
        console.log('<-- --check_id_key payload', app);
        apps.findOne({
            _id: app.app_id,
            app_key: app.app_key,
            is_stop: false,
            is_delete: false
        }, (err, doc) => {

            if (err) {
                return reply({err_inner: err});
            }

            if (!doc) {
                return reply({err_not_found: true});
            }

            reply({});
        })
    };

    
    server.route({
        method: 'POST',
        path: v1_prefix + 'create',
        config:{
            pre: [
                {method: check_id_key, assign: 'check_result'}
            ],
            validate: {
                payload: {
                    app_id: Joi.string().regex(/^[a-zA-Z0-9-]{36}$/),
                    app_key: Joi.string().regex(/^[a-zA-Z0-9-]{36}$/),
                    obj: Joi.object().min(1).max(50)
                }
            }
        },
        handler: function (request, reply) {
            //check if valid id key
            if(request.pre.check_result.err_inner) {
                console.log('inner');
                return reply(Boom.badData('Internal MongoDB error', err));
            }
            if(request.pre.check_result.err_not_found) {
                console.log('404');

                return reply(Boom.badData('your data is bad and you should feel bad'));
            }

            console.log('<---- --- /create');
            const doc = request.payload;

            doc.create_time = Date.now();
            doc.update_time = Date.now();
            doc.is_delete = false;
            //Create an id
            doc._id = uuid.v4();

            docs.save(doc, (err, result) => {

                if (err) {
                    return reply(Boom.badData('Internal MongoDB error', err));
                }

                reply(doc);
            });

        }
    });


    return next();
};

exports.register.attributes = {
    name: 'routes-docs'
};