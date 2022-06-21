const { WaterfallDialog, ChoicePrompt, ComponentDialog } = require('botbuilder-dialogs');
const { BikeRecognizer } = require('../../Luis/BikeRecognizer');
const recognizer = new BikeRecognizer();
const msg = require('./message');
const isEndDialog = require('../../Helpers/isEndDialog');
const filterBikes = require('../../Helpers/filterBikes');

const { ShowBikes } = require('../ShowBikes/showBikes');
const showBikes = new ShowBikes();


const PRICE_DIALOG = 'PRICE';
const CHOOSE_FILTER_PRICE = 'CHOOSE_FILTER_PRICE';
class Price extends ComponentDialog {
    constructor() {
        super(PRICE_DIALOG);

        this.addDialog(new ChoicePrompt(CHOOSE_FILTER_PRICE, this.choosePricePromptValidator))
            .addDialog(showBikes)
            .addDialog(new WaterfallDialog(PRICE_DIALOG, [
                this.chooseFilterPrice.bind(this),
                this.beginIntentFilter.bind(this)
            ]));

        this.initialDialogId = PRICE_DIALOG;
    }
    /**
     * First step of the waterfall. Display ChoicePrompt filter types
     * @param stepContext Dialog Context
     * @returns ChoicePrompt filter types
     */
    async chooseFilterPrice(stepContext) {
        return stepContext.prompt(CHOOSE_FILTER_PRICE, msg.choosePrice);
    }
    /**
     * Calls the 'ShowBike' dialog passing a list of bikes to be displayed
     * @param stepContext 
     * @returns 
     */
    async beginIntentFilter(stepContext) {
        if (await isEndDialog(stepContext)) { return stepContext.endDialog(); }
        if (stepContext.result == 'menuDialog') { return stepContext.replaceDialog('MENU'); }
        let bikes = await filterBikes('price', stepContext.result);
        if (!bikes || bikes.length <= 0) {
            await stepContext.context.sendActivity(msg.messageError);
            return stepContext.replaceDialog('MENU');
        }
        return stepContext.beginDialog('SHOWBIKES', { bikes: bikes });
    }
    /**
     * Validates 'chooseFilterPrice' response with entities from LUIS. 
     * And counts the amount of wrong answers from the user, 
     * After three errors, adds "finishDialog" to 'stepContext.recognized.value' signaling to the prompt method that the dialog must be closed
     * @param stepContext 
     * @returns boolean 
     */
    async choosePricePromptValidator(stepContext) {
        const entitie = await recognizer.getEntities(stepContext.context);
        console.log(entitie.price);
        if (entitie.anotherFilter) {
            stepContext.recognized.value = 'menuDialog';
            return true;
        } else if (!entitie.price && stepContext.attemptCount < 3) {
            return false;
        } else if (!entitie.price && stepContext.attemptCount == 3) {
            stepContext.recognized.value = 'finishDialog';
            return true;
        }
        if(entitie.price.length >1 ){
            stepContext.recognized.value =  {min:entitie.price[0]['priceMin'][0],max:entitie.price[1]['priceMax'][0]} ;
        }else{
            stepContext.recognized.value = entitie.price[0]; 
        }

        return true;
    }








}

module.exports.Price = Price;