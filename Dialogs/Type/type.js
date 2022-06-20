const { WaterfallDialog, ChoicePrompt, ComponentDialog } = require('botbuilder-dialogs');
const { BikeRecognizer } = require('../../Luis/BikeRecognizer');
const recognizer = new BikeRecognizer();
const msg = require('./message');
const isEndDialog = require('../../Helpers/isEndDialog');
const filterBikes = require('../../Helpers/filterBikes');

const { ShowBikes } = require('../ShowBikes/showBikes');
const showBikes = new ShowBikes();


const TYPE_DIALOG = 'TYPE';
const CHOOSE_FILTER_TYPE = 'CHOOSE_FILTER_TYPE';
class Type extends ComponentDialog {
    constructor() {
        super(TYPE_DIALOG);

        this.addDialog(new ChoicePrompt(CHOOSE_FILTER_TYPE, this.chooseTypePromptValidator))
            .addDialog(showBikes)
            .addDialog(new WaterfallDialog(TYPE_DIALOG, [
                this.chooseFilterType.bind(this),
                this.beginIntentFilter.bind(this)
            ]));

        this.initialDialogId = TYPE_DIALOG;
    }
    /**
     * First step of the waterfall. Display ChoicePrompt filter types
     * @param stepContext Dialog Context
     * @returns ChoicePrompt filter types
     */
    async chooseFilterType(stepContext) {
        await stepContext.context.sendActivity(msg.message);
        return stepContext.prompt(CHOOSE_FILTER_TYPE, msg.chooseType);
    }
    /**
     * Calls the 'ShowBike' dialog passing a list of bikes to be displayed
     * @param stepContext 
     * @returns 
     */
    async beginIntentFilter(stepContext) {
        if (await isEndDialog(stepContext)) { return stepContext.endDialog(); }
        let bikes = await filterBikes('type', stepContext.result);
        if (!bikes || bikes.length <= 0) {
            await stepContext.context.sendActivity(msg.messageError);
            return stepContext.replaceDialog('MENU');
        }
        return stepContext.beginDialog('SHOWBIKES', { bikes: bikes });
    }
    /**
     * Validates 'chooseFilterType' response with entities from LUIS. 
     * And counts the amount of wrong answers from the user, 
     * After three errors, adds "finishDialog" to 'stepContext.recognized.value' signaling to the prompt method that the dialog must be closed
     * @param stepContext 
     * @returns boolean 
     */
    async chooseTypePromptValidator(stepContext) {
        const entitie = await recognizer.getEntities(stepContext.context);
        if (!entitie.type && stepContext.attemptCount < 3) {
            return false;
        } else if (!entitie.type && stepContext.attemptCount == 3) {
            stepContext.recognized.value = 'finishDialog';
            return true;
        }
        stepContext.recognized.value = entitie.type[0][0];
        return true;
    }








}

module.exports.Type = Type;