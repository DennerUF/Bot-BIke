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
    changesInCart : ChoiceFactory.suggestedAction(['Retirar um item do carrinho', 'Adicionar mais bicicletas ao carrinho','Desistir Compra'],`O que você deseja fazer então ?`),
    paymentMethod : {
        prompt: `Escolha o método de pagamento`,
        choices: ChoiceFactory.toChoices(['Boleto', 'Pix','Cartão de Crédito']),
        retryPrompt: 'Não entendi. Para continuarmos, você precisa me indicar o que deseja'
    },
    proceedBuy: {
        prompt: `Posso confirmar e prosseguir com sua compra ?`,
        retryPrompt: 'Não entendi. Para continuarmos, você precisa me indicar o que deseja'
    },
    dataPurchase:(bikes)=>{
        const now = new Date();
        let month =(now.getMonth()+1).toString();
        month = month.length == 1 ? `0${month}` : month;
        let price = 0;
        let msg = `Este é o seu carrinho de compras. Os valores são válidos para ${now.getDate()}/${month}/${now.getFullYear()}\n`
        bikes.map((bike)=>{
            price+= bike.price
            msg+=`${bike.name}\n`
        })
        msg+= `Valor Total: R$${price.toLocaleString('pt-br', {minimumFractionDigits: 2})}`;
        return msg;
    }
   
}