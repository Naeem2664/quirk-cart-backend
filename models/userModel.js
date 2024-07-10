const mongoose = require('mongoose');
const {Schema}=mongoose
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone:{type:String,unique:true,required:true},
    gender:{type:String,required:true},
    cartProducts: [{
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products', // Reference to the products model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // Optional validation for minimum quantity
        },
      }], // Array of ObjectIds
});

userSchema.pre('save', async function (next) {
    // Hash password before saving
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});



module.exports = mongoose.model('users', userSchema);

