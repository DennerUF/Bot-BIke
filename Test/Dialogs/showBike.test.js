const bikes = require('./../TestData/bikes');
const dataBike = require('./../TestData/showBikesData');
const { DialogTestClient, DialogTestLogger } = require('botbuilder-testing');
const sinon = require('sinon');
const recognizer = require('../../Helpers/getLuis');

const { ComponentDialog, DialogContext } = require('botbuilder-dialogs');
const assert = require('assert');
const { ShowBikes } = require('../../Dialogs/ShowBikes/showBikes');
const card = require('../../Helpers/cardMaker');

describe('Teste dialogo ShowBikes', () => {
    let sut,client,stubGetEntities,stubGetIntents;
    beforeEach(()=>{
        sut = new ShowBikes();
        client = new DialogTestClient('test', sut,{bikes:bikes});

        stubGetEntities = sinon.stub(recognizer,'getEntities').returns({});
        stubGetIntents = sinon.stub(recognizer,'getTopIntent').returns({});
        sinon.stub(card,'fullCard').resolves(dataBike.fullcard);
        sinon.stub(card,'descriptionCard').resolves(dataBike.descriptionCard);
        
    })

    afterEach(()=>{
        sinon.restore();
    })
    
    it('Caminho certo - mostrando card Completo', async () => {

        let reply = await client.sendActivity('ola');
        assert.notDeepStrictEqual(reply.text, dataBike.fullcard);
        

        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });
    
    it('Caminho certo - mostrando card com descricao', async () => {
        const client = new DialogTestClient('test', sut,{bikes:bikes,description: true });

        let reply = await client.sendActivity('ola');
        assert.notDeepStrictEqual(reply.text, dataBike.descriptionCard);
        

        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho certo - escolhendo "Ver Proxima opção de bicicleta"', async () => {

        let reply = await client.sendActivity('ola');
        assert.notDeepStrictEqual(reply.text, dataBike.fullcard);
        
        reply = await client.sendActivity('Ver Proxima opção');
        assert.notDeepStrictEqual(reply.text, dataBike.fullcard);

        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });
    it('Caminho certo - escolhendo "Mais Informacoes sobre a bicicleta"', async () => {
        
        stubGetEntities.returns({informacao:{}});

        let reply = await client.sendActivity('ola');
        assert.notDeepStrictEqual(reply.text, dataBike.fullcard);
        
        reply = await client.sendActivity('Ver Proxima opção');
        assert.notDeepStrictEqual(reply.text, dataBike.descriptionCard);
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });
    it('Caminho certo - escolhendo "Explorar outro filtro de pesquisa"', async () => {
        
        stubGetIntents.resolves('MENU');
        
        let reply = await client.sendActivity('ola');
        assert.notDeepStrictEqual(reply.text, dataBike.fullcard);

        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting' });
        
        reply = await client.sendActivity('Explorar outro filtro de pesquisa');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });
    it('Caminho certo - escolhendo "Ver Proxima opção de bicicleta" Sem ter proxima opcao', async () => {
        const client = new DialogTestClient('test', sut,{bikes:dataBike.oneBike});
        
        let reply = await client.sendActivity('ola');
        assert.notDeepStrictEqual(reply.text, dataBike.fullcard);

        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting' });
        
        reply = await client.sendActivity('Ver Proxima opção de bicicleta');
        assert.strictEqual(reply.text, dataBike.message);

        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });
    it('Caminho certo - intent e entitie igual false', async () => {
        
        stubGetEntities.resolves(false);
        stubGetIntents.resolves(false);

        let reply = await client.sendActivity('ola');

        assert.notDeepStrictEqual(reply.text, dataBike.fullcard);

        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting' });

        reply = await client.sendActivity('Ver Proxima opção de bicicleta');
        assert.strictEqual(reply.text, 'Encontramos um erro. Tente novamente');


        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });
})