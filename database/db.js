const mongoose = require('mongoose');
require('dotenv').config();
const dbConexion = async() => {
    try {
        await mongoose.connect( process.env.MONGO_DB, {
            useNewUrlParser: true
        });
        console.log('Base de datos iniciada correctamente');
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la db')
    }
}

module.exports = dbConexion