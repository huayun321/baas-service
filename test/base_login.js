'use strict';

const Config = require('config');
const Urllib = require('urllib');

exports.login = function(callback){
    var url = Config.get('base_url') + '/sessions';
    var data = {
        email: 'test@sensoro.com', //'wangzhiyong@sensoro.com',
        password: 'Xlab@20151108', //'sensoro'
    };
    Urllib.request(url, {type: 'POST', data: data, dataType: 'json'}, callback);
};