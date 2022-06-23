const { WaterfallDialog, ChoicePrompt, ComponentDialog } = require('botbuilder-dialogs');
const { BikeRecognizer } = require('../../Luis/BikeRecognizer');
const recognizer = new BikeRecognizer();
const msg = require('./message');
const isEndDialog = require('../../Helpers/isEndDialog');
const filterBikes = require('../../Helpers/filterBikes');

const { ShowBikes } = require('../ShowBikes/showBikes');
const showBikes = new ShowBikes();


const GENDER_DIALOG = 'GENDER';
const CHOOSE_FILTER_GENDER = 'CHOOSE_FILTER_GENDER';
class Gender extends ComponentDialog {
    constructor() {
        super(GENDER_DIALOG);

        this.addDialog(new ChoicePrompt(CHOOSE_FILTER_GENDER, this.chooseGenderPromptValidator))
            .addDialog(showBikes)
            .addDialog(new WaterfallDialog(GENDER_DIALOG, [
                this.chooseFilterGender.bind(this),
                this.beginIntentFilter.bind(this)
            ]));

        this.initialDialogId = GENDER_DIALOG;
    }
    /**
     * First step of the waterfall. Display ChoicePrompt filter types
     * @param stepContext Dialog Context
     * @returns ChoicePrompt filter types
     */
    async chooseFilterGender(stepContext) {
        return stepContext.prompt(CHOOSE_FILTER_GENDER, msg.chooseGender);
    }
    /**
     * Checks if the user has reached the limits of wrong answers, if yes, closes the dialog
     * Calls the 'ShowBike' dialog passing a list of bikes to be displayed
     * @param stepContext 
     * @returns 
     */
    async beginIntentFilter(stepContext) {
        if (await isEndDialog(stepContext)) { return stepContext.endDialog(); }
        if (stepContext.result == 'menuDialog') { return stepContext.replaceDialog('MENU'); }
        let bikes = await filterBikes('gender', stepContext.result);
        if (!bikes || bikes.length <= 0) {
            await stepContext.context.sendActivity(msg.messageError);
            return stepContext.replaceDialog('MENU');
        }
        return stepContext.beginDialog('SHOWBIKES', { bikes: bikes });
    }
    /**
     * Validates 'chooseFilterGender' response with entities from LUIS. 
     * And counts the amount of wrong answers from the user, 
     * After three errors, adds "finishDialog" to 'stepContext.recognized.value' signaling to the prompt method that the dialog must be closed
     * @param stepContext 
     * @returns boolean 
     */
    async chooseGenderPromptValidator(stepContext) {
        const entitie = await recognizer.getEntities(stepContext.context);
        if(entitie.anotherFilter){
            stepContext.recognized.value = 'menuDialog';
            return true;
        }else if (!entitie.gender && stepContext.attemptCount < 3) {
            return false;
        } else if (!entitie.gender && stepContext.attemptCount == 3) {
            stepContext.recognized.value = 'finishDialog';
            return true;
        }
        stepContext.recognized.value = entitie.gender[0][0];
        return true;
    }








}

module.exports.Gender = Gender;