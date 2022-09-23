const { DialogTestClient, DialogTestLogger } = require('botbuilder-testing');
const assert = require('assert');
const isEndDialog = require('../../Helpers/isEndDialog');
const msg = require('./../TestData/removeBikeData');
const msgRemoveBike = require('../../Dialogs/RemoveBikeCart/message');
const dataBase = require('../../DataBase/actionsDB');
const sinon = require('sinon');
const recognizer = require('../../Helpers/getLuis');
const {DialogContext } = require('botbuilder-dialogs');
const RemoveBikeCart = require('../../Dialogs/RemoveBikeCart/removeBikeCart');

describe('Teste dialogo RemoveBikeCart', () => {
    let stubGetEntities, stubIsEndDialog,stubAlreadyCreated,stubFindBikes, client, stubNameBikes,stubSelectItem;
    const sut = new RemoveBikeCart();
    beforeEach(() => {
        client = new DialogTestClient('test', sut,{bike: msg.oneBike});

        sinon.stub(dataBase,'addBike').resolves();
        sinon.stub(dataBase,'insert').resolves();
        sinon.stub(dataBase,'removeBike').resolves();
        stubFindBikes = sinon.stub(dataBase,'findBikes');
        stubAlreadyCreated = sinon.stub(dataBase,'alreadyCreated');
        stubGetEntities = sinon.stub(recognizer, 'getEntities');
        stubIsEndDialog = sinon.stub(isEndDialog, 'isEndDialog').resolves(false);
        

    })

    afterEach(() => {
        sinon.restore();
    })
    

    it('Caminho remover bicicleta', async () => {
        stubFindBikes.resolves(msg.bikes);
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting'});
        stubGetEntities.returns({number:['1']});

        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.msgItemsCart+msg.namesBike);

        reply = await client.getNextReply();
        assert.strictEqual(reply.text, msg.selectItem);

        reply = await client.sendActivity('1');

        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });
    it('Caminho caindo fallback', async () => {
        stubIsEndDialog.resolves(true);
        stubFindBikes.resolves(msg.bikes);
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting'});
        stubGetEntities.returns({});

        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.msgItemsCart+msg.namesBike);

        reply = await client.getNextReply();
        assert.strictEqual(reply.text, msg.selectItem);

        reply = await client.sendActivity('qualquerCoisa');
        assert.strictEqual(reply.text, msg.fallback)
        
        reply = await client.sendActivity('qualquerCoisa');
        assert.strictEqual(client.dialogTurnResult.status, 'complete');
    });
    
    

    


})


