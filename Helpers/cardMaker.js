const { CardFactory } = require('botbuilder');

module.exports = {
    /**
     *  Build card complete with information about the bike 
     * @param {object} bike - bike information 
     * @returns {CardFactory} Build full card
     */
    fullCard: (bike, length) => {
        return CardFactory.heroCard(
            `${bike.name}
        \nMarca: ${bike.brand}
        \nPreço:R$ ${bike.price}`,
            CardFactory.images([`${bike.image}`]),
            length <= 1
                ? ['Mais Informações sobre a bicicleta', 'Explorar outro filtro de pesquisa']
                : ['Mais Informações sobre a bicicleta', 'Ver Próxima opção de bicicleta', 'Explorar outro filtro de pesquisa']

        );
    },
    fullCardWhatsApp: (bike, length) => {
        let message = `*${bike.name}* \n*Marca*: ${bike.brand} \n*Preço*: R$ ${bike.price} \nO que deseja fazer ? `
        message += length <= 1
            ? `\n   _-Mais Informações sobre a bicicleta_ \n  _-Explorar outro filtro de pesquisa_`
            : `\n   _-Mais Informações sobre a bicicleta_ \n  _-Ver Próxima opção de bicicleta_ \n _-Explorar outro filtro de pesquisa_`;
        return {
            type: 'message',
            text: message,
            attachments: [
                {
                    contentType: 'image/jpeg ',
                    contentUrl: `${bike.image}`
                }
            ]
        };
    },


    /**
     * Build card with bike description
     * @param {object} bike - bike information 
     * @returns {CardFactory}  Card with bike description
     */
    descriptionCard: (bike) => {
        return CardFactory.heroCard(
            `${bike.name}`, `${bike.description}`, CardFactory.images([`${bike.image}`])
        );
    },
    descriptionCardwHATSaPP: (bike) => {
            return `${bike.name} \n\n${bike.description}`
        
    }
}

