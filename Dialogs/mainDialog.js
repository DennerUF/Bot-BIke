const { ComponentDialog, DialogSet, DialogTurnStatus, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');

const { BikeRecognizer } = require('../Luis/BikeRecognizer');
const recognizer = new BikeRecognizer();

const {Menu} = require('../Dialogs/Menu/menu');
const menuDialog = new Menu();
const {Tipo} = require('../Dialogs/Tipo/tipo');
const TipoDialog = new Tipo();
const {Default} = require('../Dialogs/Default/default');
const defaultDialog = new Default();

const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';
const TEXT_PROMPT = 'textPrompt';
class MainDialog extends ComponentDialog {
    constructor() {
        super('MainDialog');

        
        this.addDialog(menuDialog)
            .addDialog(TipoDialog)
            .addDialog(defaultDialog)
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

    async startDialog(stepContext){
        const intent = await recognizer.getTopIntent(stepContext);
        if(intent != 'NONE' && stepContext.context._activity.type != 'conversationUpdate'){
            return stepContext.beginDialog(intent);
        }else if(stepContext.state.dialogContext.stack[0].id !== intent && stepContext.context._activity.type == 'conversationUpdate'){
            console.log('entrou verificacao conversationUpdate ')
            return stepContext.beginDialog('MENU');
        }
        return {waiting: 'waiting'};
         
    }
    async finishDialog(stepContext){
      
        return stepContext.endDialog();
    }

    
}

module.exports.MainDialog = MainDialog;
