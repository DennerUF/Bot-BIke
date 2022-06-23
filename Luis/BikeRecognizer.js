require('dotenv').config();
const { LuisRecognizer } = require('botbuilder-ai');
const { LuisAppId, LuisAPIKey, LuisAPIHostName } = process.env;

class BikeRecognizer {
    constructor(){
        const luisConfig = { applicationId: LuisAppId, endpointKey: LuisAPIKey, endpoint: `https://${LuisAPIHostName}` };
        if (luisConfig) {
            const recognizerOptions = {
                apiVersion: 'v3'
            };
        
            this.recognizer = new LuisRecognizer(luisConfig, recognizerOptions);
        }
    }
    /**
     * Call LUIS to interpret user message
     * @param context Dialog context, where the user's message is
     * @returns Recognized Intents and Entities
     */
    async executeLuisQuery(context) {
        return this.recognizer.recognize(context);
    }
    /**
     * Returns highest scoring intent
     * @param context Dialog context
     * @returns Uppercase high-scoring intent
     */
    async getTopIntent(context){
        const luisResult = await this.executeLuisQuery(context);
        return LuisRecognizer.topIntent(luisResult).toUpperCase();
    }
    /**
     * Returns recognized entities
     * @param context Dialog context
     * @returns Recognized entities
     */
    async getEntities(context){//add try-catch
        const entites = await this.executeLuisQuery(context)
        return entites.entities;
    }
}



module.exports.BikeRecognizer = BikeRecognizer;
