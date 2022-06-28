const { WaterfallDialog, ChoicePrompt, TextPrompt, ComponentDialog, DialogTurnStatus } = require('botbuilder-dialogs');

const recognizer = require('../../Helpers/getLuis');
const msg = require('./message');
const is = require('../../Helpers/isEndDialog');
const filter = require('../../Helpers/filterBikes');

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
     * First step of the waterfall. Display TextPrompt asking about color to filter
     * @param {TurnContext} stepContext Dialog Context
     * @returns {Promise<TextPrompt>} Ask what color bike
     */
    async chooseFilterColor(stepContext) {
        return stepContext.prompt(TEXTPROMPT,msg.textPrompt);
    }
    /**
     *  Displays Color ChoicePrompt if user didn't answer the first question correctly
     * @param {TurnContext} stepContext Dialog Context
     * @returns {Promise<ChoicePrompt>} color option
     */
    async secondChanceChoicerColor(stepContext) {
        const entitie = await recognizer.getEntities(stepContext.context.luisResult);
        
        if (!entitie || !entitie.color) {
            return stepContext.prompt(CHOOSE_FILTER_COLOR, msg.chooseColor);
        }
        return stepContext.next(entitie.color[0][0]);
    }
    /**
     * Checks if the user has reached the limits of wrong answers, if yes, closes the dialog
     * Calls the 'ShowBike' dialog passing a list of bikes to be displayed
     * @param {TurnContext} stepContext Dialog Context 
     * @returns {Promise<DialogTurnStatus>} start new dialog
     */
    async beginIntentFilter(stepContext) {
        if (await is.isEndDialog(stepContext)) { return stepContext.endDialog(); }
        let bikes = await filter.filterBikes('color', stepContext.result);
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
     * @param {TurnContext} stepContext Dialog Context 
     * @returns boolean
     */
    async chooseColorPromptValidator(stepContext) {
        const entitie = await recognizer.getEntities(stepContext.context.luisResult);
        if (!entitie || (!entitie.color && stepContext.attemptCount < 3)) {
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