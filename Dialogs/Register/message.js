

module.exports = {
    promptCEP: {
        prompt: 'Vamos agora ao endereço de entrega. Por favor, digite o seu CEP!',
    },
    promptCity: {
        prompt: 'Não Localizaei o seu CEP. Mas não tem problema, é só me dizer a sua cidade junto da sigla do seu estado',
    },
    promptNumberHouse: {
        prompt: 'Anotado Aqui! Qual é o número da sua residência ?',
    },
    promptDistrict: {
        prompt: 'Ok, entendi. Qual o seu bairro? ',
    },
    promptComplement: {
        prompt: 'Se for o caso, informe também o complemento ',
    },
    promptAddress: {
        prompt: 'Agora me diga o seu endereço (sem o número)',
    },
    promptName: {
        prompt: 'Agora faltam poucas pedaladas para chegarmos ao final. Por favor, digite o seu nome completo.',
    },
    promptCPF: {
        prompt: 'Qual o seu CPF ?',
    },
    promptFone: {
        prompt: 'E o seu Telefone ?',
    },
    promptConfirm: {
        prompt: 'Todos os dados estão corretos ?',
    },
    messageConfirm: 'Para finalizarmos a compra, confirme os seus dados!',
    purchaseData: (data) => {
        return `
        Cep: ${data.cep}
        Cidade: ${data.city}
        Bairro: ${data.district}
        Endereço: ${data.address}
        Número: ${data.numberHouse}
        Complemento: ${data.complement}
        Nome: ${data.name}
        CPF: ${data.cpf}
        Telefone: ${data.fone}

    `
    },
    completedPurchase: 'Parabéns! Você acabou de finalizar a sua compra. Este é o número do seu pedido : 100'
}