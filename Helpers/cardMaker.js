const {  CardFactory } = require('botbuilder');

module.exports = {
    /**
     *  Build card complete with information about the bike 
     * @param {object} bike - bike information 
     * @returns {CardFactory} Build full card
     */
    fullCard: (bike)=>{
    return CardFactory.heroCard(
        `${bike.name}
        \nMarca: ${bike.brand}
        \nPreço:R$ ${bike.price}`,
        CardFactory.images([`${bike.image}`]),
        ['Mais Informacoes sobre a bicicleta','Ver Proxima opção de bicicleta','Explorar outro filtro de pesquisa']
    );
},
    /**
     * Build card with bike description
     * @param {object} bike - bike information 
     * @returns {CardFactory}  Card with bike description
     */
    descriptionCard: (bike)=>{
    return CardFactory.heroCard(
        `${bike.name}`,`${bike.description}`, CardFactory.images([`${bike.image}`]),
        ['Ver Proxima opcao de bicicleta','Explorar outro filtro de pesquisa','Encerrar']
    );
},

}
