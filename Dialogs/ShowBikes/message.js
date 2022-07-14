const { ChoiceFactory } = require('botbuilder-dialogs');
/**
 * Messages dialog ShowBikes
 */
module.exports = {
    message:`Infelizmente não encontramos mais nenhuma bicicleta com essas caracteristicas. Pesquise por outra categoria de filtro`,
    erro: `Encontramos um erro. Tente novamente`,
    confirmBuy: {
        prompt: `Quer comprar esta bicicleta agora ?`,
        retryPrompt: 'Não entendi. Para continuarmos, você precisa me indicar se deseja comprar a bicicleta',
        options:{includeNumbers:false}
    },
    /**
     * Returns a question with suggested answers
     * @param {Number} length 
     * @param {String} channel Message channel  
     * @returns String
     */
    nextStepPrompt: (length, channel) =>{
        if(length <= 1){
            return (channel === 'whatsapp')
            ? `O que você deseja fazer entao ?\n \n_-Explorar outro filtro de pesquisa_\n_-Encerrar_`
            : ChoiceFactory.suggestedAction(['Explorar outro filtro de pesquisa', 'Encerrar'],`O que você deseja fazer entao ?`)
        }
            return (channel === 'whatsapp')
            ? `O que você deseja fazer entao ?\n \n_-Explorar outro filtro de pesquisa_\n_-Outro filtro de pesquisa__\n_-Encerrar_`
            : ChoiceFactory.suggestedAction(['Ver Proxima opcao de bicicleta', 'Outro filtro de pesquisa', 'Encerrar'],`O que você deseja fazer entao ?`)
    }
    
   
}