const mongoose = require('mongoose');
const {Schema}=mongoose
const bcrypt = require('bcryptjs');

const adminSchema = new Schema({
    userName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone:{type:String,unique:true,required:true},
    gender:{type:String,required:true},
});

adminSchema.pre('save', async function (next) {
    // Hash password before saving
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});



module.exports = mongoose.model('admin', adminSchema);

