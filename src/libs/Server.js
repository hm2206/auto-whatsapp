'use strict';

const express = require('express');
const http = require('http');
const opn = require('opn');

const { isOnline, port, host } = require('../config/app');
const Notification = require('./Notification');

class Server {

    constructor () {
        this.server = express();
        this.app = http.createServer(this.server);
    }

    middlewares () {
        this.app.use(express.static('assets'));
    }

    execute (callback = null) {
        this.app.listen(port, async () => {
            if (await isOnline()) {
                new Notification({}, (err, response, metadata) => {
                    opn(`${host}:${port}`);
                });
                // execurar callback
                if (typeof callback == 'function') return callback(this.server);
            } else {
                new Notification({
                    message: "Usted debe estár conectado a internet :C"
                }, (err, response));
            }
        });
        
    }

    use (route = '/', callback = null) {
        this.server.use(route, callback);
    }

}

module.exports = Server;