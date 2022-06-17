const { TestAdapter, ActivityTypes, TurnContext, ConversationState, MemoryStorage, UserState } = require('botbuilder');
const { DialogSet, DialogTurnStatus, Dialog } = require('botbuilder-dialogs');
const { WelcomeBot } = require('../../Bots/welcomeBot');
const assert = require('assert');

class MockRootDialog extends Dialog {
    constructor() {
        super('mockRootDialog');
    }

    async beginDialog(dc, options) {
        await dc.context.sendActivity(`${this.id} mock invoked`);
        return await dc.endDialog();
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
}

describe('WelcomeBot', () => {
    const testAdapter = new TestAdapter();

    async function processActivity(activity, bot) {
        const context = new TurnContext(testAdapter, activity);
        await bot.run(context);
    }

    it('Shows welcome and starts main dialog', async () => {
        const mockRootDialog = new MockRootDialog();
        const memoryStorage = new MemoryStorage();
        const sut = new WelcomeBot(new ConversationState(memoryStorage), new UserState(memoryStorage), mockRootDialog, console);

        // Create conversationUpdate activity
        const conversationUpdateActivity = {
            type: ActivityTypes.ConversationUpdate,
            channelId: 'test',
            conversation: {
                id: 'someId'
            },
            membersAdded: [
                { id: 'theUser' }
            ],
            recipient: { id: 'theBot' }
        };

        // Send the conversation update activity to the bot.
        await processActivity(conversationUpdateActivity, sut);

        // Assert that we started the main dialog.
        reply = testAdapter.activityBuffer.shift();
        assert.strictEqual(reply.text, `Oi! Eu sou o Bici JR,sou craque em
                    pedaladas e vou funcionar como um guidão
                    para te guiar na sua busca!`);
    });
});