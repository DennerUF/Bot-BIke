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

    let sut;
    beforeEach(()=>{
        sut = new Type();

    })

    afterEach(()=>{
        sinon.restore();
    })
    it('Caminho certo - escolhendo "Infantil"',async ()=>{
        const client = new DialogTestClient('test', sut);
        sinon.stub(filter,'filterBikes').returns(bikes);
        sinon.stub(isEndDialog,'isEndDialog').resolves(false);

        let reply = await client.sendActivity('tipo');
        assert.strictEqual(reply.text, 'Boa Escolha! Vem comigo para selecionar a sua magrela🚲');
        sinon.stub(recognizer,'getEntities').returns({type:[['Infantil']]});
        sinon.stub(ComponentDialog.prototype, 'beginDialog').resolves({ status: 'waiting' });

        reply = await client.sendActivity('Infantil');
        assert.strictEqual(reply.text, msg.promptType);

        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho certo - filterBike não devolvendo nada ', async () => {
        const client = new DialogTestClient('test', sut);


        sinon.stub(recognizer, 'getEntities').returns({type:[['Infantil']]});
        sinon.stub(filter,'filterBikes').returns([]);
        sinon.stub(isEndDialog,'isEndDialog').resolves(false);
        let reply = await client.sendActivity('tipo');
        assert.strictEqual(reply.text, 'Boa Escolha! Vem comigo para selecionar a sua magrela🚲');

        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting' });
        reply = await client.sendActivity('Infantil');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });
    
    it('Caminho certo - Ativando menu com opcao "Outro filtro" ', async () => {
        const client = new DialogTestClient('test', sut);
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting' });
        sinon.stub(recognizer, 'getEntities').returns({anotherFilter:{}});
        sinon.stub(filter,'filterBikes').returns(bikes);
        sinon.stub(isEndDialog,'isEndDialog').resolves(false);

        let reply = await client.sendActivity('tipo');
        assert.strictEqual(reply.text, 'Boa Escolha! Vem comigo para selecionar a sua magrela🚲');

        reply = await client.sendActivity('Outro Filtro');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho errado - entitie == falsa', async () => {
        const client = new DialogTestClient('test', sut);
        sinon.stub(recognizer, 'getEntities').returns(false);
        sinon.stub(isEndDialog,'isEndDialog').resolves(true)
        let reply = await client.sendActivity('tipo');
        assert.strictEqual(reply.text, 'Boa Escolha! Vem comigo para selecionar a sua magrela🚲');

        reply =  client.getNextReply();
        assert.strictEqual(reply.text, msg.promptType);
        
        reply = await client.sendActivity('ProvocarErro');
        assert.strictEqual(reply.text, msg.repromptType);
        
        reply = await client.sendActivity('ProvocarErro');
        assert.strictEqual(reply.text, msg.repromptType);
        
        reply = await client.sendActivity('ProvocarErro');

        assert.strictEqual(client.dialogTurnResult.status, 'complete');
    })

    it('Caminho errado - fallback',async ()=>{
        const client = new DialogTestClient('test', sut);
        sinon.stub(recognizer, 'getEntities').returns({});
        sinon.stub(isEndDialog,'isEndDialog').resolves(true);
        let reply = await client.sendActivity('tipo');
        assert.strictEqual(reply.text, 'Boa Escolha! Vem comigo para selecionar a sua magrela🚲');
        
        reply =  client.getNextReply();
        assert.strictEqual(reply.text, msg.promptType);
        
        reply = await client.sendActivity('ProvocarErro');
        assert.strictEqual(reply.text, msg.repromptType);
        
        reply = await client.sendActivity('ProvocarErro');
        assert.strictEqual(reply.text, msg.repromptType);
        
        reply = await client.sendActivity('ProvocarErro');

        assert.strictEqual(client.dialogTurnResult.status, 'complete');
    });
   


})

