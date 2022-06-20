module.exports = [
    {
        name: 'Caminho certo - Infantil',
        steps: [
            ['tipo', 'Boa Escolha! Vem comigo para selecionar a sua magrela🚲'],
            ['Infantil',`Qual opção está procurando ?\n
   1. Infantil
   2. Casual
   3. Estrada
   4. Mountain Bike
   5. Elétrica
   6. Outro filtro`]
        ],
        expectedStatus: 'waiting',
        expeResult: ''
    },
    {
        name: 'Caminho errado - fallback',
        steps: [
            ['', 'Boa Escolha! Vem comigo para selecionar a sua magrela🚲'],
            ['bola',`Qual opção está procurando ?\n
   1. Infantil
   2. Casual
   3. Estrada
   4. Mountain Bike
   5. Elétrica
   6. Outro filtro`],
            ['bola',`Não entendi. Para continuarmos, você precisa me indicar qual sua escolha\n
   1. Infantil
   2. Casual
   3. Estrada
   4. Mountain Bike
   5. Elétrica
   6. Outro filtro`],
            ['bola',`Não entendi. Para continuarmos, você precisa me indicar qual sua escolha\n
   1. Infantil
   2. Casual
   3. Estrada
   4. Mountain Bike
   5. Elétrica
   6. Outro filtro`],
            ['bola',`Sinto muito,ainda estou aprendendo e no momento não consigo entender o que você deseja. Mas podemos tentar conversar novamente mais tarde!`],
        ],
        expectedStatus: 'waiting',
        expeResult: ''
    },

]