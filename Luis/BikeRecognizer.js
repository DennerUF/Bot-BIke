require('dotenv').config();
const { LuisRecognizer } = require('botbuilder-ai');


class BikeRecognizer {
    constructor(config){
        const luisIsConfigured = config && config.applicationId && config.endpointKey && config.endpoint;
        if (luisIsConfigured) {
            const recognizerOptions = {
                apiVersion: 'v3'
            };
        
            this.recognizer = new LuisRecognizer(config, recognizerOptions);
        }
    }
    /** 
     * Informs if LUIS is configured
     * @returns boolean
    */
    get isConfigured() {
        return (this.recognizer !== undefined);
    }
    /**
     * Call LUIS to interpret user message
     * @param {TurnContext} context
     * @returns RecognizerResult 
     */
    async executeLuisQuery(context) {
        return this.recognizer.recognize(context);
    }
    
}



module.exports.BikeRecognizer = BikeRecognizer;
