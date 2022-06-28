const { default: axios } = require('axios');

class SearchBike {
    /**
     * Search for bikes in the API
     * @returns {object[]} bikes
     */
    async search() {
        try {
            const { data } = await axios.get(`https://pb-bikes-api.herokuapp.com/bike/list`);
            if(data.length <=0 ){throw new Error}
            return data;
        } catch (error) {
            if(error)
                return false;
        }
    }
}

module.exports = SearchBike;