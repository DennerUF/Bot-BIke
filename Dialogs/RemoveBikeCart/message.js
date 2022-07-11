
module.exports = {
    msgItemsCart: 'Estes são os itens atuais do seu carrinho de compras:\n',
    selectItem: (namesBike) => {
        return {
            prompt: `Digite o número da opção que deseja retirar do seu carrinho`,
            retryPrompt: `Desculpe, não entendi. Para retirar do carrinho, eu preciso do número de uma das opções abaixo:\n ${namesBike}`
        }
    },
    namesBike: (bikes) => {
        let names = '';
        let count = 0;
        bikes.map((bike) => {
            names += `${++count}. ${bike.name}\n`
        })
        return names;

    },
}