const { ChoiceFactory } = require('botbuilder-dialogs');
/**
 * Messages dialog ShowBikes
 */
module.exports = {
    message:`Infelizmente não encontramos mais nenhuma bicicleta com essas caracteristicas. Pesquise por outra categoria de filtro`,
    erro: `Encontramos um erro. Tente novamente`,
    confirmBuy: {
        prompt: `Quer comprar esta bicicleta agora ?`,
        retryPrompt: 'Não entendi. Para continuarmos, você precisa me indicar se deseja comprar a bicicleta'
    },
    nextStepPromptNoOption:ChoiceFactory.suggestedAction(['Explorar outro filtro de pesquisa', 'Encerrar'],`O que você deseja fazer entao ?`),
    nextStepPrompt: ChoiceFactory.suggestedAction(['Ver Proxima opcao de bicicleta', 'Outro filtro de pesquisa', 'Encerrar'],`O que você deseja fazer entao ?`)
    
   
}