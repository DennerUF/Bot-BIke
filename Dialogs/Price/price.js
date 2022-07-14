const { WaterfallDialog, ChoicePrompt, ComponentDialog } = require('botbuilder-dialogs');
const recognizer = require('../../Helpers/getLuis');
const msg = require('./message');
const objIsEndDialog = require('../../Helpers/isEndDialog');
const filter = require('../../Helpers/filterBikes');

const { ShowBikes } = require('../ShowBikes/showBikes');
const showBikes = new ShowBikes();


const PRICE_DIALOG = 'PRICE';
const CHOOSE_FILTER_PRICE = 'CHOOSE_FILTER_PRICE';
class Price extends ComponentDialog {
    constructor() {
        super(PRICE_DIALOG);

        this.addDialog(new ChoicePrompt(CHOOSE_FILTER_PRICE, this.choosePricePromptValidator,'pt-br',{'pt-br':{includeNumbers:false}}))
            .addDialog(showBikes)
            .addDialog(new WaterfallDialog(PRICE_DIALOG, [
                this.chooseFilterPrice.bind(this),
                this.beginIntentFilter.bind(this)
            ]));

        this.initialDialogId = PRICE_DIALOG;
    }
    /**
     * Display 'ChoicePrompt' with price filters
     * @param {TurnContext} stepContext Dialog Context
     * @returns ChoicePrompt filter price
     */
    async chooseFilterPrice(stepContext) {
        return stepContext.prompt(CHOOSE_FILTER_PRICE, msg.choosePrice);
    }
    /**
     * Checks if the user has reached the limits of wrong answers, if yes, closes the dialog
     * Calls the 'ShowBike' dialog passing a list of bikes to be displayed
     * @param {TurnContext} stepContext Dialog Context 
     * @returns {Promise<DialogTurnStatus>} start new dialog
     */
    async beginIntentFilter(stepContext) {
        if (await objIsEndDialog.isEndDialog(stepContext)) { return stepContext.endDialog(); }
        if (stepContext.result == 'menuDialog') { return stepContext.replaceDialog('MENU'); }
        let bikes = await filter.filterBikes('price', stepContext.result);
        if (!bikes || bikes.length <= 0) {
            await stepContext.context.sendActivity(msg.messageError);
            return stepContext.replaceDialog('MENU');
        }
        return stepContext.beginDialog('SHOWBIKES', { bikes: bikes });
    }
    /**
     * Validates 'chooseFilterPrice' response with entities from LUIS. 
     * Organize LUIS values
     * And counts the amount of wrong answers from the user, 
     * After three errors, adds "finishDialog" to 'stepContext.recognized.value' signaling to the prompt method that the dialog must be closed
     * @param {TurnContext} stepContext Dialog Context 
     * @returns boolean 
     */
    async choosePricePromptValidator(stepContext) {
        const entitie = await recognizer.getEntities(stepContext.context.luisResult);
        if(!entitie && stepContext.attemptCount < 3){
            return false;
        }else if (entitie.anotherFilter) {
            stepContext.recognized.value = 'menuDialog';
            return true;
        } else if (!entitie.price && stepContext.attemptCount < 3) {
            return false;
        } else if (!entitie.price && stepContext.attemptCount == 3) {
            stepContext.recognized.value = 'finishDialog';
            return true;
        }

        if(entitie.price.length > 1 ){
            let prices = Object.assign({},entitie.price[0], entitie.price[1]);
            let keys = Object.keys(prices);
            prices[keys[0]] = entitie.number[0];
            prices[keys[2]] = entitie.number[1];
            stepContext.recognized.value =  {min: prices['priceMin'],max:prices['priceMax']} ;
        }else{
            let prices = Object.assign({},entitie.price[0])
            let keys = Object.keys(prices);
            prices[keys[0]] = entitie.number[0];
            stepContext.recognized.value = prices;
        }

        return true;
    }








}

module.exports.Price = Price;