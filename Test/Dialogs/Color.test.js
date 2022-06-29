const { DialogTestClient, DialogTestLogger } = require('botbuilder-testing');
const { Color } = require('../../Dialogs/Color/color');
const sinon = require('sinon');
const recognizer = require('../../Helpers/getLuis');
const assert = require('assert');
const msg = require('./../TestData/colorData');
const { ComponentDialog, DialogContext } = require('botbuilder-dialogs');
const bikes = require('./../TestData/bikes');
const isEndDialog = require('../../Helpers/isEndDialog');
const filter = require('../../Helpers/filterBikes');

//, {}, [new DialogTestLogger()]


describe('Teste dialogo Color', () => {
    let sut, stubGetEntities,stubFilter,stubIsEndDialog, client;
    beforeEach(() => {
        sut = new Color();
        client = new DialogTestClient('test', sut);
        
        stubGetEntities = sinon.stub(recognizer, 'getEntities');
        stubFilter = sinon.stub(filter,'filterBikes').returns(bikes);
        stubIsEndDialog = sinon.stub(isEndDialog,'isEndDialog').resolves(false);
    })
    
    afterEach(() => {
        sinon.restore();
    })
    it('Caminho certo - escolhendo "Verde" sem prompt ', async () => {
        stubGetEntities.returns({ color: [['Verde']] });
        
        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, 'Qual a cor que você quer para a sua bicicleta? 🚲');
        
        sinon.stub(ComponentDialog.prototype, 'beginDialog').resolves({ status: 'waiting' });
        reply = await client.sendActivity('Verde');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho certo - escolhendo com prompt "Verde"', async () => {
        stubGetEntities.onCall(0).returns(false);
        stubGetEntities.onCall(1).returns({ color: [['Verde']] })
        
        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, 'Qual a cor que você quer para a sua bicicleta? 🚲');
        
        reply = await client.sendActivity("Qualquercoisa");
        assert.strictEqual(reply.text, msg.promptColor);

        sinon.stub(ComponentDialog.prototype, 'beginDialog').resolves({ status: 'waiting' });
        
        reply = await client.sendActivity('Verde');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho certo - filterBike não devolvendo nada ', async () => {
        stubGetEntities.returns({ color: [['Verde']] });
        stubFilter.returns([]);
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting' });

        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, 'Qual a cor que você quer para a sua bicicleta? 🚲');

        reply = await client.sendActivity('Verde');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho errado - fallback', async () => {
        stubIsEndDialog.resolves(true);
        stubGetEntities.returns({});

        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, 'Qual a cor que você quer para a sua bicicleta? 🚲');

        reply = await client.sendActivity('ProvocaErro');
        assert.strictEqual(reply.text, msg.promptColor);

        reply = await client.sendActivity('ProvocaErro');
        assert.strictEqual(reply.text, msg.repromptColor);

        reply = await client.sendActivity('ProvocaErro');
        assert.strictEqual(reply.text, msg.repromptColor);

        reply = await client.sendActivity('ProvocaErro');

        assert.strictEqual(client.dialogTurnResult.status, 'complete');
    });




})


