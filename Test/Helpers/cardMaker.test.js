
const assert = require('assert');

const card = require('../../Helpers/cardMaker');
const bikes = require('../TestData/bikes');
const cardData = require('../TestData/cardMakerData');

describe('Teste Helper cardMaker', () => {

    it('Caminho certo - Passando 1 bicicleta no canal telegram para card.fullCard ', async () => {
        assert.deepStrictEqual(card.fullCard(bikes[0],1,'telegram'), cardData.fullCardTlOneBike);
    });

    it('Caminho certo - Passando mais de 1 bicicleta no canal telegram para card.fullCard ', async () => {
        assert.deepStrictEqual(card.fullCard(bikes[0],2,'telegram'), cardData.fullCardTlMoreOneBike);
    });

    it('Caminho certo - Passando 1 bicicleta no canal whatsapp para card.fullCard ', async () => {
        assert.deepStrictEqual(card.fullCard(bikes[0],1,'whatsapp'), cardData.fullCardWtOneBike);
    });

    it('Caminho certo - Passando mais de 1 bicicleta no canal telegram para card.fullCard ', async () => {
        assert.deepStrictEqual(card.fullCard(bikes[0],2,'whatsapp'), cardData.fullCardWtMoreOneBike);
    });
    
    

    it('Caminho certo - Passando dados completos para card.descriptionCard ', async () => {
        assert.strictEqual(card.descriptionCard(bikes[0]), cardData.descriptionCard);
    });


})