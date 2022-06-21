const { WaterfallDialog, ChoicePrompt, TextPrompt, ComponentDialog } = require('botbuilder-dialogs');
const { BikeRecognizer } = require('../../Luis/BikeRecognizer');
const recognizer = new BikeRecognizer();
const msg = require('./message');
const isEndDialog = require('../../Helpers/isEndDialog');
const filterBikes = require('../../Helpers/filterBikes');

const { ShowBikes } = require('../ShowBikes/showBikes');
const showBikes = new ShowBikes();


const COLOR_DIALOG = 'COLOR';
const CHOOSE_FILTER_COLOR = 'CHOOSE_FILTER_COLOR';
const TEXTPROMPT = 'TEXTPROMPT';
class Color extends ComponentDialog {
    constructor() {
        super(COLOR_DIALOG);

        this.addDialog(new ChoicePrompt(CHOOSE_FILTER_COLOR, this.chooseColorPromptValidator))
            .addDialog(new TextPrompt(TEXTPROMPT))
            .addDialog(showBikes)
            .addDialog(new WaterfallDialog(COLOR_DIALOG, [
                this.chooseFilterColor.bind(this),
                this.secondChanceChoicerColor.bind(this),
                this.beginIntentFilter.bind(this)
            ]));

        this.initialDialogId = COLOR_DIALOG;
    }
    /**
     * 
     * @param stepContext Dialog Context
     * @returns ChoicePrompt filter types
     */
    async chooseFilterColor(stepContext) {
        return stepContext.prompt(TEXTPROMPT,msg.textPrompt);
    }
    /**
     *
     * @param stepContext Dialog Context
     * @returns ChoicePrompt filter colors
     */
    async secondChanceChoicerColor(stepContext) {
        const entitie = await recognizer.getEntities(stepContext.context);
        if (!entitie.color) {
            return stepContext.prompt(CHOOSE_FILTER_COLOR, msg.chooseColor);
        }
        return stepContext.next(entitie.color[0][0]);
    }
    /**
     * 
     * @param stepContext 
     * @returns 
     */
    async beginIntentFilter(stepContext) {
        console.log('stepContext.result')
        console.log(stepContext.result)
        if (await isEndDialog(stepContext)) { return stepContext.endDialog(); }
        let bikes = await filterBikes('color', stepContext.result);
        if (!bikes || bikes.length <= 0) {
            await stepContext.context.sendActivity(msg.messageError);
            return stepContext.replaceDialog('MENU');
        }
        return stepContext.beginDialog('SHOWBIKES', { bikes: bikes });
    }
    /**
     * Validates 'secondChanceChoicerColor' response with entities from LUIS. 
     * And counts the amount of wrong answers from the user, 
     * After three errors, adds "finishDialog" to 'stepContext.recognized.value' signaling to the prompt method that the dialog must be closed
     * @param stepContext 
     * @returns boolean 
     */
    async chooseColorPromptValidator(stepContext) {
        const entitie = await recognizer.getEntities(stepContext.context);
        if (!entitie.color && stepContext.attemptCount < 3) {
            return false;
        } else if (!entitie.color && stepContext.attemptCount == 3) {
            stepContext.recognized.value = 'finishDialog';
            return true;
        }
        stepContext.recognized.value = entitie.color[0][0];
        return true;
    }








}

module.exports.Color = Color;