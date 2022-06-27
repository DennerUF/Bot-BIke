const { DialogTestClient, DialogTestLogger } = require('botbuilder-testing');
const { Color } = require('../../Dialogs/Color/color');
const sinon = require('sinon');
const recognizer = require('../../Helpers/getLuis');
const assert = require('assert');
const msg = require('./TestData/colorData');
const { ComponentDialog, DialogContext } = require('botbuilder-dialogs');
const bikes = require('./TestData/bikes');
const SearchBike = require('../../Helpers/searchBikes');
//, {}, [new DialogTestLogger()]



describe('Teste dialogo Color', () => {
    let sut;
    beforeEach(() => {
        sut = new Color();
        sinon.stub(SearchBike.prototype,'search').resolves(bikes);


    })

    afterEach(() => {
        sinon.restore();
    })
    it('Caminho certo - escolhendo "Verde" sem prompt ', async () => {
        const client = new DialogTestClient('test', sut);

        sinon.stub(recognizer, 'getEntities').returns({ color: [['Verde']] })
        
        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, 'Qual a cor que você quer para a sua bicicleta? 🚲');

        sinon.stub(ComponentDialog.prototype, 'beginDialog').resolves({ status: 'waiting' });
        reply = await client.sendActivity('Verde');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho certo - escolhendo com prompt "Verde"', async () => {
        const client = new DialogTestClient('test', sut);
        sinon.stub(recognizer, 'getEntities').returns({})
        
        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, 'Qual a cor que você quer para a sua bicicleta? 🚲');

        reply = await client.sendActivity("Qualquercoisa");
        assert.strictEqual(reply.text, msg.promptColor);

        sinon.restore();
        sinon.stub(SearchBike.prototype,'search').resolves(bikes);
        sinon.stub(recognizer, 'getEntities').returns({ color: [['Verde']] });
        sinon.stub(ComponentDialog.prototype, 'beginDialog').resolves({ status: 'waiting' });
        
        reply = await client.sendActivity('Verde');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho certo - filterBike não devolvendo nada ', async () => {
        const client = new DialogTestClient('test', sut);
        sinon.restore();
        sinon.stub(recognizer, 'getEntities').returns({ color: [['Verde']] });
        sinon.stub(SearchBike.prototype,'search').resolves([]);
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting' });

        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, 'Qual a cor que você quer para a sua bicicleta? 🚲');

        reply = await client.sendActivity('Verde');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho errado - fallback', async () => {
        const client = new DialogTestClient('test', sut);
        sinon.stub(recognizer, 'getEntities').returns({})
        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, 'Qual a cor que você quer para a sua bicicleta? 🚲');

        reply = await client.sendActivity('ProvocaErro');
        assert.strictEqual(reply.text, msg.promptColor);

        reply = await client.sendActivity('ProvocaErro');
        assert.strictEqual(reply.text, msg.repromptColor);

        reply = await client.sendActivity('ProvocaErro');
        assert.strictEqual(reply.text, msg.repromptColor);

        reply = await client.sendActivity('ProvocaErro');
        assert.strictEqual(reply.text, 'Sinto muito,ainda estou aprendendo e no momento não consigo entender o que você deseja. Mas podemos tentar conversar novamente mais tarde!');

        assert.strictEqual(client.dialogTurnResult.status, 'complete');
    });




})


