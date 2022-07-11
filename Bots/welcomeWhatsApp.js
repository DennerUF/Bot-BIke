const { DialogBot } = require('./dialogBot');

class WhatsAppWelcomeBot extends DialogBot {
    constructor(conversationState, userState, dialog,luis) {
        super(conversationState, userState, dialog, luis);
        this.userState = userState;
        this.welcome(async (context, next) => {
           this.userState.nameSpace= req.body.ProfileName;

                if (!this.userState.storage[`${this.userState.nameSpace}`]) {
                    await context.sendActivity(`Oi! Eu sou o Bici JR,sou craque em
                    pedaladas e vou funcionar como um guidão
                    para te guiar na sua busca!`);
                    this.userState.storage[`${this.userState.nameSpace}`] = {
                        authenticated:null,
                        iteration:0
                    }
                    await dialog.run(context, conversationState.createProperty('DialogState'));
                }
            
            await next();
        });
    }
}

module.exports = WhatsAppWelcomeBot;