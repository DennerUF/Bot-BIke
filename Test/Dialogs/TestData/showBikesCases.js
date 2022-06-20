const cardMaker = require('../../../Helpers/cardMaker');
let bikes = {
    bikeTypeMountainBike: [
        {
            "id": 1,
            "name": "Dropp Z1-X",
            "brand": "DROPP BIKE",
            "price": 1745.52,
            "size": 15,
            "rim": 29,
            "gear": "21v",
            "description": "Z1-X Dropp é ideal para quem pretende começar a se aventurar em passeios, possui quadro em alumínio com várias opções de cores e tamanhos para que você possa escolher, o sistema de marchas possui 21 velocidades e câmbios com trocadores ez-fire index Dropp que oferecem ótimo desempenho em terrenos elevados. Já a suspensão dianteira 80mm com freio a disco proporciona muito mais segurança e tranquilidade nas frenagens.",
            "type": "Mountain bike",
            "suspension": "Dianteira",
            "gender": "Unissex",
            "color": "Amarelo",
            "image": "https://a-static.mlcdn.com.br/800x560/bicicleta-aro-29-dropp-z1-x-suspensao-e-freio-disco-21v-dropp-bike/egcommercecombr/29-273/220743cee525ce287768274d55bdba33.jpg"
        },
        {
            "id": 2,
            "name": "Caloi Andes",
            "brand": "Caloi",
            "price": 899.9,
            "size": 18,
            "rim": 26,
            "gear": "21v",
            "description": "Um esporte que vem ganhando adeptos ao longo do tempo é o ciclismo. Praticamente todas as grandes cidades do Brasil já possuem ciclovias, e não é raro vermos pessoas ir para o trabalho de bicicleta. Você pode tanto usar para ir trabalhar como para lazer também. A super bicicleta Andes da Caloi vai deixar os seus passeios muito mais emocionantes. Com 21 marchas e aro 26, ela é tipo MTB com suspensão dianteira e freios V-Brake em alumínio, o que proporciona mais conforto na hora de usá-la. Com um lindo design, perfeita para você pedalar por aí.",
            "type": "Mountain bike",
            "suspension": "Dianteira",
            "gender": "Unissex",
            "color": "Preto",
            "image": "https://a-static.mlcdn.com.br/800x560/mountain-bike-aro-26-caloi-andes-aco-freio-v-brake-21-marchas/magazineluiza/182391000/8e4539999b8a1ead560ae93de71828ad.jpg"
        },
    ]
}
module.exports = [
    {
        name: 'Caminho certo - bicicletas filtro tipo Mountain Bike',
        initialData: bikes.bikeTypeMountainBike,
        steps:
            [
                ['', [cardMaker(bikes.bikeTypeMountainBike[0])]],
                ['Ver Proxima opção de bicicleta', [cardMaker(bikes.bikeTypeMountainBike[1])]],
                ['Ver Proxima opção de bicicleta', 'Infelizmente não encontramos mais nenhuma bicicleta com essas caracteristicas. Pesquise por outra categoria de filtro'],
            ],
        expectedStatus: 'waiting',
        expeResult: ''
    },


]



