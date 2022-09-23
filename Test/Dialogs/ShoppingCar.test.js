const { DialogTestClient, DialogTestLogger } = require('botbuilder-testing');
const assert = require('assert');
const isEndDialog = require('../../Helpers/isEndDialog');
const msgShopping = require('../../Dialogs/ShoppingCar/message')
const msg = require('./../TestData/shoppingData');
const dataBase = require('../../DataBase/actionsDB')
const sinon = require('sinon');
const recognizer = require('../../Helpers/getLuis');
const {DialogContext } = require('botbuilder-dialogs');
const ChangePurchaseData = require('../../Dialogs/ChangePurchaseData/changePurchaseData');
const ShoppingCar = require('../../Dialogs/ShoppingCar/ShoppingCar');

describe('Teste dialogo ShoppingCar', () => {
    let stubGetEntities, stubIsEndDialog,stubAlreadyCreated,stubFindBikes, client, stubDataPurchase;
    const sut = new ShoppingCar();
    beforeEach(() => {
        client = new DialogTestClient('test', sut,{bike: msg.oneBike});

        sinon.stub(dataBase,'addBike').resolves();
        sinon.stub(dataBase,'insert').resolves();
        sinon.stub(dataBase,'removeCart').resolves();
        stubFindBikes = sinon.stub(dataBase,'findBikes');
        stubAlreadyCreated = sinon.stub(dataBase,'alreadyCreated');
        stubGetEntities = sinon.stub(recognizer, 'getEntities');
        stubIsEndDialog = sinon.stub(isEndDialog, 'isEndDialog').resolves(false);
        //stubDataPurchase = sinon.stub(msgShopping,'dataPurchase');

    })

    afterEach(() => {
        sinon.restore();
    })
    

    it('Caminho Finalizar pedido no canal telegram e metodo de pagamento pix', async () => {
        stubAlreadyCreated.resolves(true);
        stubGetEntities.returns({finishOrder:{}});
        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.bikeAdd);
        reply = await client.getNextReply();
        assert.strictEqual(reply.text, msg.continueBuy);
        
        stubFindBikes.resolves([msg.findOneBike]);
        
        reply = await client.sendActivity('Finalizar pedido');
        assert.strictEqual(reply.text, msg.cartTl);
        
        reply = await client.getNextReply();
        assert.strictEqual(reply.text, msg.proceedBuy);
        
        reply = await client.sendActivity('Sim');
        assert.strictEqual(reply.text, msg.messageRegisterOrChange);

        stubGetEntities.returns({paymentMethod:[['Pix']]});
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting'});

        reply = await client.getNextReply();
        assert.strictEqual(reply.text, msg.paymentMethod);

        reply = await client.sendActivity('pix');

        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });
    it('Caminho Finalizar pedido e Retirar item do carrinho', async () => {
        stubAlreadyCreated.resolves(true);
        stubGetEntities.returns({finishOrder:{}});
        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.bikeAdd);
        reply = await client.getNextReply();
        assert.strictEqual(reply.text, msg.continueBuy);
        
        stubFindBikes.resolves([msg.findOneBike]);
        
        reply = await client.sendActivity('Finalizar pedido');
        assert.strictEqual(reply.text, msg.cartTl);
        
        reply = await client.getNextReply();
        assert.strictEqual(reply.text, msg.proceedBuy);
        
        reply = await client.sendActivity('Não');
        assert.strictEqual(reply.text, msg.changesInCart);
        
        stubGetEntities.returns({remove:{}});
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting'});
        
        reply = await client.sendActivity('Retirar item do carrinho');

        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });
    it('Caminho Finalizar pedido e Cancelar Compra', async () => {
        stubAlreadyCreated.resolves(true);
        stubGetEntities.returns({finishOrder:{}});
        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.bikeAdd);
        reply = await client.getNextReply();
        assert.strictEqual(reply.text, msg.continueBuy);
        
        stubFindBikes.resolves([msg.findOneBike]);
        
        reply = await client.sendActivity('Finalizar pedido');
        assert.strictEqual(reply.text, msg.cartTl);
        
        reply = await client.getNextReply();
        assert.strictEqual(reply.text, msg.proceedBuy);
        
        reply = await client.sendActivity('Não');
        assert.strictEqual(reply.text, msg.changesInCart);
        
        stubGetEntities.returns({cancel:{}});
        
        reply = await client.sendActivity('Cancelar compra');
        
        assert.strictEqual(client.dialogTurnResult.status, 'complete');

    });
    it('Caminho continuar comprando', async () => {
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting'});
        stubGetEntities.returns({});

        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.bikeAdd);
        reply = await client.getNextReply();
        assert.strictEqual(reply.text, msg.continueBuy);
        
        reply = await client.sendActivity('Continuar comprando');
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');

    });
    it('Caminho remove no options', async () => {
        client = new DialogTestClient('test', sut,{bike: msg.oneBike, remove:true});
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting'});
        stubFindBikes.resolves([msg.findOneBike]);
        stubGetEntities.returns({finishOrder:{}});
        
        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.cartTl);

        reply = await client.getNextReply();
        assert.strictEqual(reply.text, msg.proceedBuy);
        
        assert.strictEqual(client.dialogTurnResult.status, 'waiting');

    });

    

    


})


