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
    let sut;
    beforeEach(()=>{
        sut = new Price();
        
    })

    afterEach(()=>{
        sinon.restore();
    })
    it('Caminho certo - escolhendo "Até R$ 500,00"', async () => {
        const client = new DialogTestClient('test', sut);
        sinon.stub(filter,'filterBikes').returns(bikes);
        sinon.stub(isEndDialog,'isEndDialog').resolves(false);

        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.promptPrice);

        sinon.stub(recognizer,'getEntities').resolves({price:[{priceMax:['500']}]});
        sinon.stub(ComponentDialog.prototype, 'beginDialog').resolves({ status: 'waiting' });
        reply = await client.sendActivity('Até R$ 500,00');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });
    it('Caminho certo - escolhendo "De R$ 1500,00 até R$ 3000,00"', async () => {
        const client = new DialogTestClient('test', sut);
        sinon.stub(filter,'filterBikes').returns(bikes);
        sinon.stub(isEndDialog,'isEndDialog').resolves(false); 
        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.promptPrice);

        sinon.stub(recognizer,'getEntities').resolves({price:[{priceMin:['1500']},{priceMax:['3000']}]});
        sinon.stub(ComponentDialog.prototype, 'beginDialog').resolves({ status: 'waiting' });
        reply = await client.sendActivity('De R$ 1500,00 até R$ 3000,00');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho certo - filterBike não devolvendo nada ', async () => {
        const client = new DialogTestClient('test', sut);

        sinon.restore();
        sinon.stub(recognizer, 'getEntities').returns({price:[{priceMax:['500']}]});
        sinon.stub(filter,'filterBikes').returns([]);
        sinon.stub(isEndDialog,'isEndDialog').resolves(false);
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting' });
        let reply = await client.sendActivity('Preco');
        assert.strictEqual(reply.text, msg.promptPrice);

        reply = await client.sendActivity('Até R$ 500,00');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho certo - Ativando menu com opcao "Outro filtro" ', async () => {
        const client = new DialogTestClient('test', sut);
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting' });
        sinon.stub(recognizer, 'getEntities').returns({anotherFilter:{}});
        sinon.stub(filter,'filterBikes').returns(bikes);
        sinon.stub(isEndDialog,'isEndDialog').resolves(false);

        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.promptPrice);

        reply = await client.sendActivity('Outro Filtro');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });
    it('Caminho errado - entitie == falsa', async () => {
        const client = new DialogTestClient('test', sut);
        sinon.stub(recognizer, 'getEntities').returns(false);
        sinon.stub(isEndDialog,'isEndDialog').resolves(true);
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
        const client = new DialogTestClient('test', sut);
        sinon.stub(recognizer, 'getEntities').returns({});
        sinon.stub(isEndDialog,'isEndDialog').resolves(true);
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


