const { WaterfallDialog, ChoicePrompt, ComponentDialog, TextPrompt, ConfirmPrompt } = require('botbuilder-dialogs');

const recognizer = require('../../Helpers/getLuis');
const msg = require('./message');
const objIsEndDialog = require('../../Helpers/isEndDialog');
const { Register } = require('../Register/register');
const register = new Register();
const RemoveBikeCart = require('../RemoveBikeCart/removeBikeCart');
const removeBikeCart = new RemoveBikeCart();

const dataBase = require('../../DataBase/actionsDB');

const SHOPPINGCAR_DIALOG = 'SHOPPINGCAR';
const PAYMENTMETHOD_CHOICEPROMPT = 'PAYMENTMETHOD_CHOICEPROMPT';
const CHANGE_TEXTPROMPT = 'CHANGE_TEXTPROMPT';
const CONTINUEBUY_CHOICEPROMPT = 'CONTINUEBUY_CHOICEPROMPT';
const PROCEEDBUY_CONFIRMPROMPT = 'PROCEEDBUY_CONFIRMPROMPT';
class ShoppingCar extends ComponentDialog {
    constructor() {
        super(SHOPPINGCAR_DIALOG);

        this.addDialog(register)
            .addDialog(removeBikeCart)
            .addDialog(new ChoicePrompt(CONTINUEBUY_CHOICEPROMPT))
            .addDialog(new TextPrompt(CHANGE_TEXTPROMPT))
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
        if (stepContext.options.remove) {
            return stepContext.next();
        }
        const idConversation = stepContext.context._activity.conversation.id;
        const idBike = stepContext.options.bike.id;
        const nameBike = stepContext.options.bike.name;
        const priceBike = stepContext.options.bike.price;
        const resultAlreadyCreated = await dataBase.alreadyCreated(idConversation);
        if (resultAlreadyCreated) {
            await dataBase.insert(idConversation, idBike, nameBike, priceBike);
        } else {
            await dataBase.addBike(idConversation, idBike, nameBike, priceBike);
        }
        await stepContext.context.sendActivity(nameBike + msg.bikeAdd);
        return stepContext.prompt(CONTINUEBUY_CHOICEPROMPT, msg.continueBuy);
    }

    async nextAction(stepContext) {
        const entitie = await recognizer.getEntities(stepContext.context.luisResult);
        if (!entitie.finishOrder && !stepContext.options.remove) {
            return stepContext.replaceDialog('MENU');
        }
        const bikes = await dataBase.findBikes(stepContext.context._activity.conversation.id);
        await stepContext.context.sendActivity(msg.dataPurchase(bikes));
        return stepContext.prompt(PROCEEDBUY_CONFIRMPROMPT, msg.proceedBuy);
    }

    async registerOrChange(stepContext) {
        if (!stepContext.result) {
            return stepContext.prompt(CHANGE_TEXTPROMPT, msg.changesInCart);
        }
        await stepContext.context.sendActivity(msg.messageRegisterOrChange);
        return stepContext.prompt(PAYMENTMETHOD_CHOICEPROMPT, msg.paymentMethod);
    }

    async startNewDialog(stepContext) {
        const entitie = recognizer.getEntities(stepContext.context.luisResult);
        if (entitie.paymentMethod) {
            return stepContext.replaceDialog('REGISTER', { paymentMethod: entitie.paymentMethod[0][0] });
        } else if (entitie.remove) {
            return stepContext.replaceDialog('REMOVEBIKECART');
        } else if (entitie.addBike) {
            return stepContext.replaceDialog('MENU');
        }
        await dataBase.removeCart(stepContext.context._activity.conversation.id);
        await stepContext.context.sendActivity('Compra cancelada');
        return stepContext.cancelAllDialogs(true);
    }












}

module.exports = ShoppingCar;