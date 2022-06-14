module.exports = async (stepContext) => {
    if (stepContext.result === 'finishDialog') {
        await stepContext.context.sendActivity(
        `Sinto muito,ainda estou aprendendo e
        no momento não consigo entender o
        que você deseja.Mas podemos tentar
        conversar novamente mais tarde!`);
        return true;
    }
    return false;
}