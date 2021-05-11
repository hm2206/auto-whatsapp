const fs = require('fs');
const path = require('path');

let ruta = path.resolve(__dirname, './libs/session.json');

let isSession = fs.existsSync(ruta);

if (isSession) fs.unlinkSync(ruta);