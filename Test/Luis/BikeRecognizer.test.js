
const sinon = require('sinon');
const assert = require('assert');
const {BikeRecognizer} = require('../../Luis/BikeRecognizer');
const  LuisRecognizer  = require('botbuilder-ai');

//, {}, [new DialogTestLogger()]



describe('Teste Luis Conexão', () => {

    it('Caminho Errado - BikeRecognizer sem configuração ', async () => {
        const sut = new BikeRecognizer();
        assert.strictEqual(sut.isConfigured.valueOf(),false);
    });
    it('Caminho Certo - BikeRecognizer com configuração e chamando executeLuisQuery', async () => {
        sinon.stub(LuisRecognizer.LuisRecognizer.prototype,'recognize').resolves({recognizer:{}})
        const sut = new BikeRecognizer({applicationId:{},endpointKey:{},endpoint:{}  });
        assert.strictEqual(sut.isConfigured.valueOf(),true);
        assert.deepStrictEqual(await sut.executeLuisQuery(),{recognizer:{}});
    });
   
   
})


