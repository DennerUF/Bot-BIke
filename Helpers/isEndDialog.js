
module.exports = {
/**
 * Checks if the 'stepContext.result' of the dialog context is equal to "finishDialog". 
 * If yes, the user has reached the limit of three wrong answers
 * @param {TurnContext} dc Dialog context
 * @returns boolean
 */
    async isEndDialog(dc) {
        if (dc.result === 'finishDialog') {
            await dc.context.sendActivity(
                `Sinto muito,ainda estou aprendendo e no momento não consigo entender o que você deseja. Mas podemos tentar conversar novamente mais tarde!`);
            return true;
        }
        return false;
    },

}