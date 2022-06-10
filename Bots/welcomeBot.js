const { DialogBot } = require('./dialogBot');

class WelcomeBot extends DialogBot {
    constructor(conversationState, userState, dialog) {
        super(conversationState, userState, dialog);

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(`Oi! Eu sou o Bici JR,sou craque em
                    pedaladas e vou funcionar como um guidão
                    para te guiar na sua busca!`);
                    await dialog.run(context, conversationState.createProperty('DialogState'));
                }
            }

            await next();
        });
    }
}

module.exports.WelcomeBot = WelcomeBot;