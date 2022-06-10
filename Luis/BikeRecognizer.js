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

    async executeLuisQuery(context) {
        return await this.recognizer.recognize(context);
    }

    async getTopIntent(context){
        const luisResult = await this.executeLuisQuery(context);
        return LuisRecognizer.topIntent(luisResult).toUpperCase();
    }

    async getEntities(context){
        const entites = await this.executeLuisQuery(context)
        return entites.entities;
    }
}



module.exports.BikeRecognizer = BikeRecognizer;
