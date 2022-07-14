const { ChoiceFactory } = require('botbuilder-dialogs');
/**
 * Messages dialog Price
 */
module.exports = {

    messageError:'Infelizmente não encontramos nenhuma bicicleta com essas caracteristicas. Pesquise por outra categoria de filtro',
    choosePrice: ChoiceFactory.list(['Até R$ 500,00', 'De R$ 500,00 até R$ 1500,00', 'De R$ 1500,00 até R$ 3000,00', 'Mais de R$ 3000', 'Outro filtro']
    ,`Quanto você pretende investir na sua bicicleta?🚲Escolha entre as faixas de preço abaixo:`,
    'Não entendi. Para continuarmos, você precisa me indicar qual sua escolha',{includeNumbers:false})
    
}
