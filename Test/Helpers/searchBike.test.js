const { default: axios } = require('axios');
const SearchBike = require('../../Helpers/searchBikes');
const bikes = require('../TestData/bikes');
const sinon = require('sinon');
const assert = require('assert');



describe('Teste Helper searchBike', () => {
    afterEach(() => {
        sinon.restore();
    })

    it('Caminho certo - Retorno requisição normal ', async() => {
        sinon.stub(axios,'get').resolves({data:bikes});
        assert.deepStrictEqual(await SearchBike.prototype.search(),bikes);
    })
    it('Caminho errado - Retorno requisição [] ', async() => {
        sinon.stub(axios,'get').resolves({data:[]});
        assert.deepStrictEqual(await SearchBike.prototype.search(),false);
    })
})