const { WaterfallDialog, ChoicePrompt, ComponentDialog, TextPrompt, ConfirmPrompt } = require('botbuilder-dialogs');

const recognizer = require('../../Helpers/getLuis');
const msg = require('./message');
const objIsEndDialog = require('../../Helpers/isEndDialog');
const { Register } = require('../Register/register');
const register = new Register();

const SHOPPINGCAR_DIALOG = 'SHOPPINGCAR';
const PAYMENTMETHOD_CHOICEPROMPT = 'PAYMENTMETHOD_CHOICEPROMPT';
const CHANGE_CHOICEPROMPT = 'CHANGE_CHOICEPROMPT';
const CONTINUEBUY_CHOICEPROMPT = 'CONTINUEBUY_CHOICEPROMPT';
const PROCEEDBUY_CONFIRMPROMPT = 'PROCEEDBUY_CONFIRMPROMPT';
class ShoppingCar extends ComponentDialog {
    constructor() {
        super(SHOPPINGCAR_DIALOG);

        this.addDialog(register)
            .addDialog(new ChoicePrompt(CONTINUEBUY_CHOICEPROMPT))
            .addDialog(new ChoicePrompt(CHANGE_CHOICEPROMPT))
            .addDialog(new ChoicePrompt(PAYMENTMETHOD_CHOICEPROMPT))
            .addDialog(new ConfirmPrompt(PROCEEDBUY_CONFIRMPROMPT))
            .addDialog(new WaterfallDialog(SHOPPINGCAR_DIALOG, [
                this.continueBuy.bind(this),
                this.nextAction.bind(this),
                this.registerOrChange.bind(this),
                this.startNewDialog.bind(this),
            ]));

        this.initialDialogId = SHOPPINGCAR_DIALOG;
    }

    async continueBuy(stepContext) {
        if (!stepContext.values.bike) {
            stepContext.values.bike = [];
        }
        stepContext.values.bike.push(stepContext.options.bike);
        await stepContext.context.sendActivity(stepContext.options.bike.name + msg.bikeAdd);
        return stepContext.prompt(CONTINUEBUY_CHOICEPROMPT, msg.continueBuy);
    }

    async nextAction(stepContext) {
        const entitie = await recognizer.getEntities(stepContext.context.luisResult);
        if (!entitie.finishOrder) {
            return stepContext.replaceDialog('MENU');
        }
        await stepContext.context.sendActivity('**Dados compra**');
        return stepContext.prompt(PROCEEDBUY_CONFIRMPROMPT, msg.proceedBuy);
    }

    async registerOrChange(stepContext) {
        if (!stepContext.result) {
            return stepContext.prompt(CHANGE_CHOICEPROMPT, msg.changesInCart);
        }
        await stepContext.context.sendActivity(msg.messageRegisterOrChange);
        return stepContext.prompt(PAYMENTMETHOD_CHOICEPROMPT, msg.paymentMethod);
    }

    async startNewDialog(stepContext) {
        const entitie = recognizer.getEntities(stepContext.context.luisResult);
        if (entitie.paymentMethod) {
            return stepContext.replaceDialog('REGISTER', { paymentMethod: entitie.paymentMethod[0][0] });
        } else if (entitie.remove) {
            //Fazer dialogo remove bike
        } else if (entitie.addBike) {
            return stepContext.replaceDialog('MENU');
        }
        await stepContext.context.sendActivity('Compra cancelada');
        return stepContext.cancelAllDialogs(true);
    }












}

module.exports = ShoppingCar;