require('dotenv').config();
const request = require('request');
const { controllerDialogFlow } = require('../helpers/controllerDialogFlow');
const { detectIntent } = require('../helpers/intentDetectado');
const config = require('../config/index');
const Producto = require('../models/Producto');
const Sucursal = require('../models/Sucursal');
const Promocion = require('../models/Promocion');
const Detalle = require('../models/Detalle');

const test = ( req, res ) => {
    console.log( typeof new Date().toLocaleDateString() );
    // const detalle1 = new Detalle( { 
    //     producto: '633510fe9d69399b3deb64b6', 
    //     promocion: '6335149c808635932402be66'
    // } );
    // const detalle2 = new Detalle( { 
    //     producto: '633510fe9d69399b3deb64b5', 
    //     promocion: '6335149c808635932402be67'
    // } );
    // detalle1.save()
    // detalle2.save()
    // promocion.save();
    // const promocion1 = new Promocion( { 
    //     nombre: 'Paquete 1', 
    //     descuento: '120', 
    //     descripcion: 'Descuento del 10% por la compra del paquete',
    //     cantidadSillas: '20',
    //     cantidadMesas: '5'
    // } );
    // const promocion2 = new Promocion( { 
    //     nombre: 'Paquete 2', 
    //     descuento: '200', 
    //     descripcion: 'Descuento del 15% por la compra del paquete',
    //     cantidadSillas: '10',
    //     cantidadMesas: '5'
    // } );
    // promocion1.save();
    // promocion2.save();
    // const sucursal = new Sucursal( { departamento: 'Santa Cruz', municipio: 'El Torno', barrio: '6 de Mayo', calle: 'Bolivia', numero: '80' } );
    // const sucursal1 = new Sucursal( { departamento: 'Santa Cruz', municipio: 'El Torno', barrio: 'Miraflores', calle: 'Naciones Unidas', numero: '10' } );
    // const producto1 = new Producto( { nombre: 'Mesa', precio: '100', forma: 'Redonda' } );
    // const producto2 = new Producto( { nombre: 'Mesa', precio: '70', forma: 'Cuadrada' } );
    // const producto3 = new Producto( { nombre: 'Silla', precio: '50' } );
    // sucursal.save();
    // sucursal1.save();
    // producto1.save(); 
    // producto2.save();   
    // producto3.save();
    // promocion.save();|
    // promocion1.save();|
    res.send('Bot prueba');
    console.log('Bot prueba');
}
const getWebHook = ( req, res ) => {
    const verifyToken = config.MY_VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challengue = req.query['hub.challenge'];
    if ( mode && token ) {
        if ( mode === 'subscribe' && token === verifyToken ) {
            console.log(' webhook verificado ');
            res.status( 200 ).send( challengue );
        } else {
            res.sendStatus( 403 );
        }
    }
}
const postWebHook = ( req, res ) => {
   /* let data = req.body;
    if ( data.object === "page" ) {
        data.entry.forEach( pageEntry => {
            pageEntry.messaging.forEach( messagingEvent => {
                if (messagingEvent.message) {
                    receivedMessage( messagingEvent );
                } else {
                    console.log( "Webhook received unknown messagingEvent: ", messagingEvent );
                }
            });
        });
        res.sendStatus(200);
    } else {
        res.sendStatus( 404 );
    } */
    let body = req.body;
    //checks this is an event from a page subscription
    if (body.object === 'page') {
        //Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {
            // Gets the message, entry.messaging is an array, but
            // will only ever contain one message, so we get index 0

            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid)

            //Check if the event is a message or postback and
            //pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }

        });
        //Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        //Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
}
const receivedMessage = async( event ) => {
    let senderId = event.sender.id;
    let message = event.message;
    let messageText = message.text;
    if ( messageText ) {
        console.log("1.MENSAJE DEL USUARIO: ", messageText);
        await sendDialogFlow(senderId, messageText);
    }
}
const sendDialogFlow = async( senderId, messageText ) => {
    let respuesta = await detectIntent( config.GOOGLE_PROJECT_ID, senderId, messageText, '', 'es' );
    // console.log(respuesta)
    let peticion_body = {};
    peticion_body = await controllerDialogFlow( respuesta, senderId );
    envioMensaje( peticion_body );
}
const envioMensaje = async( peticion_body ) => {
    console.log('Envio mensaje a messenger');
    request(
        {
            uri: "https://graph.facebook.com/v14.0/me/messages",
            qs: { "access_token": config.FB_PAGE_TOKEN },
            method: "POST",
            json: peticion_body
        }, (err, res, body) => {
            if (!err) {
                console.log('message sent!')
            } else {
                console.error("Unable to send message:" + err);
            }
        }
    );
}
const sendTypingOff = recipientId => {
    var messageData = {
      recipient: {
        id: recipientId,
      },
      sender_action: "typing_off",
    };
    // TODO:
    // callSendAPI(messageData);
}
module.exports ={ test, getWebHook, postWebHook };