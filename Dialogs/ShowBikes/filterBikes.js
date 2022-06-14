const searchBikes = require('./searchBikes');
module.exports = async (filter,value)=>{
    let bikes = await searchBikes();
    return bikes.filter((bike)=>{
        if(bike[filter] == value){
            return bike;
        }
    })
}