const { Schema, model, default: mongoose } = require('mongoose');

const ValoracionSchema = Schema({
    opinion: {
        type: String,
        allowNull: true
    },
    cliente: {
        type: mongoose.Types.ObjectId,
        ref: 'Cliente'
    }
}, {
    timestamps: true
});

module.exports = model( 'Valoracion', ValoracionSchema );