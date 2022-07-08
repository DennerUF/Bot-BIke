const mongoose = require('mongoose');

const Cart = mongoose.model('cart', {
    id: { type: String },
    bikes:[
        { 
            idbike: Number,
            name:String,
            price:Number
        }
    ]
});

module.exports = Cart;