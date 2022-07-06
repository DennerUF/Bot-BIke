const { default: axios } = require('axios');
module.exports = async (cep) => {
    cep = cep.replace(/[^\d{1,8}]/g, '');
    try {
        const { data } = await axios({ method: 'GET', url: `https://viacep.com.br/ws/${cep}/json/` });
        if(data.erro){throw new Error};
        return {city:data.localidade, address: data.logradouro, district: data.bairro};
    } catch (error) {
        if(error)
            return false;
    }
}