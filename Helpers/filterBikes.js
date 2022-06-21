const searchBikes = require('./searchBikes');
/**
 * Filters bikes according to user-chosen characteristics
 * @param filterCategory Filter category
 * @param value Filter category value
 * @returns Selected bikes array
 */
module.exports = async (filterCategory,value)=>{
    
    let bikes = await searchBikes();
    if(!bikes){return false}
    if(filterCategory == 'price'){
        if(value.min && value.max){
            return bikes.filter((bike)=>{
                if(bike[filterCategory] > parseFloat(value.min) && bike[filterCategory] < parseFloat(value.max)){
                    return bike;
                }
            })
        }else if(value['priceMin']){
            return bikes.filter((bike)=>{
                if(bike[filterCategory] > parseFloat(value['priceMin'][0])){
                    return bike;
                }
            })
        }else{
            return bikes.filter((bike)=>{
                if(bike[filterCategory] < parseFloat(value['priceMax'][0])){
                    return bike;
                }
            })
        }
    }
    return bikes.filter((bike)=>{
        if(bike[filterCategory] == value){
            return bike;
        }
    })
}