const { Schema, model } = require('mongoose');

const SucursalSchema = Schema({
    departamento: {
        type: String,
        allowNull: false
    },
    municipio: {
        type: String,
        allowNull: false
    },
    barrio: {
        type: String,
        allowNull: true
    },
    calle: {
        type: String,
        allowNull: true
    },
    numero: {
        type: String,
        allowNull: true
    }
});

module.exports = model( 'Sucursal', SucursalSchema );