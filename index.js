require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const webRoutes = require('./routes/web.routes');
const cors = require('cors');
const dbConexion = require('./database/db');
const app = express();

let port = process.env.PORT || 8080;
app.use( bodyParser.json() );
app.use( cors() );
app.use( bodyParser.urlencoded({ extended: true }) );


dbConexion();
// ===__********** Carpeta pública  **********__===
app.use( express.static('public') );

// ===__********** Rutas  **********__===
app.use( '/', webRoutes );

// ===__********** Arrancar servidor  **********__===
app.listen( port, () => {
    console.log( 'Servidor iniciando en puerto: ' + port );
});