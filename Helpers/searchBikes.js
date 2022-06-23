const { default: axios } = require('axios');

class SearchBike {
    /**
     * Search for bikes in the API
     * @returns {object[]} bikes
     */
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