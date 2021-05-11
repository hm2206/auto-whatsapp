'use strict';

const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');
const DB = require('./db.json');
const path = require('path');
const Notification = require('./Notification');

const SESSION_FILE_PATH = path.resolve(__dirname, 'session.json');

class Whatsapp {

    constructor () {
        this.sessionData = this.getSession();
        this.logged = this.sessionData ? true : false;
        this.client = new Client({ session: this.sessionData });
        this.settingAuthentication();
    }

    getSession () {
        if(fs.existsSync(SESSION_FILE_PATH)) return require(SESSION_FILE_PATH);
        return null;
    }

    getClient () {
        return this.client;
    }

    getCodeQr () {
        return this.codeQr;
    }

    getChats () {
        return this.client.getChats();
    }

    // listeners
    onCodeQr (type = 'base64', callback = null) {
        this.client.on('qr', async (qr) => {
            let resolvers = {
                base64: () => qrcode.toDataURL(qr),
                binary: async () => {
                    let ruta = path.resolve(__dirname, '../codeqr/code.png');
                    return await qrcode.toFile(ruta, [
                        { data: qr, mode: 'byte' }
                    ]).then(async () => await fs.readFileSync(ruta))
                    .catch(err => null);
                },
            };

            // resolver
            let dataQr = await resolvers[type]();
            return typeof callback == 'function' ? callback(dataQr) : null;
        });
    }

    onMessage (callback = null) {
        this.client.on('message', msg => {
            let command = `${msg.body}`.toLowerCase();
            let response = null;
        
            // obtener respuesta
            for (let posibility in DB) {
                let regx = new RegExp(`${posibility}+`);
                let is_response = regx.test(command);
                if (!is_response) continue;
                // manejar respuesta
                let arrayResponse = DB[posibility];
                let max = arrayResponse.length;
                let min = 0;
                let aleatorio = Math.floor(Math.random() * (max - min)) + min;
                response = arrayResponse[aleatorio];
            }
        
            if (!response) return;
        
            return typeof callback == 'function' ? callback(msg, response) : null;
        });
    }

    // configuraciones
    settingAuthentication () {
        this.client.on('authenticated', (session) => {
            this.sessionData = session;
            fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
                if (err) console.error(err);
                else {
                    this.logged = true;
                    new Notification({ message: "Usted acaba de iniciar sesión en esté equipo" });
                };
            });
        });
    }

    // correr app
    execute () {
        this.client.initialize();
    }

}


module.exports = Whatsapp;