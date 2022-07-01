const { WaterfallDialog, ChoicePrompt, ComponentDialog, TextPrompt } = require('botbuilder-dialogs');

const recognizer = require('../../Helpers/getLuis');
const msg = require('./message');
const objIsEndDialog = require('../../Helpers/isEndDialog');


const SHOPPINGCAR_DIALOG = 'SHOPPINGCAR';
const CONTINUEBUY_CHOICEPROMPT = 'CONTINUEBUY_CHOICEPROMPT';
class ShoppingCar extends ComponentDialog {
    constructor() {
        super(SHOPPINGCAR_DIALOG);

        this.addDialog(new ChoicePrompt(CONTINUEBUY_CHOICEPROMPT))
            .addDialog(new WaterfallDialog(SHOPPINGCAR_DIALOG, [
                this.continueBuy.bind(this),
                this.nextAction.bind(this)
            ]));

        this.initialDialogId = SHOPPINGCAR_DIALOG;
    }
    
    async continueBuy(stepContext) {
        if(!stepContext.values.bike){
            stepContext.values.bike = [];
        }
        stepContext.values.bike.push(stepContext.options.bike);
        await stepContext.context.sendActivity(stepContext.options.bike.name + msg.bikeAdd);
        return stepContext.prompt(CONTINUEBUY_CHOICEPROMPT, msg.continueBuy);
    }

    async nextAction(stepContext) {
        const entitie = await recognizer.getEntities(stepContext.context.luisResult);
        if(!entitie.finishOrder){
            return stepContext.replaceDialog('MENU');
        }
        return stepContext.next();
    }

    
    







}

module.exports = ShoppingCar;