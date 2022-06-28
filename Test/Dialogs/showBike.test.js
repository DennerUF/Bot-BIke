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
    let sut;
    beforeEach(()=>{
        sut = new ShowBikes();
        sinon.stub(card,'fullCard').resolves(dataBike.fullcard);
        sinon.stub(card,'descriptionCard').resolves(dataBike.descriptionCard);
        
    })

    afterEach(()=>{
        sinon.restore();
    })
    
    it('Caminho certo - mostrando card Completo', async () => {
        const client = new DialogTestClient('test', sut,{bikes:bikes});
        sinon.stub(recognizer,'getEntities').resolves({});
        sinon.stub(recognizer,'getTopIntent').resolves({});

        let reply = await client.sendActivity('ola');
        assert.notDeepStrictEqual(reply.text, dataBike.fullcard);
        

        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });
    
    it('Caminho certo - mostrando card com descricao', async () => {
        const client = new DialogTestClient('test', sut,{bikes:bikes,description: true });
        sinon.stub(recognizer,'getEntities').resolves({});
        sinon.stub(recognizer,'getTopIntent').resolves({});

        let reply = await client.sendActivity('ola');
        assert.notDeepStrictEqual(reply.text, dataBike.descriptionCard);
        

        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho certo - escolhendo "Ver Proxima opção de bicicleta"', async () => {
        const client = new DialogTestClient('test', sut,{bikes:bikes});
        sinon.stub(recognizer,'getEntities').resolves({});
        sinon.stub(recognizer,'getTopIntent').resolves({});

        let reply = await client.sendActivity('ola');
        assert.notDeepStrictEqual(reply.text, dataBike.fullcard);
        
        reply = await client.sendActivity('Ver Proxima opção');
        assert.notDeepStrictEqual(reply.text, dataBike.fullcard);
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });
    it('Caminho certo - escolhendo "Mais Informacoes sobre a bicicleta"', async () => {
        const client = new DialogTestClient('test', sut,{bikes:bikes});
        sinon.stub(recognizer,'getEntities').resolves({informacao:{}});
        sinon.stub(recognizer,'getTopIntent').resolves({});

        let reply = await client.sendActivity('ola');
        assert.notDeepStrictEqual(reply.text, dataBike.fullcard);
        
        reply = await client.sendActivity('Ver Proxima opção');
        assert.notDeepStrictEqual(reply.text, dataBike.descriptionCard);
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });
    it('Caminho certo - escolhendo "Explorar outro filtro de pesquisa"', async () => {
        const client = new DialogTestClient('test', sut,{bikes:bikes});
        sinon.stub(recognizer,'getEntities').resolves({});
        sinon.stub(recognizer,'getTopIntent').resolves('MENU');
        
        let reply = await client.sendActivity('ola');
        assert.notDeepStrictEqual(reply.text, dataBike.fullcard);

        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting' });
        
        reply = await client.sendActivity('Explorar outro filtro de pesquisa');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });
    it('Caminho certo - escolhendo "Ver Proxima opção de bicicleta" Sem ter proxima opcao', async () => {
        const client = new DialogTestClient('test', sut,{bikes:dataBike.oneBike});
        sinon.stub(recognizer,'getEntities').resolves({});
        sinon.stub(recognizer,'getTopIntent').resolves({});
        
        let reply = await client.sendActivity('ola');
        assert.notDeepStrictEqual(reply.text, dataBike.fullcard);

        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting' });
        
        reply = await client.sendActivity('Ver Proxima opção de bicicleta');
        assert.strictEqual(reply.text, dataBike.message);
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });
    it('Caminho certo - intent e entitie igual false', async () => {
        const client = new DialogTestClient('test', sut,{bikes:bikes});
        sinon.stub(recognizer,'getEntities').resolves(false);
        sinon.stub(recognizer,'getTopIntent').resolves(false);

        let reply = await client.sendActivity('ola');

        assert.notDeepStrictEqual(reply.text, dataBike.fullcard);

        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting' });

        reply = await client.sendActivity('Ver Proxima opção de bicicleta');
        assert.strictEqual(reply.text, 'Encontramos um erro. Tente novamente');


        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });
})