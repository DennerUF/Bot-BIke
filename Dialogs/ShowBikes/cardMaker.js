const {  CardFactory } = require('botbuilder');
module.exports = (bike)=>{
    return CardFactory.heroCard(
        `${bike.name}
        \nMarca: ${bike.brand}
        \nPreço:R$ ${bike.price}`,
        CardFactory.images([`${bike.image}`]),
        ['Mais Informações sobre a bicicleta','Ver Proxima opção de bicicleta','Explorar outro filtro de pesquisa']
    );
}