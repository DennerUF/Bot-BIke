
const Cart = require('./modelCart');
module.exports = {
    /**
     * Check if shopping cart is already registered in the database
     * @param {String} id conversation id
     * @returns {Promise<boolean>} If chat already registered
     */
    async alreadyCreated(id){
        const result = await Cart.find({id: id});
        return result.length <= 0;
    },
    /**
     * Register shopping cart in the database
     * @param {String} id Conversation id
     * @param {String} idBike Bike id 
     * @param {String} name Name bike 
     * @param {Number} price Price bike
     * @returns {object} Registered data
     */
    async insert(id,idBike,name, price){
        try {
            return await Cart.create({id: id, bikes: [{idBike: idBike, name: name, price:price}]});
        } catch (error) {
            if(error){
                return error;
            }
        }
    },
    /**
     * Add bike to cart in database
     * @param {String} id Conversation id
     * @param {String} idBike Bike id 
     * @param {String} name Name bike 
     * @param {Number} price Price bike
     * @returns {object} Registered data
     */
    async addBike(id,idBike,name, price){
        try {
            return Cart.findOneAndUpdate({ id:id }, { $push:{bikes: [{idBike: idBike, name: name, price:price}]} })
        } catch (error) {
            if(error){
                return error;
            }
        }
    },
    /**
     * Remove bike from cart in database
     * @param {String} id Conversation id 
     * @param {String} _id bike id in database
     * @returns {object} changed data
     */
    async removeBike(id,_id){
        try {
            return Cart.findOneAndUpdate({ id:id }, { $pull:{bikes: {_id}} })
        } catch (error) {
            if(error){
                return error;
            }
        }
    },
    /**
     * Delete cart from database
     * @param {String} id Conversation id 
     * @returns 
     */
    async removeCart(id){
        try {
            return Cart.deleteOne({ id:id })
        } catch (error) {
            if(error){
                return error;
            }
        }
    },
    /**
     * Search for bikes in the shopping cart
     * @param {String} id Conversation id  
     * @returns {object[]} bikes
     */
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