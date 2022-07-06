
module.exports = {
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
    completedPurchase: 'Parabéns! Você acabou de finalizar a sua compra. Este é o número do seu pedido : 100',
    changePurchaseData: {
        prompt: 'Qual informação que deseja alterar ?',
        retryPrompt: `Não entendi qual dado deseja alterar. Para facilitar, você pode dizer o número da opção de 1 a 9`
    },
    messageChange: (data) => {
        return {
            prompt: `Me informe novamente ${data}`
        }
    }

}