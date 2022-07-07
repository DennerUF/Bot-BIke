
module.exports = {
    promptConfirm: {
        prompt: 'Todos os dados estão corretos ?',
    },
    messageConfirm: 'Para finalizarmos a compra, confirme os seus dados!',
    purchaseData: (data) => {
        return `
        1. Cep: ${data.cep}
        2. Cidade: ${data.cidade}
        3. Bairro: ${data.bairro}
        4. Endereço: ${data.endereco}
        5. Número: ${data.numero}
        6. Complemento: ${data.complemento}
        7. Nome: ${data.nome}
        8. CPF: ${data.cpf}
        9. Telefone: ${data.telefone}

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