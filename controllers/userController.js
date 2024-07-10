const userModel=require('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
dotenv.config();

module.exports.signup = async (req, res) => {
    const { name, email, password ,phone,gender} = req.body;

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const user = new userModel({ name, email, password ,phone,gender});
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User created successfully', token ,userId:user._id});
        console.log(req.body)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const userToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.send({ message: 'Login successful', userToken ,userId:user._id});
        console.log(req.body)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
module.exports.addToCart=async(req,res)=>{
    try{
        const {userId,productId,quantity}=req.body
        const user=await userModel.findById(userId)
        const existingProduct=user.cartProducts?.find(item=>item.productId===productId)
        if(existingProduct){
            res.send({code:201,message:"Products already exist just go to cart and update the quantity"})
            console.log("Already exist")
        }
        else{
            const updatedUser = await userModel.findOneAndUpdate(
                { _id: userId },
                { $addToSet: { cartProducts: { productId, quantity } } },
                { new: true } // Return the updated user document
              );
              console.log("New product added to cart");
              res.send({ code: 200, message: "New product added to cart" });

        }
            
          }
    catch(error){
        console.error(error);
      return res.status(500).send({ code: 500, message: "Server error" });
    }
    
  }
module.exports.updateQuantiy=async(req,res)=>{
    try{
        const {userId,productId,quantity}=req.body
        const user=await userModel.findById(userId)
        const existingProduct=user.cartProducts.find(item=>item.productId==productId)
        if(existingProduct){
            const updateUserCart=await userModel.findOneAndUpdate(
                {_id:userId,'cartProducts.productId':existingProduct.productId},
                { $inc: { "cartProducts.$.quantity": quantity } },
                { new: true }
            )
            console.log("Product Quantity successfully")
            res.send({code:200,mesage:"Product quantity updated successfully"})
        }
        else{
            return res.send({code:404,message:"Product not found"})
        }

    }
    catch(error){
        res.send({code:500,message:'Server Error'})
        console.log(error)

    }
}
module.exports.getCartItem=async (req,res)=>{
    console.log(req.body.userId)
    const data=await userModel.findOne({_id:req.body.userId}).populate('cartProducts.productId')
    console.log(data)
    if(data){
        res.send({code:200,message:"Get cart item succefully",data:data})
    }
    else{
        res.send({code:500,message:"Server Error"})
    }
}
module.exports.deleteCartItem=async(req,res)=>{
    try {
        const { userId, productId } = req.body;
        const updateUserCart = await userModel.findOneAndDelete(
          { _id: userId },
          { $pull: { cartProducts: { productId } } },
          { new: true }
        );
    
        if (!updateUserCart) {
          return res.send({ code: 404, message: "User not found" });
        }
    
        console.log("Product Deleted successfully");
        res.send({ code: 200, message: "Product Deleted successfully" });
      } catch (error) {
        console.error(error);
        res.send({ code: 500, message: 'Server Error' });
      }
}


