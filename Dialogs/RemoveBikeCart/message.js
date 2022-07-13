
module.exports = {
    msgItemsCart: 'Estes são os itens atuais do seu carrinho de compras:\n',
    /**
     * Returns a prompt with bike names
     * @param {String} namesBike names of bikes in cart
     * @returns {object} Prompt
     */
    selectItem: (namesBike) => {
        return {
            prompt: `Digite o número da opção que deseja retirar do seu carrinho`,
            retryPrompt: `Desculpe, não entendi. Para retirar do carrinho, eu preciso do número de uma das opções abaixo:\n ${namesBike}`
        }
    },
    /**
     * Put the names of the bikes the cart just one string
     * @param {object[]} bikes Bikes in cart 
     * @returns String
     */
    namesBike: (bikes) => {
        let names = '';
        let count = 0;
        bikes.map((bike) => {
            names += `${++count}. ${bike.name}\n`
        })
        return names;

    },
}