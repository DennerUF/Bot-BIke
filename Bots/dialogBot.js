const { ActivityHandler } = require('botbuilder');



class DialogBot extends ActivityHandler {
    constructor(conversationState, userState, dialog, luis) {
        super();
        if (!conversationState) throw new Error('[DialogBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[DialogBot]: Missing parameter. userState is required');
        if (!dialog) throw new Error('[DialogBot]: Missing parameter. dialog is required');

        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');
        this.luis = luis;

        this.onMessage(async (context, next) => {
            if (context.activity.type === 'message') {
                context.luisResult = await this.luis.executeLuisQuery(context);
            }
            await this.dialog.run(context, this.dialogState);
            await next();
        });
    }
    async run(context) {
        await super.run(context);
        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);
    }
}

module.exports.DialogBot = DialogBot;

