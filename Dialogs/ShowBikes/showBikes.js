const { WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');
const { BikeRecognizer } = require('../../Luis/BikeRecognizer');
const cardMaker = require('../../Helpers/cardMaker');

const recognizer = new BikeRecognizer();


const msg = require('./message');

const SHOWBIKES_DIALOG = 'SHOWBIKES';
class ShowBikes extends ComponentDialog {
    constructor() {
        super(SHOWBIKES_DIALOG);
        this.addDialog(new WaterfallDialog(SHOWBIKES_DIALOG, [
                this.showBike.bind(this),
                this.nextAction.bind(this),
            ]));

        this.initialDialogId = SHOWBIKES_DIALOG;

    }
    /**
     * First waterfall step
     * Shows the bike card with the chosen characteristics
     * @param stepContext 
     * @returns 
     */
    async showBike(stepContext) {
        stepContext.values.bikes = stepContext.options;
        const bike = stepContext.options[0];
        await stepContext.context.sendActivity({ attachments: [cardMaker(bike)] });
        return { status: 'waiting' }
    }
    /**
     * It uses Luis intents and entities to interpret the user's response and know what to do next. 
     * If want to know more information about the bike. 
     * Or if want to see another bike with the same characteristics. 
     * Or if want to perform another search with new filters. 
     * Also checks if the number of cards has reached the end
     * @param stepContext 
     * @returns 
     */
    async nextAction(stepContext) {
        const entitie = await recognizer.getEntities(stepContext.context);
        const intent = await recognizer.getTopIntent(stepContext);
        const bikes = stepContext.values.bikes;
        if (intent == 'MENU') {
            return stepContext.replaceDialog('MENU');
        } else if (entitie.informacao) {
            await stepContext.context.sendActivity(bikes[0].description);
            return stepContext.next();
        } else if (bikes.length > 1) {
            stepContext.values.bikes.shift();
            return stepContext.replaceDialog(SHOWBIKES_DIALOG, stepContext.values.bikes);
        }
        await stepContext.context.sendActivity(msg.message);
        return stepContext.replaceDialog('MENU');

    }


}

module.exports.ShowBikes = ShowBikes;