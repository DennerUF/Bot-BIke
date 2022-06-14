const { WaterfallDialog, ChoicePrompt, ComponentDialog } = require('botbuilder-dialogs');
const { BikeRecognizer } = require('../../Luis/BikeRecognizer');
const filterBikes = require('./filterBikes');


const recognizer = new BikeRecognizer();
//const msg = require('./message');

const SHOWBIKES_DIALOG = 'SHOWBIKES';
class ShowBikes extends ComponentDialog {
    constructor() {
        super(SHOWBIKES_DIALOG);


            this.addDialog(new WaterfallDialog(SHOWBIKES_DIALOG, [
                this.showBike.bind(this),
            ]));

        this.initialDialogId = SHOWBIKES_DIALOG;

    }

    async showBike(stepContext) {
        let bikes = await filterBikes(stepContext.options.filter,stepContext.options.value);
        
        return '';
    }

    





}

module.exports.ShowBikes = ShowBikes;