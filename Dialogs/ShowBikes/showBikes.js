const { WaterfallDialog, ComponentDialog, DialogTurnStatus, TextPrompt, ConfirmPrompt, ChoicePrompt } = require('botbuilder-dialogs');

const card = require('../../Helpers/cardMaker');

const recognizer = require('../../Helpers/getLuis');
const ShoppingCar = require('../ShoppingCar/ShoppingCar');

const shoppingCar = new ShoppingCar();

const msg = require('./message');
const CONFIRM_BUY = 'CONFIRM_BUY';
const NEXTSTEP_CHOOSEPROMPT = 'CHOOSENEXTSTEP';
const TEXT_PROMPT = 'textPrompt';
const SHOWBIKES_DIALOG = 'SHOWBIKES';
class ShowBikes extends ComponentDialog {
    constructor() {
        super(SHOWBIKES_DIALOG);
        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ChoicePrompt(NEXTSTEP_CHOOSEPROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_BUY))
            .addDialog(shoppingCar)
            .addDialog(new WaterfallDialog(SHOWBIKES_DIALOG, [
                this.showBike.bind(this),
                this.confirmBuy.bind(this),
                this.nextAction.bind(this),
            ]));

        this.initialDialogId = SHOWBIKES_DIALOG;

    }
    /**
     * First waterfall step
     * Shows the bike card with the chosen characteristics
     * @param {TurnContext} stepContext Dialog Context 
     * @returns {Promise<DialogTurnStatus>} { status: DialogTurnStatus.waiting }
     */
    async showBike(stepContext) {
        stepContext.values.bikes = stepContext.options.bikes;
        stepContext.values.description = stepContext.options.description || false;
        const bikes = stepContext.options.bikes;
        if (stepContext.options.description) {
            stepContext.values.newBranch = true;
            await stepContext.context.sendActivity({ attachments: [card.descriptionCard(bikes[0], bikes.length)] });
            return stepContext.prompt(CONFIRM_BUY, msg.confirmBuy);
        } else {
            await stepContext.context.sendActivity({ attachments: [card.fullCard(bikes[0], bikes.length)] });
        }
        return stepContext.prompt(TEXT_PROMPT);
    }

    async confirmBuy(stepContext){
        if(stepContext.values.newBranch){
            if(stepContext.result){
                return stepContext.replaceDialog('SHOPPINGCAR', { bike: stepContext.values.bikes[0] })
            }
        const msgPrompt = stepContext.values.bikes.length <= 2
        ? msg.nextStepPromptNoOption
        : msg.nextStepPrompt
        return stepContext.prompt(NEXTSTEP_CHOOSEPROMPT, msgPrompt);
        }
        return stepContext.next();
        
    }
    /**
     * It uses Luis intents and entities to interpret the user's response and know what to do next. 
     * If want to know more information about the bike. 
     * Or if want to see another bike with the same characteristics. 
     * Or if want to perform another search with new filters. 
     * Also checks if the number of cards has reached the end
     * @param {TurnContext} stepContext Dialog Context 
     * @returns {Promise<DialogTurnStatus>} start new dialog
     */
    async nextAction(stepContext) {
        const bikes = stepContext.values.bikes;
        const entitie = await recognizer.getEntities(stepContext.context.luisResult);
        const intent = await recognizer.getTopIntent(stepContext.context.luisResult);
        if (!entitie || !intent) {
            await stepContext.context.sendActivity(msg.erro);
            return stepContext.replaceDialog('MENU');
        } else if (intent == 'MENU') {
            return stepContext.replaceDialog('MENU');
        } else if (entitie.information) {
            return stepContext.replaceDialog(SHOWBIKES_DIALOG, { bikes: bikes, description: {description: true} })
        } else if (bikes.length > 1) {
            bikes.shift();
            return stepContext.replaceDialog(SHOWBIKES_DIALOG, { bikes: bikes });
        }
        await stepContext.context.sendActivity(msg.message);
        return stepContext.replaceDialog('MENU');
    }

   


}

module.exports.ShowBikes = ShowBikes;