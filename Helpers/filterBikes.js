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
    return bikes.filter((bike)=>{
        if(bike[filterCategory] == value){
            return bike;
        }
    })
}