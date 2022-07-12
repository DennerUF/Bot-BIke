const { CardFactory } = require('botbuilder');

module.exports = {
    /**
     *  Build card complete with information about the bike 
     * @param {object} bike - bike information 
     * @returns {CardFactory} Build full card
     */
    fullCard: (bike, length, channel) => {
        if (channel === 'whatsapp') {
            let message = `${bike.name} \nMarca: ${bike.brand} \nPreço:R$ ${bike.price} \n O que deseja fazer ? `
            message += length <= 1
                ? `\nMais Informações sobre a bicicleta \nExplorar outro filtro de pesquisa`
                : `\nMais Informações sobre a bicicleta \nVer Próxima opção de bicicleta \nExplorar outro filtro de pesquisa`;
            return message;
        }
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
    /**
     * Build card with bike description
     * @param {object} bike - bike information 
     * @returns {CardFactory}  Card with bike description
     */
    descriptionCard: (bike,channel) => {
        if (channel === 'whatsapp') {
            return `${bike.name} \n\n${bike.description}`
        }
        return CardFactory.heroCard(
            `${bike.name}`, `${bike.description}`, CardFactory.images([`${bike.image}`])
        );
    },

}
