const { ChoiceFactory } = require('botbuilder-dialogs');
/**
 * Messages dialog Price
 */
module.exports = {

    messageError:'Infelizmente não encontramos nenhuma bicicleta com essas caracteristicas. Pesquise por outra categoria de filtro',
    choosePrice: {
        prompt: `Quanto você pretende investir na sua bicicleta?🚲Escolha entre as faixas de preço abaixo:`,
        choices: ChoiceFactory.toChoices(['Até R$ 500,00', 'De R$ 500,00 até R$ 1500,00', 'De R$ 1500,00 até R$ 3000,00', 'Mais de R$ 3000', 'Outro filtro']),
        retryPrompt: 'Não entendi. Para continuarmos, você precisa me indicar qual sua escolha'
    }
}
