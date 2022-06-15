const { default: axios } = require('axios');
module.exports = async () => {
    try {
        const { data } = await axios({ method: 'GET', url: `https://pb-bikes-api.herokuapp.com/bike/list` });
        return data;
    } catch (error) {
        if(error)
            return false;
    }
}