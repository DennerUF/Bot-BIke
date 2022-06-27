const { DialogTestClient, DialogTestLogger } = require('botbuilder-testing');
const { Price } = require('../../Dialogs/Price/price');
const sinon = require('sinon');
const recognizer = require('../../Helpers/getLuis');
const msg = require('./TestData/PriceData');
const { ComponentDialog, DialogContext } = require('botbuilder-dialogs');
const bikes = require('./TestData/bikes');
const filterBikes = require('../../Helpers/filterBikes');

const assert = require('assert');
const SearchBike = require('../../Helpers/searchBikes');



describe('Teste dialogo Gender', () => {
    let sut;
    beforeEach(()=>{
        sut = new Price();
        sinon.stub(SearchBike.prototype,'search').resolves(bikes);
        
    })

    afterEach(()=>{
        sinon.restore();
    })
    it('Caminho certo - escolhendo "Até R$ 500,00"', async () => {
        const client = new DialogTestClient('test', sut);

        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.promptPrice);

        sinon.stub(recognizer,'getEntities').resolves({price:[{priceMax:['500']}]});
        reply = await client.sendActivity('Até R$ 500,00');
        sinon.stub(ComponentDialog.prototype, 'beginDialog').resolves({ status: 'waiting' });
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });
    it('Caminho certo - escolhendo "De R$ 1500,00 até R$ 3000,00"', async () => {
        const client = new DialogTestClient('test', sut);

        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.promptPrice);

        sinon.stub(recognizer,'getEntities').resolves({price:[{priceMin:['1500']},{priceMax:['3000']}]});
        reply = await client.sendActivity('De R$ 1500,00 até R$ 3000,00');
        sinon.stub(ComponentDialog.prototype, 'beginDialog').resolves({ status: 'waiting' });
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho certo - filterBike não devolvendo nada ', async () => {
        const client = new DialogTestClient('test', sut);

        sinon.restore();
        sinon.stub(recognizer, 'getEntities').returns({price:[{priceMax:['500']}]});
        sinon.stub(SearchBike.prototype,'search').resolves([]);
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

        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.promptPrice);

        reply = await client.sendActivity('Outro Filtro');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho errado - fallback', async () => {
        const client = new DialogTestClient('test', sut);
        sinon.stub(recognizer, 'getEntities').returns({});
        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.promptPrice);

        reply = await client.sendActivity('ProvocaErro');
        assert.strictEqual(reply.text, msg.repromptPrice);

        reply = await client.sendActivity('ProvocaErro');
        assert.strictEqual(reply.text, msg.repromptPrice);

        reply = await client.sendActivity('ProvocaErro');
        assert.strictEqual(reply.text, 'Sinto muito,ainda estou aprendendo e no momento não consigo entender o que você deseja. Mas podemos tentar conversar novamente mais tarde!');

        assert.strictEqual(client.dialogTurnResult.status, 'complete');
    });




})


