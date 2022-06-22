const {  CardFactory } = require('botbuilder');
/**
 * Build card complete with information about the bike 
 * Or just the description of the bike
 * @param {object} bike - bike information
 * @returns Object with two functions (fullCard ; descriptionCard)
 * fullCard : Build full card;
 * description Card : Build card with bike description;
 */
module.exports = {
    fullCard: (bike)=>{
    return CardFactory.heroCard(
        `${bike.name}
        \nMarca: ${bike.brand}
        \nPreço:R$ ${bike.price}`,
        CardFactory.images([`${bike.image}`]),
        ['Mais Informacoes sobre a bicicleta','Ver Proxima opção de bicicleta','Explorar outro filtro de pesquisa']
    );
},
    descriptionCard: (bike)=>{
    return CardFactory.heroCard(
        `${bike.name}`,`${bike.description}`,'',
        ['Ver Proxima opção de bicicleta','Explorar outro filtro de pesquisa','Encerrar']
    );
},

}