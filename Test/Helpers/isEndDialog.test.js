const { ComponentDialog, DialogContext, Dialog, WaterfallStepContext, ActivityPrompt } = require('botbuilder-dialogs');
const sinon = require('sinon');
const assert = require('assert');
const isEndDialog = require('../../Helpers/isEndDialog');
const { Context } = require('mocha');
const { TurnContext } = require('botbuilder');



describe('Teste Helper isEndDialog', () => {
    beforeEach(() => {
        sinon.stub(TurnContext.prototype,'sendActivity').resolves();
    })
    afterEach(() => {
        sinon.restore();
    })

    it('Caminho certo - result igual "finishDialog" ', async() => {
        const parameter = {context:{sendActivity:TurnContext.prototype.sendActivity},result:"finishDialog"}
        assert.deepStrictEqual(await isEndDialog.isEndDialog(parameter),true);
    })
    it('Caminho errado - result diferente "finishDialog" ', async() => {
        assert.deepStrictEqual(await isEndDialog.isEndDialog({result:""}),false);
    })
})