const { DialogTestClient, DialogTestLogger } = require('botbuilder-testing'); 
const { Gender } = require('../../Dialogs/Gender/gender');
const sinon = require('sinon');
const msg = require('./../TestData/genderData');

const bikes = require('./../TestData/bikes');

const { ComponentDialog, DialogContext } = require('botbuilder-dialogs');
const assert = require('assert');
const recognizer = require('../../Helpers/getLuis')
const isEndDialog = require('../../Helpers/isEndDialog');
const filter = require('../../Helpers/filterBikes');


describe('Teste dialogo Gender', () => {
    let stubGetEntities,stubFilter,stubIsEndDialog, client;
    beforeEach(()=>{
        const sut = new Gender();
        client = new DialogTestClient('test', sut);

        stubGetEntities = sinon.stub(recognizer, 'getEntities');
        stubFilter = sinon.stub(filter,'filterBikes').returns(bikes);
        stubIsEndDialog = sinon.stub(isEndDialog,'isEndDialog').resolves(false);
    })

    afterEach(()=>{
        sinon.restore();
    })

    it('Caminho certo - escolhendo "Unissex"', async () => {
        
        stubGetEntities.returns({gender:[['Unissex']]});
        
        let reply = await client.sendActivity('');
        assert.strictEqual(reply.text, msg.promptGender);
        
        sinon.stub(ComponentDialog.prototype, 'beginDialog').resolves({ status: 'waiting' });

        reply = await client.sendActivity('Unissex');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho certo - Ativando menu com opcao "Outro filtro" ', async () => {
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting' });
        stubGetEntities.returns({anotherFilter:{}});

        let reply = await client.sendActivity('');
        assert.strictEqual(reply.text, msg.promptGender);

        reply = await client.sendActivity('Outro Filtro');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho certo - filterBike não devolvendo nada ', async () => {
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting' });
        stubGetEntities.returns({gender:[['Unissex']]});
        stubFilter.returns([]);

        let reply = await client.sendActivity('');
        assert.strictEqual(reply.text, msg.promptGender);

        reply = await client.sendActivity('Unissex');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho errado - fallback', async () => {
        stubGetEntities.returns({});
        stubIsEndDialog.resolves(true);

        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.promptGender);

        reply = await client.sendActivity('ProvocaErro');
        assert.strictEqual(reply.text, msg.repromptGender);

        reply = await client.sendActivity('ProvocaErro');
        assert.strictEqual(reply.text, msg.repromptGender);

        reply = await client.sendActivity('ProvocaErro');

        assert.strictEqual(client.dialogTurnResult.status, 'complete');
    });




})


