'use strict';

const path = require('path');
const internetAvailable = require("internet-available");


module.exports = {

    // nombre de la app
    name: "Wsp Autobatifantástico Xd",

    // description
    description: "Bienvenido al respondedor automatizado para whatsapp",

    // host
    host: "http://localhost",

    // puerto
    port: 3000,

    // icono de la notificación
    iconNotification: path.resolve(__dirname, '../assets/icon.png'),

    // verificar si hay internet
    isOnline: async () =>  internetAvailable().then(res => true).catch(err => false)
    
}