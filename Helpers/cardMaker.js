const { CardFactory } = require('botbuilder');

module.exports = {
    /**
     *  Build card complete with information about the bike 
     * @param {Object} bike Bike information
     * @param {Number} length Number of bikes in the queue to be shown
     * @param {String} channel Message channel
     * @returns {Object} All bike information
     */
    fullCard: (bike, length, channel) => {
        if (channel === 'whatsapp') {
            let message = `Bicicleta *${bike.name}* \n*Marca*: ${bike.brand} \n*Preço*: R$ ${bike.price} \nO que deseja fazer ?\n `
            message += length <= 1
                ? `\n_-Mais Informações da bicicleta_ \n_-Explorar outro filtro de pesquisa_`
                : `\n_-Mais Informações da bicicleta_ \n_-Ver Próxima opção de bicicleta_ \n_-Explorar outro filtro de pesquisa_`;
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
        }
        return {
            attachments: [
                CardFactory.heroCard(
                    `Bicicleta **${bike.name}**
                    \n**Marca**: ${bike.brand}
                    \n**Preço**: R$ ${bike.price}`,
                    CardFactory.images([`${bike.image}`]),
                    length <= 1
                        ? ['Mais Informações da bicicleta', 'Explorar outro filtro de pesquisa']
                        : ['Mais Informações da bicicleta', 'Ver Próxima opção de bicicleta', 'Explorar outro filtro de pesquisa']

                )
            ]
        };
    },


    /**
     * Build message with bike description
     * @param {object} bike - bike information 
     * @returns {String}  Message with bike description
     */
    descriptionCard: (bike) => {
        return `Bicicleta ${bike.name} \n\n${bike.description}`;
    },
}

