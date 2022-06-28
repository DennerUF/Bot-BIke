module.exports = {
    "topIntent": 'MENU',
    entities: {
        menu: ['Type'], 
        $instance: {
            type: 'menu', 
            text: 'Tipo', 
            startIndex: 0, 
            endIndex: 4, 
            modelType: 'List Entity Extractor'
        }
    },
    luisResult: {
        text: 'Tipo', 
        intents: {
            Menu: { score: 0.9195136 }
        }, 
        entities:{
            menu: ['Type'], 
            $instance: {
                type: 'menu', 
                text: 'Tipo', 
                startIndex: 0, 
                endIndex: 4, 
                modelType: 'List Entity Extractor'
            }
        }, 
        sentiment: undefined,
        luisResult: {
            query: 'Tipo', 
            prediction: {
                topIntent: 'Menu', 
                intents: {
                    Menu: { score: 0.9195136 }
                }, 
                entities: {
                    menu: ['Type'], 
                    $instance: {
                        type: 'menu', 
                        text: 'Tipo', 
                        startIndex: 0, 
                        endIndex: 4, 
                        modelType: 'List Entity Extractor'
                    }
                }
            }
        }
    }
}