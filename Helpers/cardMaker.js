const { CardFactory } = require('botbuilder');

module.exports = {
    /**
     *  Build card complete with information about the bike 
     * @param {object} bike - bike information 
     * @returns {CardFactory} Build full card
     */
    fullCard: (bike,length) => {
        return{
            type: 'button',
            header:{
                type:'image',
                text: 'image',
                image:{
                    link:`${bike.image}`,
                    provider:{
                        name:'internet'
                    }
                }
            },
            body:{
                text:`${bike.name} \nMarca: ${bike.brand} \nPreço:R$ ${bike.price}`,
            },
            action:{
                buttons:[
                    {
                        type:'reply',
                        reply:{
                            id:'1',
                            title: 'Mais Informações sobre a bicicleta'
                        }
                    },
                    {
                        type:'reply',
                        reply:{
                            id:'2',
                            title: 'Ver Próxima opção de bicicleta'
                        }
                    },
                    {
                        type:'reply',
                        reply:{
                            id:'3',
                            title: 'Explorar outro filtro de pesquisa'
                        }
                    }
                ]
            }
            
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
