const { DialogTestClient, DialogTestLogger } = require('botbuilder-testing');
const { Price } = require('../../Dialogs/Price/price');
const sinon = require('sinon');
const recognizer = require('../../Helpers/getLuis');
const msg = require('./../TestData/PriceData');
const { ComponentDialog, DialogContext } = require('botbuilder-dialogs');
const bikes = require('./../TestData/bikes');
const isEndDialog = require('../../Helpers/isEndDialog');
const filter = require('../../Helpers/filterBikes');
const assert = require('assert');




describe('Teste dialogo Price', () => {
    let stubGetEntities, stubFilter, stubIsEndDialog, client;
    beforeEach(() => {
        const sut = new Price();
        client = new DialogTestClient('test', sut);

        stubGetEntities = sinon.stub(recognizer, 'getEntities');
        stubFilter = sinon.stub(filter, 'filterBikes').returns(bikes);
        stubIsEndDialog = sinon.stub(isEndDialog, 'isEndDialog').resolves(false);

    })

    afterEach(() => {
        sinon.restore();
    })
    it('Caminho certo - escolhendo "Até R$ 500,00"', async () => {
        stubGetEntities.returns({ price: [{ priceMax: ['500'] }] });

        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.promptPrice);

        sinon.stub(ComponentDialog.prototype, 'beginDialog').resolves({ status: 'waiting' });
        reply = await client.sendActivity('Até R$ 500,00');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });
    it('Caminho certo - escolhendo "De R$ 1500,00 até R$ 3000,00"', async () => {
        stubGetEntities.resolves({ price: [{ priceMin: ['1500'] }, { priceMax: ['3000'] }] });

        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.promptPrice);

        sinon.stub(ComponentDialog.prototype, 'beginDialog').resolves({ status: 'waiting' });
        reply = await client.sendActivity('De R$ 1500,00 até R$ 3000,00');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho certo - filterBike não devolvendo nada ', async () => {
        stubGetEntities.returns({ price: [{ priceMax: ['500'] }] });
        stubFilter.returns([]);
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting' });

        let reply = await client.sendActivity('Preco');
        assert.strictEqual(reply.text, msg.promptPrice);

        reply = await client.sendActivity('Até R$ 500,00');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho certo - Ativando menu com opcao "Outro filtro" ', async () => {
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting' });
        stubGetEntities.returns({ anotherFilter: {} });

        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.promptPrice);

        reply = await client.sendActivity('Outro Filtro');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });
    it('Caminho errado - entitie == falsa', async () => {
        stubGetEntities.returns(false);
        stubIsEndDialog.resolves(true);

        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.promptPrice);

        reply = await client.sendActivity('ProvocaErro');
        assert.strictEqual(reply.text, msg.repromptPrice);

        reply = await client.sendActivity('ProvocaErro');
        assert.strictEqual(reply.text, msg.repromptPrice);

        reply = await client.sendActivity('ProvocaErro');

        assert.strictEqual(client.dialogTurnResult.status, 'complete');
    })


    it('Caminho errado - fallback', async () => {

        stubGetEntities.returns({});
        stubIsEndDialog.resolves(true);
        
        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.promptPrice);

        reply = await client.sendActivity('ProvocaErro');
        assert.strictEqual(reply.text, msg.repromptPrice);

        reply = await client.sendActivity('ProvocaErro');
        assert.strictEqual(reply.text, msg.repromptPrice);

        reply = await client.sendActivity('ProvocaErro');

        assert.strictEqual(client.dialogTurnResult.status, 'complete');
    });




})


