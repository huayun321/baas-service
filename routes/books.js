'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');

exports.register = function (server, options, next) {
    console.log('<--- ---- hello ?');
    const db = server.app.db;
    const docs = db.collection('docs');

    //PLACEHOLDER
    //----------------------------------------//
    //Here the routes definitions will be inserted in the next steps
    server.route({
        method: 'GET',
        path: '/list',
        handler: function(request, reply) {
            console.log('<---- --- /list');
            
            docs.find((err, docs) => {
                
                if(err) {
                    return reply(Boom.badData('Internal MongoDB error', err));
                }

                reply(docs);
            })
            
        }
    });


    server.route({
        method: 'GET',
        path: '/books/{id}',
        handler: function(request, reply) {

            docs.findOne({
                _id: request.params.id
            }, (err, doc) => {

                if(err) {
                    return reply(Boom.badData('Internal MongoDB error', err));
                }
                
                if(!doc) {
                    return reply(Boom.notFound('hello'));
                }

                reply(doc);
            })

        }
    });


    server.route({
        method: 'POST',
        path: '/create',
        handler: function(request, reply) {
            console.log('<---- --- /create');

            const doc = request.payload;

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


    return next();
};

exports.register.attributes = {
    name: 'routes-books'
};