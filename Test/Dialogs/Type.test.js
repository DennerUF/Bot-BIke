const { DialogTestClient, DialogTestLogger } = require('botbuilder-testing');
const { Type } = require('../../Dialogs/Type/type');
const assert = require('assert');
const msg = require('./../TestData/typeData');
const sinon = require('sinon');
const SearchBike = require('../../Helpers/searchBikes');
const recognizer = require('../../Helpers/getLuis');
const bikes = require('./../TestData/bikes');
const isEndDialog = require('../../Helpers/isEndDialog');
const filter = require('../../Helpers/filterBikes');
const { ComponentDialog, DialogContext } = require('botbuilder-dialogs');

describe('Teste dialogo Type', () => {
    let stubGetEntities, stubFilter, stubIsEndDialog, client;
    beforeEach(() => {
        const sut = new Type();
        client = new DialogTestClient('test', sut);

        stubGetEntities = sinon.stub(recognizer, 'getEntities');
        stubFilter = sinon.stub(filter, 'filterBikes').returns(bikes);
        stubIsEndDialog = sinon.stub(isEndDialog, 'isEndDialog').resolves(false);

    })

    afterEach(() => {
        sinon.restore();
    })
    it('Caminho certo - escolhendo "Infantil"', async () => {
        stubGetEntities.returns({ type: [['Infantil']] });

        let reply = await client.sendActivity('tipo');
        assert.strictEqual(reply.text, 'Boa Escolha! Vem comigo para selecionar a sua magrela🚲');
        sinon.stub(ComponentDialog.prototype, 'beginDialog').resolves({ status: 'waiting' });

        reply = await client.sendActivity('Infantil');
        assert.strictEqual(reply.text, msg.promptType);

        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho certo - filterBike não devolvendo nada ', async () => {
        stubGetEntities.returns({ type: [['Infantil']] });
        stubFilter.returns([]);

        let reply = await client.sendActivity('tipo');
        assert.strictEqual(reply.text, 'Boa Escolha! Vem comigo para selecionar a sua magrela🚲');

        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting' });

        reply = await client.sendActivity('Infantil');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho certo - Ativando menu com opcao "Outro filtro" ', async () => {
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting' });
        stubGetEntities.returns({ anotherFilter: {} });

        let reply = await client.sendActivity('tipo');
        assert.strictEqual(reply.text, 'Boa Escolha! Vem comigo para selecionar a sua magrela🚲');

        reply = await client.sendActivity('Outro Filtro');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho errado - entitie == falsa', async () => {
        stubGetEntities.returns(false);
        stubIsEndDialog.resolves(true);

        let reply = await client.sendActivity('tipo');
        assert.strictEqual(reply.text, 'Boa Escolha! Vem comigo para selecionar a sua magrela🚲');

        reply = client.getNextReply();
        assert.strictEqual(reply.text, msg.promptType);

        reply = await client.sendActivity('ProvocarErro');
        assert.strictEqual(reply.text, msg.repromptType);

        reply = await client.sendActivity('ProvocarErro');
        assert.strictEqual(reply.text, msg.repromptType);

        reply = await client.sendActivity('ProvocarErro');

        assert.strictEqual(client.dialogTurnResult.status, 'complete');
    })

    it('Caminho errado - fallback', async () => {
        stubGetEntities.returns({});
        stubIsEndDialog.resolves(true);
        
        let reply = await client.sendActivity('tipo');
        assert.strictEqual(reply.text, 'Boa Escolha! Vem comigo para selecionar a sua magrela🚲');

        reply = client.getNextReply();
        assert.strictEqual(reply.text, msg.promptType);

        reply = await client.sendActivity('ProvocarErro');
        assert.strictEqual(reply.text, msg.repromptType);

        reply = await client.sendActivity('ProvocarErro');
        assert.strictEqual(reply.text, msg.repromptType);

        reply = await client.sendActivity('ProvocarErro');

        assert.strictEqual(client.dialogTurnResult.status, 'complete');
    });



})


