const { WaterfallDialog, ChoicePrompt, ComponentDialog } = require('botbuilder-dialogs');
const { BikeRecognizer } = require('../../Luis/BikeRecognizer');
const recognizer = new BikeRecognizer();
const msg = require('./message');
const isEndDialog = require('../../Helpers/isEndDialog');

const { Type } = require('../Type/type');
const TypeDialog = new Type();
const { Color } = require('../Color/color');
const ColorDialog = new Color();
const { Gender } = require('../Gender/gender');
const GenderDialog = new Gender();
const { Price } = require('../Price/price');
const PriceDialog = new Price();


const MENU_DIALOG = 'MENU';
const CHOOSE_FILTER = 'CHOOSE_FILTER';
class Menu extends ComponentDialog {
    constructor() {
        super('MENU');

        this.addDialog(new ChoicePrompt(CHOOSE_FILTER, this.choosePromptValidator))
            .addDialog(TypeDialog)
            .addDialog(ColorDialog)
            .addDialog(GenderDialog)
            .addDialog(PriceDialog)
            .addDialog(new WaterfallDialog(MENU_DIALOG, [
                this.chooseFilter.bind(this),
                this.beginIntentFilter.bind(this)
            ]));

        this.initialDialogId = MENU_DIALOG;

    }
    /**
     * First step of the waterfall. Display ChoicePrompt filter categories
     * @param {TurnContext} stepContext Dialog Context
     * @returns {Promise<ChoicePrompt>} filter categories
     */
    async chooseFilter(stepContext) {
        return stepContext.prompt(CHOOSE_FILTER, msg.choose);
    }
    /**
     * Second waterfall step. Starts dialog of the chosen category
     * @param {TurnContext} stepContext Dialog Context 
     * @return {Promise<DialogTurnStatus>} start new dialog
     */
    async beginIntentFilter(stepContext) {
        if (await isEndDialog(stepContext)) { return stepContext.endDialog(); }
        return stepContext.beginDialog(stepContext.result.toUpperCase());
    }
    /**
     * Validates 'chooseFilter' response with entities from LUIS. 
     * And counts the amount of wrong answers from the user, 
     * After three errors, adds "finishDialog" to 'stepContext.recognized.value' signaling to the prompt method that the dialog must be closed
     * @param {TurnContext} stepContext Dialog Context 
     * @returns boolean 
     */
    async choosePromptValidator(stepContext) {
        const entitie = await recognizer.getEntities(stepContext.context);
        if (!entitie.menu && stepContext.attemptCount < 3) {
            return false;
        } else if (!entitie.menu && stepContext.attemptCount == 3) {
            stepContext.recognized.value = 'finishDialog';
            return true;
        }
        stepContext.recognized.value = entitie.menu[0][0];
        return true;
    }







}

module.exports.Menu = Menu;