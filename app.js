'use strict';

var platform = require('./platform'),
    isEmpty = require('lodash.isempty'),
    isPlainObject = require('lodash.isplainobject'),
    isNumber = require('lodash.isnumber'),
    isArray = require('lodash.isarray'),
    async = require('async'),
	pushOverClient, defaultMessage;

let sendData = (data) => {
    var msg = {
        message: '',
        title: '',
        sound: '',
        device: '',
        priority: '',
        url: '',
        url_title: ''
    };

    if(isEmpty(data.message))
        msg.message = defaultMessage;
    else
        msg.message = data.message;

    if(isEmpty(data.title))
        delete msg.title;
    else
        msg.title = data.title;

    if(isEmpty(data.sound))
        delete msg.sound;
    else
        msg.sound = data.sound;

    if(isEmpty(data.device))
        delete msg.device;
    else
        msg.device = data.device;

    if(isNumber(data.priority) && data.priority < 3)
        msg.priority = data.priority;
    else
        delete msg.priority;

    if(isEmpty(data.url))
        delete  msg.url;
    else
        msg.url = data.url;

    if(isEmpty(data.url_title))
        delete  msg.url_title;
    else
        msg.url_title = data.url_title;

    pushOverClient.send( msg, function( error, result ) {
        if (error){
            console.error(error);
            platform.handleException(error);
        }
        else{
            platform.log(JSON.stringify({
                title: 'Pushover Notification Sent',
                data: msg
            }));
        }
    });
};

platform.on('data', function (data) {
    if(isPlainObject(data)){
        sendData(data);
    }
    else if(isArray(data)){
        async.each(data, (datum) => {
            sendData(datum);
        });
    }
    else
        platform.handleException(new Error('Invalid data received. Must be a valid JSON Object. Data ' + data));
});

platform.once('close', function () {
    platform.notifyClose();
});

platform.once('ready', function (options) {
    var PushOver = require('pushover-notifications');
    defaultMessage = options.default_message;
    pushOverClient = new PushOver({
        user : options.user,
        token : options.token,
        onerror : function(error){
            platform.handleException(error);
        }
    });

    platform.log('Pushover Connector Initialized.');
	platform.notifyReady();
});