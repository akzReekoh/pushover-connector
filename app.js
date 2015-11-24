'use strict';

var platform = require('./platform'),
    domain = require('domain'),
    isEmpty = require('lodash.isempty'),
    isPlainObject = require('lodash.isplainobject'),
	pushOverClient, defaultMessage;

platform.on('data', function (data) {
    var d = domain.create();

    d.once('error', function(error) {
        console.error(error);
        platform.handleException(error);
        d.exit();
    });

    d.run(function(){
        if(isPlainObject(data)){
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

            if(isEmpty(data.priority))
                delete msg.priority;
            else
                msg.priority = data.priority;

            if(isEmpty(data.url))
                delete  data.url;
            else
                msg.url = data.url;

            if(isEmpty(data.url_title))
                delete  data.url_title;
            else
                msg.url_title = data.url_title;

            pushOverClient.send( msg, function( error, result ) {
                if (error){
                    console.log(error);
                    platform.handleException(error);
                }
                else{
                    platform.log(JSON.stringify({
                        title: 'Pushover Notification Sent',
                        data: msg
                    }));
                }
            });
        }
        else
            platform.handleException(new Error('Invalid data received. Must be a valid JSON Object. Data ' + data));
    });
});

platform.once('close', function () {
	var d = domain.create();

	d.once('error', function(error) {
		console.error(error);
		platform.handleException(error);
		platform.notifyClose();
		d.exit();
	});

	d.run(function() {
		// TODO: Release all resources and close connections etc.
		platform.notifyClose(); // Notify the platform that resources have been released.
		d.exit();
	});
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
	platform.notifyReady();
});