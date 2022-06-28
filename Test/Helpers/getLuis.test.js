const { DialogTestClient, DialogTestLogger } = require('botbuilder-testing');
const sinon = require('sinon');
const assert = require('assert');

const getLuis = require('../../Helpers/getLuis');
const getLuisData = require('./../TestData/getLuisData'); 
const { entities } = require('./../TestData/getLuisData');

//, {}, [new DialogTestLogger()]



describe('Teste Helper getLuis', () => {

    it('Caminho certo - Passando dados completos para getEntities ', async () => {
        assert.deepStrictEqual(getLuis.getEntities(getLuisData.luisResult), getLuisData.entities);
    });
    it('Caminho errado - Passando vazio para getEntities ', async () => {
        assert.strictEqual(getLuis.getEntities({}), false);
    });
    it('Caminho certo - Passando dados completos para getTopIntent ', async () => {
        assert.strictEqual(getLuis.getTopIntent(getLuisData.luisResult), getLuisData.topIntent);
    });
    it('Caminho errado - Passando vazio completos para getTopIntent ', async () => {
        assert.strictEqual(getLuis.getTopIntent({}), false);
    });

})


