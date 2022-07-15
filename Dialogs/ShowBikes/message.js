const { ChoiceFactory } = require('botbuilder-dialogs');
/**
 * Messages dialog ShowBikes
 */
module.exports = {
    message: `Infelizmente não encontramos mais nenhuma bicicleta com essas caracteristicas. Pesquise por outra categoria de filtro`,
    erro: `Encontramos um erro. Tente novamente`,
    confirmBuy: {
        prompt: `Quer comprar esta bicicleta agora ?`,
        retryPrompt: 'Não entendi. Para continuarmos, você precisa me indicar se deseja comprar a bicicleta',
    },
    /**
     * Returns a question with suggested answers
     * @param {Number} length  
     * @returns {object} choicePrompt
     */
    nextStepPrompt: (length) => {
        if (length <= 1) {
            return {
                prompt: `O que você deseja fazer entao ?`,
                choices: ['Explorar outro filtro de pesquisa', 'Encerrar'],
                retryPrompt: 'Não entendi. Para continuarmos, você precisa me indicar o que deseja'
            }
        }
        return {
            prompt: `O que você deseja fazer entao ?`,
            choices: ['Ver Próxima opcao de bicicleta', 'Outro filtro de pesquisa', 'Encerrar'],
            retryPrompt: 'Não entendi. Para continuarmos, você precisa me indicar o que deseja'
        }
    }
}