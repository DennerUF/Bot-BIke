const { DialogTestClient, DialogTestLogger } = require('botbuilder-testing');
const assert = require('assert');
const isEndDialog = require('../../Helpers/isEndDialog');
const msg = require('./../TestData/changeData');
const dataBase = require('../../DataBase/actionsDB')
const sinon = require('sinon');
const recognizer = require('../../Helpers/getLuis');
const {DialogContext } = require('botbuilder-dialogs');
const ChangePurchaseData = require('../../Dialogs/ChangePurchaseData/changePurchaseData');

describe('Teste dialogo ChangePurchaseData', () => {
    let stubGetEntities, stubIsEndDialog, client;
    const sut = new ChangePurchaseData();
    beforeEach(() => {
        client = new DialogTestClient('test', sut,{ data:msg.purchaseData});

        sinon.stub(dataBase,'removeCart').resolves();
        stubGetEntities = sinon.stub(recognizer, 'getEntities');
        stubIsEndDialog = sinon.stub(isEndDialog, 'isEndDialog').resolves(false);

    })

    afterEach(() => {
        sinon.restore();
    })
    

    it('Caminho sem alterar dado', async () => {
        
        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.messageConfirm);

        reply = await client.getNextReply();
        assert.strictEqual(reply.text, msg.purchase);
        reply = await client.getNextReply();
        assert.strictEqual(reply.text, msg.correct);
        reply = await client.sendActivity('Sim');
        assert.strictEqual(reply.text, msg.completedPurchase);


        assert.strictEqual(client.dialogTurnResult.status, 'complete');
    });

    it('Caminho alterando dado numero', async () => {
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting'});
        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.messageConfirm);

        reply = await client.getNextReply();
        assert.strictEqual(reply.text, msg.purchase);
        reply = await client.getNextReply();
        assert.strictEqual(reply.text, msg.correct);

        reply = await client.sendActivity('Não');
        assert.strictEqual(reply.text, msg.changeData);
        
        stubGetEntities.returns({purchaseData:[['numero']]});
        
        reply = await client.sendActivity('numero');
        assert.strictEqual(reply.text, msg.messageChangeNumber);
        
        reply = await client.sendActivity('334');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho alterando dado cpf', async () => {
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting'});
        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.messageConfirm);

        reply = await client.getNextReply();
        assert.strictEqual(reply.text, msg.purchase);
        reply = await client.getNextReply();
        assert.strictEqual(reply.text, msg.correct);

        reply = await client.sendActivity('Não');
        assert.strictEqual(reply.text, msg.changeData);
        
        stubGetEntities.returns({purchaseData:[['cpf']]});
        
        reply = await client.sendActivity('cpf');
        stubGetEntities.returns({CPF:['371.414.030-19']});
        assert.strictEqual(reply.text, msg.messageChangeCpf);
        
        reply = await client.sendActivity('371.414.030-19');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it('Caminho alterando dado cep', async () => {
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting'});
        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.messageConfirm);

        reply = await client.getNextReply();
        assert.strictEqual(reply.text, msg.purchase);
        reply = await client.getNextReply();
        assert.strictEqual(reply.text, msg.correct);

        reply = await client.sendActivity('Não');
        assert.strictEqual(reply.text, msg.changeData);
        
        stubGetEntities.returns({purchaseData:[['cep']]});
        
        reply = await client.sendActivity('cep');
        stubGetEntities.returns({CEP:['13308-384']});
        assert.strictEqual(reply.text, msg.messageChangeCep);
        
        reply = await client.sendActivity('13308-384');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    


})


