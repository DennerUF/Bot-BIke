const { DialogTestClient, DialogTestLogger } = require('botbuilder-testing');
const { Menu } = require('../../Dialogs/Menu/menu');
const sinon = require('sinon');
const assert = require('assert');
const msg = require('./../TestData/menuData');
const { ComponentDialog } = require('botbuilder-dialogs');
const recognizer = require('../../Helpers/getLuis');
const isEndDialog = require('../../Helpers/isEndDialog');

describe('Menu', () => {
    let stubGetEntities, stubIsEndDialog, client;
    beforeEach(() => {
        const sut = new Menu();
        client = new DialogTestClient('test', sut);

        stubGetEntities = sinon.stub(recognizer, 'getEntities');
        stubIsEndDialog = sinon.stub(isEndDialog, 'isEndDialog').resolves(false);


    })

    afterEach(() => {
        sinon.restore();
    })

    it('Caminho certo - escolhendo "Tipo"', async () => {
        stubGetEntities.returns({ menu: [['Type']] });

        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.promptMenu);

        reply = await client.sendActivity('Tipo');
        sinon.stub(ComponentDialog.prototype, 'beginDialog').resolves({ status: 'waiting' });

        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho errado - fallback', async () => {
        stubIsEndDialog.resolves(true);
        stubGetEntities.returns({})

        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.promptMenu);

        reply = await client.sendActivity('ProvocaErro');
        assert.strictEqual(reply.text, msg.reprompt);

        reply = await client.sendActivity('ProvocaErro');
        assert.strictEqual(reply.text, msg.reprompt);

        reply = await client.sendActivity('ProvocaErro');

        assert.strictEqual(client.dialogTurnResult.status, 'complete');
    });


})


