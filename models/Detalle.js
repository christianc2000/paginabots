const { Schema, model, default: mongoose } = require('mongoose');

const DetalleSchema = Schema({
    producto: {
        type: mongoose.Types.ObjectId,
        ref: 'Producto'
    },
    promocion: {
        type: mongoose.Types.ObjectId,
        ref: 'Promocion'
    }
}, {
    timestamps: true
});

module.exports = model( 'Detalle', DetalleSchema );