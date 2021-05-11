'use strict';

const Server = require('./libs/Server');
const Whatsapp = require('./libs/Whatsapp');
const path = require('path');
const wsp = new Whatsapp();

const server = new Server();
server.execute(() => {

    // eventos de wsp
    wsp.onMessage((msg, response) => {
        msg.reply(response);
        console.log(`mensaje enviado: "${response}"`);
    });

    // executar wsp
    wsp.execute();

    // executar eventos y ruta
    server.use('/', async (req, res) => {
        if (wsp.logged) return res.sendFile(path.resolve(__dirname, './assets/html/success.html'));
        // generar code QR
        return wsp.onCodeQr('binary', (data) => {
            res.setHeader('Content-Type', 'image/png');
            res.send(data);
        });
    });

});





