module.exports = {
    /**
     * Returns highest scoring intent
     * @param context Dialog context
     * @returns Uppercase high-scoring intent
     */
     getTopIntent({luisResult}){
        return !luisResult ? false : luisResult.prediction.topIntent.toUpperCase();
    },
    /**
     * Returns recognized entities
     * @param context Dialog context
     * @returns Recognized entities
     */
     getEntities({entities}){
        return !entities ? false : entities;
    }
}