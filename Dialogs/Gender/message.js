const { ChoiceFactory } = require('botbuilder-dialogs');
/**
 * Messages dialog Gender
 */
module.exports = {
    messageError:'Infelizmente não encontramos nenhuma bicicleta com essas caracteristicas. Pesquise por outra categoria de filtro',
    chooseGender: {
        prompt: `Legal ! Então me diz para quem é a magrela que você está procurando ?🚲`,
        choices: ['Unissex', 'Masculina', 'Feminina', 'Outro filtro'],
        retryPrompt: 'Não entendi. Para continuarmos, você precisa me indicar qual sua escolha'
    }
}