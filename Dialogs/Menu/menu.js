const { WaterfallDialog, TextPrompt, ComponentDialog } = require('botbuilder-dialogs');
const { BikeRecognizer } = require('../../Luis/BikeRecognizer');
const recognizer = new BikeRecognizer();
const msg = require('./message');

const MENU_DIALOG = 'MENU';
const CHOOSE_FILTER = 'choose filter'
class Menu extends ComponentDialog {
    constructor() {
        super('MENU');

        this.addDialog(new TextPrompt(CHOOSE_FILTER, this.choosePromptValidator))
            .addDialog(new WaterfallDialog(MENU_DIALOG, [
                this.chooseFilter.bind(this),
                this.beginIntentFilter.bind(this)
            ]));

        this.initialDialogId = MENU_DIALOG;

    }

    async chooseFilter(stepContext) {
        return stepContext.prompt(CHOOSE_FILTER, { prompt: msg.choose });
    }

    async beginIntentFilter(stepContext) {
        const entitie = await recognizer.getEntities(stepContext.context);
        return  stepContext.context.sendActivity(entitie.menu[0][0]);
    }
    async choosePromptValidator(stepContext){
        return true;
    }






}

module.exports.Menu = Menu;