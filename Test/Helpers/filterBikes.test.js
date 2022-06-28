
const sinon = require('sinon');
const assert = require('assert');

const filter = require('../../Helpers/filterBikes');
const bikes = require('../TestData/bikes');
const filterData = require('../TestData/filterBikesData');
const SearchBike = require('../../Helpers/searchBikes');

describe('Teste Helper filterBike', async () => {
    beforeEach(() => {
        sinon.stub(SearchBike.prototype,'search').resolves(bikes);
    })
    
    afterEach(() => {
        sinon.restore();
    })

    it('Caminho certo - filtrando bikes "type casual" ', async () => {
        assert.deepStrictEqual(await filter.filterBikes('type','Casual'),filterData.bikesTypeCasual);
    });
    it('Caminho certo - filtrando bikes "price ate R$ 500" ', async () => {
        assert.deepStrictEqual(await filter.filterBikes('price',{priceMax:['500']}),filterData.bikesPriceAte500);
    });
    it('Caminho certo - filtrando bikes "price mais de R$ 3000" ', async () => {
        assert.deepStrictEqual(await filter.filterBikes('price',{priceMin:['3000']}),filterData.bikesPriceMais3000);
    });
    it('Caminho certo - filtrando bikes "price de R$ 500 ate R$ 1500" ', async () => {
        assert.deepStrictEqual(await filter.filterBikes('price',{min:'500',max:'1500'}),filterData.bikesPriceDe500Ate1500);
    });
    it('Caminho Errado - SearchBikes não devolve bikes ', async () => {
        sinon.restore();
        sinon.stub(SearchBike.prototype,'search').resolves([]);
        assert.deepStrictEqual(await filter.filterBikes('color','Verde'),false);
    });

    

})