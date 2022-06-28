const SearchBikes = require('./searchBikes');
const apiService = new SearchBikes();

/**
 * Filters bikes according to user-chosen characteristics
 * @param {string} filterCategory Filter category
 * @param {(object|string)}value Filter category value
 * @returns {object[]} Selected bikes 
 */
module.exports = {
    async filterBikes(filterCategory, value) {
        const bikes = await apiService.search();
        if (!bikes|| bikes.length <= 0) { return false }
        if (filterCategory == 'price') {
            if (value.min && value.max) {
                return bikes.filter((bike) => {
                    if (bike[filterCategory] > parseFloat(value.min) && bike[filterCategory] < parseFloat(value.max)) {
                        return bike;
                    }
                })
            } else if (value['priceMin']) {
                return bikes.filter((bike) => {
                    if (bike[filterCategory] > parseFloat(value['priceMin'][0])) {
                        return bike;
                    }
                })
            } else {
                return bikes.filter((bike) => {
                    if (bike[filterCategory] < parseFloat(value['priceMax'][0])) {
                        return bike;
                    }
                })
            }
        }
        return bikes.filter((bike) => {
            if (bike[filterCategory] == value) {
                return bike;
            }
        })
    }
}