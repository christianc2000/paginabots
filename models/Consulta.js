const { Schema, model, default: mongoose } = require('mongoose');

const ConsultaSchema = Schema({
    producto: {
        type: mongoose.Types.ObjectId,
        ref: 'Producto'
    },
    prospecto: {
        type: mongoose.Types.ObjectId,
        ref: 'Prospecto'
    }
}, {
    timestamps: true
});

module.exports = model( 'Consulta', ConsultaSchema );