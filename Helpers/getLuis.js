

module.exports = {
    /**
     * Returns highest scoring intent
     * @param {*} context.luisResult 
     * @returns Uppercase high-scoring intent
     */
     getTopIntent({luisResult}){
        return !luisResult ? false : luisResult.prediction.topIntent.toUpperCase();
    },
    /**
     * Returns recognized entities
     * @param {*} context.luisResult 
     * @returns recognized entities
     */
     getEntities({entities}){
        return !entities ? false : entities;
    }
}