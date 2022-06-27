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
    get isConfigured() {
        return (this.recognizer !== undefined);
    }
    /**
     * Call LUIS to interpret user message
     * @param context Dialog context, where the user's message is
     * @returns Recognized Intents and Entities
     */
    async executeLuisQuery(context) {
        return this.recognizer.recognize(context);
    }
    
}



module.exports.BikeRecognizer = BikeRecognizer;
