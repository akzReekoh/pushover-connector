'use strict'

const amqp = require('amqplib')

const USER = 'udrgrpBG5H2dUdGRAHWgcJhW2HMApz'
const TOKEN = 'afc7t8RWCxj1ZxKJVUYZqpQ9LsJq6K'

let _channel = null
let _conn = null
let app = null

describe('HCP MMS Connector Test', () => {
  before('init', () => {
    process.env.ACCOUNT = 'adinglasan'
    process.env.CONFIG = JSON.stringify({
      user: USER,
      token: TOKEN
    })
    process.env.INPUT_PIPE = 'ip.pushover'
    process.env.LOGGERS = 'logger1, logger2'
    process.env.EXCEPTION_LOGGERS = 'ex.logger1, ex.logger2'
    process.env.BROKER = 'amqp://guest:guest@127.0.0.1/'

    amqp.connect(process.env.BROKER)
      .then((conn) => {
        _conn = conn
        return conn.createChannel()
      }).then((channel) => {
      _channel = channel
    }).catch((err) => {
      console.log(err)
    })
  })

  after('close connection', function (done) {
    _conn.close()
    done()
  })

  describe('#start', function () {
    it('should start the app', function (done) {
      this.timeout(10000)
      app = require('../app')
      app.once('init', done)
    })
  })

  describe('#data', () => {
    it('should send data to third party client', function (done) {
      this.timeout(15000)

      let data = {
        message: 'This is a test message from Pushover Connector Plugin',
        title: 'Test Message',
        sound: 'default',
        device: 'm1note',
        priority: 1,
        url: 'http://reekoh.com',
        urlTitle: 'Reekoh Official Website'
      }

      _channel.sendToQueue('ip.pushover', new Buffer(JSON.stringify(data)))
      setTimeout(done, 10000)
    })
  })
})

// 'use strict';
//
// const USER = 'udrgrpBG5H2dUdGRAHWgcJhW2HMApz',
//     TOKEN = 'afc7t8RWCxj1ZxKJVUYZqpQ9LsJq6K';
//
// var cp     = require('child_process'),
// 	assert = require('assert'),
// 	connector;
//
// describe('Connector', function () {
// 	this.slow(5000);
//
// 	after('terminate child process', function (done) {
// 		this.timeout(7000);
//
//         setTimeout(function(){
//             connector.kill('SIGKILL');
// 			done();
//         }, 5000);
// 	});
//
// 	describe('#spawn', function () {
// 		it('should spawn a child process', function () {
// 			assert.ok(connector = cp.fork(process.cwd()), 'Child process not spawned.');
// 		});
// 	});
//
// 	describe('#handShake', function () {
// 		it('should notify the parent process when ready within 5 seconds', function (done) {
// 			this.timeout(5000);
//
// 			connector.on('message', function (message) {
// 				if (message.type === 'ready')
// 					done();
// 			});
//
// 			connector.send({
// 				type: 'ready',
// 				data: {
// 					options: {
// 						user: USER,
// 						token: TOKEN
// 					}
// 				}
// 			}, function (error) {
// 				assert.ifError(error);
// 			});
// 		});
// 	});
//
// 	describe('#data', function (done) {
// 		it('should process the JSON data', function () {
// 			connector.send({
// 				type: 'data',
// 				data: {
//                     message: 'This is a test message from Pushover Connector Plugin',
//                     title: 'Test Message',
//                     sound: 'default',
//                     device: 'm1note',
//                     priority: 1,
//                     url: 'http://reekoh.com',
//                     url_title: 'Reekoh Official Website'
// 				}
// 			}, done);
// 		});
// 	});
//
// 	describe('#data', function (done) {
// 		it('should process the Array data', function () {
// 			connector.send({
// 				type: 'data',
// 				data: [
// 					{
// 						message: 'This is a test message from Pushover Connector Plugin',
// 						title: 'Test Message',
// 						sound: 'default',
// 						device: 'm1note',
// 						priority: 1,
// 						url: 'http://reekoh.com',
// 						url_title: 'Reekoh Official Website'
// 					},
// 					{
// 						message: 'This is a test message from Pushover Connector Plugin',
// 						title: 'Test Message',
// 						sound: 'default',
// 						device: 'm1note',
// 						priority: 1,
// 						url: 'http://reekoh.com',
// 						url_title: 'Reekoh Official Website'
// 					}
// 				]
// 			}, done);
// 		});
// 	});
// });