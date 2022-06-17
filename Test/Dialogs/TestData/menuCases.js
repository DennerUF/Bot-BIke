module.exports = [
    {
        name: 'Caminho certo',
        steps: [
            ['ola', `Escolha um dos filtros para pesquisar pela bicicleta:\n
   1. Tipo
   2. Cor
   3. Gênero
   4. Preço`], ['tipo', 'Boa Escolha! Vem comigo para selecionar a sua magrela🚲']
        ],
        expectedStatus: 'waiting',
        expeResult: ''
    },
    {
        name: 'Testando Fallback',
        steps: [
            ['ola', `Escolha um dos filtros para pesquisar pela bicicleta:\n
   1. Tipo
   2. Cor
   3. Gênero
   4. Preço`], ['bola', `Não entendi. Para continuarmos, você precisa me indicar qual sua escolha

   1. Tipo
   2. Cor
   3. Gênero
   4. Preço`], ['bola', `Não entendi. Para continuarmos, você precisa me indicar qual sua escolha

   1. Tipo
   2. Cor
   3. Gênero
   4. Preço`], ['bola', `Sinto muito,ainda estou aprendendo e no momento não consigo entender o que você deseja. Mas podemos tentar conversar novamente mais tarde!`]
        ],
        expectedStatus: 'complete',
        expeResult: ''
    }
]