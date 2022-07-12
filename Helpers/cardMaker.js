const { CardFactory } = require('botbuilder');

module.exports = {
    /**
     *  Build card complete with information about the bike 
     * @param {object} bike - bike information 
     * @returns {CardFactory} Build full card
     */
    fullCard: (bike,length) => {
        return{
            type: 'message',
            text: `${bike.name} \nMarca: ${bike.brand} \nPreço:R$ ${bike.price}`,
            attachments: [
                {
                    contentType: 'image/png',
                    contentUrl: `${bike.image}`
                }
            ]
        }; 
        // CardFactory.heroCard(
        //     `${bike.name}
        // \nMarca: ${bike.brand}
        // \nPreço:R$ ${bike.price}`,
        //     CardFactory.images([`${bike.image}`]),
        //     length <= 1
        //     ? ['Mais Informações sobre a bicicleta', 'Explorar outro filtro de pesquisa']
        //     : ['Mais Informações sobre a bicicleta', 'Ver Próxima opção de bicicleta', 'Explorar outro filtro de pesquisa']
            
        // );
    },
    /**
     * Build card with bike description
     * @param {object} bike - bike information 
     * @returns {CardFactory}  Card with bike description
     */
    descriptionCard: (bike,length) => {
        return CardFactory.heroCard(
            `${bike.name}`, `${bike.description}`, CardFactory.images([`${bike.image}`])
        );
    },

}
