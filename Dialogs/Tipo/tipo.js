const { WaterfallDialog, ChoicePrompt, ComponentDialog } = require('botbuilder-dialogs');
const { BikeRecognizer } = require('../../Luis/BikeRecognizer');
const recognizer = new BikeRecognizer();
const msg = require('./message');
const isEndDialog = require('../../Helpers/isEndDialog');
const filterBikes = require('../../Helpers/filterBikes');


const TIPO_DIALOG = 'TIPO';
const CHOOSE_FILTER_TYPE = 'CHOOSE_FILTER_TYPE';
class Tipo extends ComponentDialog {
    constructor() {
        super(TIPO_DIALOG);

        this.addDialog(new ChoicePrompt(CHOOSE_FILTER_TYPE, this.chooseTypePromptValidator))
            .addDialog(new WaterfallDialog(TIPO_DIALOG, [
                this.chooseFilterType.bind(this),
                this.beginIntentFilter.bind(this)
            ]));

        this.initialDialogId = TIPO_DIALOG;

    }

    async chooseFilterType(stepContext) {
        await stepContext.context.sendActivity(msg.message);
        return stepContext.prompt(CHOOSE_FILTER_TYPE, msg.chooseType); 
    }

    async beginIntentFilter(stepContext) {
        if (await isEndDialog(stepContext)) {  return stepContext.endDialog(); }
        let bikes = await filterBikes('type', stepContext.result);
        if (!bikes || bikes.length <= 0) {
            await stepContext.context.sendActivity(msg.message);
            return stepContext.replaceDialog('MENU');
        }
        return stepContext.beginDialog('SHOWBIKES', bikes);
    }
    async chooseTypePromptValidator(stepContext){
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

module.exports.Tipo = Tipo;