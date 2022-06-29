const { DialogBot } = require('../../Bots/dialogBot');
const { ConversationState, MemoryStorage, UserState } = require('botbuilder');
const assert = require('assert');


const sinon = require('sinon');

describe('Teste DialogBot', () => {

    // it('Caminho Certo', async () => {
    //     sinon.stub(BikeRecognizer.prototype, 'executeLuisQuery').resolves({ luisResult: {} })
    //     const dialog = {};
    //     const memoryStorage = new MemoryStorage();
    //     const sut = new DialogBot(new ConversationState(memoryStorage), new UserState(memoryStorage), dialog, console);
    //     assert.deepStrictEqual(sut.onMessage({ activity: { type: 'message' } }), dataTest.onMessage)

    // });
    it('Caminho errado - Nenhum parametro classe DialogBot ', async () => {
        assert.throws(() => {
            new DialogBot();
        })

    });
    it('Caminho errado - Apenas conversationState como parametro na classe DialogBot ', async () => {
        const memoryStorage = new MemoryStorage();
        assert.throws(() => {
            new DialogBot(new ConversationState(memoryStorage));
        })
    });
    it('Caminho errado - Apenas conversationState e userState como parametro na classe DialogBot ', async () => {
        const memoryStorage = new MemoryStorage();
        assert.throws(() => {
            new DialogBot(new ConversationState(memoryStorage),new UserState(memoryStorage));
        })
    });
    



})