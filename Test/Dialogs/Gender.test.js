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
    let sut;

    beforeEach(()=>{
        sut = new Gender();
        sinon.stub(filter,'filterBikes').returns(bikes);
        sinon.stub(isEndDialog,'isEndDialog').resolves(false);
    })

    afterEach(()=>{
        sinon.restore();
    })

    it('Caminho certo - escolhendo "Unissex"', async () => {
        const client = new DialogTestClient('test', sut);
        sinon.stub(recognizer,'getEntities').resolves({gender:[['Unissex']]});
        
        let reply = await client.sendActivity('');
        assert.strictEqual(reply.text, msg.promptGender);
        
        sinon.stub(ComponentDialog.prototype, 'beginDialog').resolves({ status: 'waiting' });

        reply = await client.sendActivity('Unissex');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho certo - Ativando menu com opcao "Outro filtro" ', async () => {
        const client = new DialogTestClient('test', sut);
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting' });
        sinon.stub(recognizer, 'getEntities').returns({anotherFilter:{}});

        let reply = await client.sendActivity('');
        assert.strictEqual(reply.text, msg.promptGender);

        reply = await client.sendActivity('Outro Filtro');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho certo - filterBike não devolvendo nada ', async () => {
        const client = new DialogTestClient('test', sut);
        sinon.restore();
        sinon.stub(recognizer, 'getEntities').returns({gender:[['Unissex']]});
        sinon.stub(filter,'filterBikes').returns([]);
        sinon.stub(isEndDialog,'isEndDialog').resolves(false);
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting' });

        let reply = await client.sendActivity('');
        assert.strictEqual(reply.text, msg.promptGender);

        reply = await client.sendActivity('Unissex');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho errado - fallback', async () => {
        const client = new DialogTestClient('test', sut);
        sinon.restore();
        sinon.stub(recognizer,'getEntities').resolves({});
        sinon.stub(isEndDialog,'isEndDialog').resolves(true);

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


