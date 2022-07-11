const { DialogBot } = require('./dialogBot');

class WhatsAppWelcomeBot extends DialogBot {
    constructor(conversationState, userState, dialog, luis, profileName) {
        super(conversationState, userState, dialog, luis);
        this.userState = userState;
        this.userState.nameSpace = profileName; 

            if (!this.userState.storage[`${this.userState.nameSpace}`]) {
                this.welcome(context);
                this.userState.storage[`${this.userState.nameSpace}`] = {
                    authenticated: null,
                    iteration: 0
                }
                await dialog.run(context, conversationState.createProperty('DialogState'));
            }

            await this.next();
        };
        async welcome(context){
        return context.sendActivity(`Oi! Eu sou o Bici JR,sou craque em
                        pedaladas e vou funcionar como um guidão
                        para te guiar na sua busca!`);
        }
    }

module.exports = WhatsAppWelcomeBot;