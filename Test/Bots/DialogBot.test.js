const { DialogBot } = require('../../Bots/dialogBot');
const { ConversationState, MemoryStorage, UserState } = require('botbuilder');
const assert = require('assert');


const sinon = require('sinon');
let memoryStorage = new MemoryStorage();

beforeEach(() => {
    memoryStorage = new MemoryStorage();

})

describe('Teste DialogBot', () => {


    it('Caminho errado - Nenhum parametro classe DialogBot ', async () => {
        assert.throws(() => {
            new DialogBot();
        })

    });
    it('Caminho errado - Apenas conversationState como parametro na classe DialogBot ', async () => {

        assert.throws(() => {
            new DialogBot(new ConversationState(memoryStorage));
        })
    });
    it('Caminho errado - Apenas conversationState e userState como parametro na classe DialogBot ', async () => {

        assert.throws(() => {
            new DialogBot(new ConversationState(memoryStorage), new UserState(memoryStorage));
        })
    });




})