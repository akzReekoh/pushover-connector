'use strict'

let reekoh = require('reekoh')
let _plugin = new reekoh.plugins.Connector()
let async = require('async')
let isArray = require('lodash.isarray')
let isEmpty = require('lodash.isempty')
let isNumber = require('lodash.isnumber')
let isPlainObject = require('lodash.isplainobject')
let pushOverClient = null

let sendData = (data, callback) => {
  let msg = {
    message: '',
    title: '',
    sound: '',
    device: '',
    priority: '',
    url: '',
    urlTitle: ''
  }

  if (isEmpty(data.message)) {
    msg.message = _plugin.config.defaultMessage
  } else {
    msg.message = data.message
  }

  if (isEmpty(data.title)) {
    delete msg.title
  } else {
    msg.title = data.title
  }

  if (isEmpty(data.sound)) {
    delete msg.sound
  } else {
    msg.sound = data.sound
  }

  if (isEmpty(data.device)) {
    delete msg.device
  } else {
    msg.device = data.device
  }

  if (isNumber(data.priority) && data.priority < 3) {
    msg.priority = data.priority
  } else {
    delete msg.priority
  }

  if (isEmpty(data.url)) {
    delete msg.url
  } else {
    msg.url = data.url
  }

  if (isEmpty(data.urlTitle)) {
    delete msg.urlTitle
  } else {
    msg.urlTitle = data.urlTitle
  }

  pushOverClient.send(msg, (error) => {
    if (!error) {
      _plugin.log(JSON.stringify({
        title: 'Pushover Notification Sent',
        data: msg
      }))
    }

    callback(error)
  })
}

/**
 * Emitted when device data is received.
 * This is the event to listen to in order to get real-time data feed from the connected devices.
 * @param {object} data The data coming from the device represented as JSON Object.
 */
_plugin.on('data', (data) => {
  if (isPlainObject(data)) {
    sendData(data, (error) => {
      if (error) {
        console.error(error)
        _plugin.logException(error)
      }
    })
  } else if (isArray(data)) {
    async.each(data, (datum, done) => {
      sendData(datum, done)
    }, (error) => {
      if (error) {
        console.error(error)
        _plugin.logException(error)
      }
    })
  } else { _plugin.logException(new Error('Invalid data received. Must be a valid JSON Object. Data ' + data)) }
})

/**
 * Emitted when the platform bootstraps the plugin. The plugin should listen once and execute its init process.
 */
_plugin.once('ready', () => {
  let PushOver = require('pushover-notifications')

  pushOverClient = new PushOver({
    user: _plugin.config.user,
    token: _plugin.config.token,
    onerror: (error) => {
      _plugin.logException(error)
    }
  })

  _plugin.log('Pushover Connector has been initialized.')
  _plugin.emit('init')
})

module.exports = _plugin
