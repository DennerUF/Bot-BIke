const { DialogTestClient, DialogTestLogger } = require('botbuilder-testing');
const assert = require('assert');
const msg = require('./../TestData/registerData');
const sinon = require('sinon');
const recognizer = require('../../Helpers/getLuis');
const cepValidator = require('../../Helpers/cepValidator');
const {DialogContext } = require('botbuilder-dialogs');
const { Register } = require('../../Dialogs/Register/register');

describe('Teste dialogo Register', () => {
    let stubGetEntities, stubValidateCep, client;
    beforeEach(() => {
        const sut = new Register();
        client = new DialogTestClient('test', sut,{ paymentMethod: 'pix'});

        stubValidateCep = sinon.stub(cepValidator,'validateCep');
        stubGetEntities = sinon.stub(recognizer, 'getEntities');

    })

    afterEach(() => {
        sinon.restore();
    })
    it('Caminho certo - Passando CEP', async () => {
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting'});
        stubValidateCep.returns({ city: 'Caraguatatuba', address: 'Rua Oito', district: 'Pontal de Santa Marina' })
        stubGetEntities.returns({ CEP: ['11672-180'] });
        
        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.promptCep);
        
        reply = await client.sendActivity('11672-180');
        assert.strictEqual(reply.text, msg.promptNumberHouse);
        
        stubGetEntities.returns({ number: ['333'] });
        
        reply = await client.sendActivity('333');
        assert.strictEqual(reply.text, msg.promptComplement);
        
        reply = await client.sendActivity('Casa');
        assert.strictEqual(reply.text, msg.promptName);
        
        reply = await client.sendActivity('Alfredo');
        assert.strictEqual(reply.text, msg.promptCPF);
        
        stubGetEntities.returns({ CPF: ['195.413.580-71'] });
        
        reply = await client.sendActivity('195.413.580-71');
        assert.strictEqual(reply.text, msg.promptFone);
        
        stubGetEntities.returns({ number: ['11999999999'] });
        
        
        reply = await client.sendActivity('11999999999');

        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });
    it('Caminho certo - Sem passar CEP', async () => {
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting'});
        stubGetEntities.returns({});
        
        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.promptCep);
        
        reply = await client.sendActivity('0');
        assert.strictEqual(reply.text, msg.promptCity);
        
        reply = await client.sendActivity('Caraguatatuba sp');
        assert.strictEqual(reply.text, msg.promptDistrict);

        reply = await client.sendActivity('Pontal de Santa Marina');
        assert.strictEqual(reply.text, msg.promptAddress);
        
        reply = await client.sendActivity('Rua Oito');
        

        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    it(' Passando CEP invalido', async () => {
        sinon.stub(DialogContext.prototype, 'replaceDialog').resolves({ status: 'waiting'});
        stubValidateCep.returns(false);
        stubGetEntities.returns({ CEP: ['00000-000'] });
        
        let reply = await client.sendActivity('ola');
        assert.strictEqual(reply.text, msg.promptCep);
        
        reply = await client.sendActivity('0');
        assert.strictEqual(reply.text, msg.promptCity);
        

        assert.strictEqual(client.dialogTurnResult.status, 'waiting');
    });

    


})


