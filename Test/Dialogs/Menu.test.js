const { DialogTestClient, DialogTestLogger } = require('botbuilder-testing');
const { Menu } = require('../../Dialogs/Menu/menu');
const sinon = require('sinon');
const assert = require('assert');
const msg = require('./TestData/menuData');
const { BikeRecognizer } = require('../../Luis/BikeRecognizer');
const { DialogBot } = require('../../Bots/dialogBot');
const { ComponentDialog } = require('botbuilder-dialogs');
const recognizer = require('../../Helpers/getLuis')

describe('Menu', () => {
    let sut;
    beforeEach(()=>{
        sut = new Menu();
        
        
    })

    afterEach(()=>{
        sinon.restore();
    })

    it('Caminho certo - escolhendo "Tipo"', async () => {
        const client = new DialogTestClient('test', sut);
        sinon.stub(recognizer,'getEntities').returns({menu:[['Type']]});
        
        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.promptMenu);
        
        reply = await client.sendActivity('Tipo');
        sinon.stub(ComponentDialog.prototype, 'beginDialog').resolves({ status: 'waiting' });
        
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho errado - fallback', async () => {
        const client = new DialogTestClient('test', sut);
        sinon.stub(recognizer, 'getEntities').returns({})

        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.promptMenu);

        reply = await client.sendActivity('ProvocaErro');
        assert.strictEqual(reply.text, msg.reprompt);

        reply = await client.sendActivity('ProvocaErro');
        assert.strictEqual(reply.text, msg.reprompt);

        reply = await client.sendActivity('ProvocaErro');
        assert.strictEqual(reply.text, 'Sinto muito,ainda estou aprendendo e no momento não consigo entender o que você deseja. Mas podemos tentar conversar novamente mais tarde!');

        assert.strictEqual(client.dialogTurnResult.status, 'complete');
    });


})


