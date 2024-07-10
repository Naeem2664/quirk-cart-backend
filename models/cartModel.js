const mongoose = require('mongoose');
const {Schema} = mongoose;


const cartSchema = new Schema({
    quantity: { type : Number, required: true},
    product: { type: Schema.Types.ObjectId, ref: 'products', required: true},
    userId:{ type: Schema.Types.ObjectId, ref: 'users', required: true},
    size: { type : Schema.Types.Mixed},
    color: { type : Schema.Types.Mixed},
})

 


exports.Cart = mongoose.model('cart',cartSchema)