# Pushover Connector
[![Build Status](https://travis-ci.org/Reekoh/pushover-connector.svg)](https://travis-ci.org/Reekoh/pushover-connector)
![Dependencies](https://img.shields.io/david/Reekoh/pushover-connector.svg)
![Dependencies](https://img.shields.io/david/dev/Reekoh/pushover-connector.svg)
![Built With](https://img.shields.io/badge/built%20with-gulp-red.svg)

Pushover Connector for the Reekoh IoT Platform. Integrates a Reekoh instance with Pushover to deliver real-time push notifications for Android, iOS and Desktop.

## Description
This plugin sends real-time notifications to devices from Pushover. These notifications are from the Reekoh Instance which are sent to Pushover.

## Configuration
To configure this plugin a Pushover account and Application is needed in order to provide the following:

1. User Key - The Pushover User Key to use
2. Application/API Token -  The Pushover Application/API Key to use.

Other parameter:

Default Message - The default text/body of the Pushover Notification.

These parameters are then injected to the plugin from the platform.