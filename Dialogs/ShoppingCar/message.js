const { ChoiceFactory } = require('botbuilder-dialogs');
/**
 * Messages dialog ShoppingCar
 */
 module.exports = {
    bikeAdd:' foi adicionada ao carrinho de compras',
    continueBuy: {
        prompt: `O que você deseja fazer agora ?`,
        choices: ChoiceFactory.toChoices(['Finalizar pedido', 'Continuar comprando']),
        retryPrompt: 'Não entendi. Para continuarmos, você precisa me indicar o que deseja'
    }
   
}