const { ChoiceFactory, ListStyle } = require('botbuilder-dialogs');
/**
 * Messages dialog ShoppingCar
 */
module.exports = {
    bikeAdd: ' foi adicionada ao carrinho de compras',
    messageRegisterOrChange: 'Boa escolha! Falta pouco para você finalizar a compra da sua bicicleta ',
    continueBuy: {
        prompt: `O que você deseja fazer agora ?`,
        choices: [
            { value: 'Finalizar pedido', synonyms: ['finalizar','terminar','concluir'] }, 
            { value: 'Continuar comprando', synonyms: ['continuar'] }],       
        retryPrompt: 'Não entendi. Para continuarmos, você precisa me indicar o que deseja'
    },
    changesInCart: {
        prompt: `O que você deseja fazer então ?`,
        choices: ['Retirar um item do carrinho', 'Adicionar mais bicicletas ao carrinho', 'Desistir Compra'],
        retryPrompt: 'Não entendi. Para continuarmos, você precisa me indicar o que deseja'
    },
    paymentMethod: {
        prompt: `Escolha o método de pagamento`,
        choices: [
            { value: 'Boleto', synonyms: ['boleto'] }, 
        { value: 'Pix', synonyms: ['pix'] },
        { value: 'Cartão de Crédito', synonyms: ['cartao','cartão','credito','crédito'] }
    ],
        retryPrompt: 'Não entendi. Para continuarmos, você precisa me indicar o que deseja'
    },
    proceedBuy: {
        prompt: `Posso confirmar e prosseguir com sua compra ?`,
        retryPrompt: 'Não entendi. Para continuarmos, você precisa me indicar o que deseja'
    },
    /**
     * Organize shopping cart data
     * @param {object[]} bikes Bikes in the cart
     * @param {String} channel Message channel
     * @returns {String} Shopping cart details
     */
    dataPurchase: (bikes, channel) => {
        const now = new Date();
        let month = (now.getMonth() + 1).toString();
        month = month.length == 1 ? `0${month}` : month;
        let price = 0;
        let msg = `Este é o seu carrinho de compras. Os valores são válidos para ${now.getDate()}/${month}/${now.getFullYear()}\n\nProdutos:`
        bikes.map((bike) => {
            price += bike.price
            msg += `\n Bicicleta ${bike.name}`
        })
        msg += (channel === 'whatsapp')
            ? `\n\n*Valor Total*: R$${price.toLocaleString('pt-br', { minimumFractionDigits: 2 })}`
            : `\n\n**Valor Total**: R$${price.toLocaleString('pt-br', { minimumFractionDigits: 2 })}`;
        return msg;
    }

}