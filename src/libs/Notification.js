'use strict';

const notifier = require('node-notifier');
const { name, iconNotification, description } = require('../config/app');

class Notification {

    params = {
        message: "",
        sound: true,
        wait: true
    }

    constructor (options = this.params, callback = null) {
        let newOptions = Object.assign({
            title: name,
            message: description,
            icon: iconNotification,
            sound: true,
            wait: true
        }, options || {});
        // emitir
        notifier.notify(newOptions,
            function (err, response, metadata) {
                if (typeof callback == 'function') callback(err, response, metadata);
            }
          );
    }

}


module.exports = Notification;