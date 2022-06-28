
const sinon = require('sinon');
const assert = require('assert');

const card = require('../../Helpers/cardMaker');
const bikes = require('../TestData/bikes');
const cardData = require('../TestData/showBikesData');

describe('Teste Helper cardMaker', () => {

    it('Caminho certo - Passando dados completos para card.fullCard ', async () => {
        assert.deepStrictEqual(card.fullCard(bikes[0]), cardData.fullcard);
    });

    it('Caminho certo - Passando dados completos para card.descriptionCard. ', async () => {
        assert.deepStrictEqual(card.descriptionCard(bikes[0]),cardData.descriptionCard);
    });

})