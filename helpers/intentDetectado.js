const uuid = require('uuid');
const dialogflow = require('@google-cloud/dialogflow');
const config = require('../config/index');
const fs = require('fs');

const detectIntent = async( proyectId = config.GOOGLE_PROJECT_ID, sessionId = uuid.v4(), query = '', contexts, languageCode = 'es' ) => {
    try {
        if(!fs.existsSync(`${__dirname}/../chatbot-account.json`)){
            return false
        }
    
        const parseCredentials = JSON.parse(fs.readFileSync(`${__dirname}/../chatbot-account.json`));
        let CONFIGURATION = {
            credentials: {
                private_key: parseCredentials['private_key'],
                client_email: parseCredentials['client_email']
            }
        }
        const sessionClient = new dialogflow.SessionsClient( CONFIGURATION );
        const sessionPath = sessionClient.projectAgentSessionPath( proyectId, sessionId );
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: query,
                    languageCode,
                },
            }
        };
        if ( contexts && contexts.length > 0 ) {
            request.queryParams = {
                contexts
            }
        }
        const responses = await sessionClient.detectIntent( request );
        console.log("responses" + responses);
        const result = responses[0].queryResult;
        console.log("result " + result )
        console.log("aqui_------------------------")
        if ( result.intent ) {
            console.log("INTENT EMPAREJADO: ", result.intent.displayName);
        } else {
            console.log('No hay intenciones')
        }
        return result;
        // console.log("se enviara el resultado: ", result);
    } catch ( e ) {
        console.log(`Error de las intenciones ${ e }`);
    }
}
module.exports = { detectIntent };