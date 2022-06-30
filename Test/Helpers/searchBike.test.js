const { default: axios } = require('axios');
const SearchBike = require('../../Helpers/searchBikes');
const bikes = require('../TestData/bikes');
const sinon = require('sinon');
const assert = require('assert');



describe('Teste Helper searchBike', () => {
    let stubAxios;
    beforeEach(() => {
        stubAxios = sinon.stub(axios,'get');
    })

    afterEach(() => {
        sinon.restore();
    })

    it('Caminho certo - Retorno requisição normal ', async() => {
        stubAxios.resolves({data:bikes});
        assert.deepStrictEqual(await SearchBike.prototype.search(),bikes);
    })
    it('Caminho errado - Retorno requisição [] ', async() => {
        stubAxios.resolves({data:[]});
        assert.deepStrictEqual(await SearchBike.prototype.search(),false);
    })
})