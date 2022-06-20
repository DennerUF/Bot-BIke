const { ChoiceFactory } = require('botbuilder-dialogs');
/**
 * Messages dialog Type
 */
module.exports = {
    message:'Boa Escolha! Vem comigo para selecionar a sua magrela🚲',
    messageError:'Infelizmente não encontramos nenhuma bicicleta com essas caracteristicas. Pesquise por outra categoria de filtro',
    chooseType: {
        prompt: `Qual opção está procurando ?`,
        choices: ChoiceFactory.toChoices(['Infantil', 'Casual', 'Estrada', 'Mountain Bike', 'Elétrica', 'Outro filtro']),
        retryPrompt: 'Não entendi. Para continuarmos, você precisa me indicar qual sua escolha'
    }
}