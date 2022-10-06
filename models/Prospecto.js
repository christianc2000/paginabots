const { Schema, model } = require('mongoose');
const generaIdRandom = require('../helpers/generar');

const ProspectoSchema = Schema({
    nombre: {
        type: String,
        allowNull: false
    },
    imagen: {
        type: String
    },
    token: {
        type: String,
        default: generaIdRandom()
    },
    facebookId: {
        allowNull: true,
        type: String
    }
}, {
    timestamps: true
});

module.exports = model( 'Prospecto', ProspectoSchema );