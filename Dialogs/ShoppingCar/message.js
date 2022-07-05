const { ChoiceFactory } = require('botbuilder-dialogs');
/**
 * Messages dialog ShoppingCar
 */
 module.exports = {
    bikeAdd:' foi adicionada ao carrinho de compras',
    messageRegisterOrChange: 'Boa escolha! Falta pouco para você finalizar a compra da sua bicicleta ',
    continueBuy: {
        prompt: `O que você deseja fazer agora ?`,
        choices: ChoiceFactory.toChoices(['Finalizar pedido', 'Continuar comprando']),
        retryPrompt: 'Não entendi. Para continuarmos, você precisa me indicar o que deseja'
    },
    changesInCart : {
        prompt: `O que você deseja fazer então ?`,
        choices: ChoiceFactory.toChoices(['Retirar um item do carrinho', 'Adicionar mais bicicletas ao carrinho','Desistir Compra']),
        retryPrompt: 'Não entendi. Para continuarmos, você precisa me indicar o que deseja'
    },
    paymentMethod : {
        prompt: `Escolha o método de pagamento`,
        choices: ChoiceFactory.toChoices(['Boleto', 'Pix','Cartão de Crédito']),
        retryPrompt: 'Não entendi. Para continuarmos, você precisa me indicar o que deseja'
    },
    proceedBuy: {
        prompt: `Posso confirmar e prosseguir com sua compra ?`,
        retryPrompt: 'Não entendi. Para continuarmos, você precisa me indicar o que deseja'
    }
   
}