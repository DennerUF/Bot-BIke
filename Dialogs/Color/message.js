const { ChoiceFactory } = require('botbuilder-dialogs');
/**
 * Messages dialog Color
 */
module.exports = {
    messageError:'Infelizmente não encontramos nenhuma bicicleta com essas caracteristicas. Pesquise por outra categoria de filtro',
    textPrompt: {
        prompt: 'Qual a cor que você quer para a sua bicicleta? 🚲',
        retryPrompt: 'Não entendi. Para continuarmos, você precisa me indicar qual sua escolha'
    },
    chooseColor: {
        prompt: `Escolha entre as cores abaixo`,
        choices: ['Branca', 'Preta', 'Azul', 'Rosa', 'Verde','Vermelha', 'Outro Cores'],
        retryPrompt: 'Não entendi. Para continuarmos, você precisa me indicar qual sua escolha'
    }
}