const { WaterfallDialog, ChoicePrompt, ComponentDialog, NumberPrompt, ConfirmPrompt } = require('botbuilder-dialogs');

const recognizer = require('../../Helpers/getLuis');
const msg = require('./message');
const objIsEndDialog = require('../../Helpers/isEndDialog');
const dataBase = require('../../DataBase/actionsDB'); 

const REMOVEBIKECART_DIALOG = 'REMOVEBIKECART';
const ITEMCART_NUMBERPROMPT = 'ITEMCART_NUMBERPROMPT';
class RemoveBikeCart extends ComponentDialog {
    constructor() {
        super(REMOVEBIKECART_DIALOG);

        this.addDialog(new NumberPrompt(ITEMCART_NUMBERPROMPT, this.itemCartValidator))
            .addDialog(new WaterfallDialog(REMOVEBIKECART_DIALOG, [
                this.selectItem.bind(this),
                this.removeItem.bind(this),
            ]));

        this.initialDialogId = REMOVEBIKECART_DIALOG;
    }
    /**
     * Shows cart items and asks which user wants to remove
     * @param {TurnContext} stepContext Dialog Context
     * @returns {Promise<DialogTurnStatus>} 
     */
    async selectItem(stepContext) {
        const bikes = await dataBase.findBikes(stepContext.context._activity.conversation.id);
        stepContext.values.bikes = bikes;
        const namesBike = msg.namesBike(bikes);
        await stepContext.context.sendActivity(msg.msgItemsCart+namesBike);
        return stepContext.prompt(ITEMCART_NUMBERPROMPT, msg.selectItem(namesBike));
    }
    /**
     * Checks if the user has reached the limits of wrong answers, if yes, closes the dialog
     * Calls the 'SHOPPINGCAR' dialog informing that bike was removed
     * @param {TurnContext} stepContext Dialog Context
     * @returns {Promise<DialogTurnStatus>}  
     */
    async removeItem(stepContext){
        if (await objIsEndDialog.isEndDialog(stepContext)) { return stepContext.endDialog(); }
        const position = stepContext.result - 1;
        const bikeRemoved = stepContext.values.bikes[position];
        await dataBase.removeBike(stepContext.context._activity.conversation.id, bikeRemoved._id);
        return stepContext.replaceDialog('SHOPPINGCAR', {remove: true});

    }
    /**
     * Validates 'selectItem' response with entities from LUIS.
     * And counts the amount of wrong answers from the user, 
     * After threshold reaching, add "finishDialog" to 'stepContext.recognized.value' signaling to prompt method that the dialog box should be closed
     * @param {TurnContext} stepContext Dialog Context 
     * @returns boolean 
     */
    async itemCartValidator(stepContext){
        const entitie = recognizer.getEntities(stepContext.context.luisResult);
        if (!entitie.number && stepContext.attemptCount < 2) {
            return false;
        } else if (!entitie.purchaseData && stepContext.attemptCount == 2) {
            stepContext.recognized.value = 'finishDialog';
            return true;
        }

        stepContext.recognized.value = entitie.number[0];
        return true;
    }


}

module.exports = RemoveBikeCart;

