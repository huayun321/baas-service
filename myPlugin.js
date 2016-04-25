'use strict';

const myPlugin = {
    register: function (server, options, next) {
        console.log('this is a plugin');
        next();
    }
};

myPlugin.register.attributes = {
    name: 'myPlugin',
    version: '1.0.0'
};