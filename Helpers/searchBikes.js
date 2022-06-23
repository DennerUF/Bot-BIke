const { default: axios } = require('axios');
/**
 * Make a bike API request
 * @returns Array Bikes
 */


class SearchBike {
    async search() {
        try {
            const { data } = await axios({ method: 'GET', url: `https://pb-bikes-api.herokuapp.com/bike/list` });
            return data;
        } catch (error) {
            if(error)
                return false;
        }
    }
}

module.exports = SearchBike;