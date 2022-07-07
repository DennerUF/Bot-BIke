const { ComponentDialog, DialogSet, DialogTurnStatus, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');


const recognizer = require('../Helpers/getLuis');

const { Menu } = require('../Dialogs/Menu/menu');
const menuDialog = new Menu();
const { ShowBikes } = require('../Dialogs/ShowBikes/showBikes');
const showBikes = new ShowBikes();


const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';

class MainDialog extends ComponentDialog {
    constructor() {
        super('MainDialog');


        this.addDialog(menuDialog)
            .addDialog(showBikes)
            .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
                this.startDialog.bind(this),
                this.finishDialog.bind(this)
            ]));

        this.initialDialogId = MAIN_WATERFALL_DIALOG;
    }

    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();


        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }
    /**
     * start new dialog or continue active
     * @param {TurnContext} stepContext Dialog Context
     * @returns {Promise<DialogTurnStatus>} DialogTurnStatus
     */
    async startDialog(stepContext) {

        if(stepContext.context.luisResult){
            const intent = recognizer.getTopIntent(stepContext.context.luisResult);
            if (!intent) {
                await stepContext.context.sendActivity('Encontramos um erro. Tente novamente');
                return stepContext.endDialog();
            }else if(intent != 'NONE'){
                return stepContext.beginDialog(intent);
            }else{
                return stepContext.continueDialog();
            }
        }
        return stepContext.beginDialog('MENU');
        

    }
    /**
     * End dialog
     * @param {TurnContext} stepContext 
     * @returns {Promise<DialogTurnStatus>} DialogTurnStatus
     */
    async finishDialog(stepContext) {
        return stepContext.endDialog();
    }


}

module.exports.MainDialog = MainDialog;
