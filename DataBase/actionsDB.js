
const Cart = require('./modelCart');
module.exports = {
    async alreadyCreated(id){
        const result = await Cart.find({id: id});
        return result.length <= 0;
    },
    async insert(id,idBike,name, price){
        try {
            return await Cart.create({id: id, bikes: [{idBike: idBike, name: name, price:price}]});
        } catch (error) {
            if(error){
                return error;
            }
        }
    },
    async addBike(id,idBike,name, price){
        try {
            return Cart.findOneAndUpdate({ id:id }, { $push:{bikes: [{idBike: idBike, name: name, price:price}]} })
        } catch (error) {
            if(error){
                return error;
            }
        }
    },
    async removeBike(id,_id){
        try {
            return Cart.findOneAndUpdate({ id:id }, { $pull:{bikes: {_id}} })
        } catch (error) {
            if(error){
                return error;
            }
        }
    },
    async removeCart(id){
        try {
            return Cart.deleteOne({ id:id })
        } catch (error) {
            if(error){
                return error;
            }
        }
    },
    async findBikes(id){
        try {
            const result = await Cart.find({id: id});
            return result[0].bikes;
        } catch (error) {
            if(error){
                return error;
            }
        }
    },

}