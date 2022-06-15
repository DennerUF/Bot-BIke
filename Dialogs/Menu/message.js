const { ChoiceFactory } = require('botbuilder-dialogs');
/**
 * Messages dialog menu
 */
module.exports = {
    choose: {
        prompt: 'Escolha um dos filtros para pesquisar pela bicicleta:',
        choices: ChoiceFactory.toChoices(['Tipo', 'Cor', 'Gênero', 'Preço']),
        retryPrompt: 'Não entendi. Para continuarmos, você precisa me indicar qual sua escolha'
    }
}