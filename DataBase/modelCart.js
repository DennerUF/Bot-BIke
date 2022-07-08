const mongoose = require('mongoose');

const Cart = mongoose.model('cart', {
    id: String,
    idBike: Number
});

module.exports = Cart;