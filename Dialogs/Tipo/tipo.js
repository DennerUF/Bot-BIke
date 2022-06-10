const { WaterfallDialog, ChoicePrompt, ComponentDialog } = require('botbuilder-dialogs');
const { BikeRecognizer } = require('../../Luis/BikeRecognizer');
const recognizer = new BikeRecognizer();
const msg = require('./message');

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
        const entitie = await recognizer.getEntities(stepContext.context);
        return stepContext.beginDialog('DEFAULT', { filter:TIPO_DIALOG, data: entitie.type[0][0]});
    }
    async chooseTypePromptValidator(stepContext){
        return true;
    }






}

module.exports.Tipo = Tipo;