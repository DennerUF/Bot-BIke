const { ChoiceFactory } = require('botbuilder-dialogs');
module.exports = {
    message:'Boa escolha!Vem comigo para selecionar a sua magrela.🚲',
    chooseType: {
        prompt: `Qual opção está procurando ?`,
        choices: ChoiceFactory.toChoices(['Infantil', 'Casual', 'Estrada', 'Mountain Bike', 'Elétrica', 'Outro filtro']),
        retryPrompt: 'Não entendi. Para continuarmos, você precisa me indicar qual sua escolha'
    }
}