const cartModel = require('../models/cartModel')

exports.fetchCartByUser = async (req, res) => {
  try {
    const cartItems=await cartModel.findOne({_id:req.body.userId}).populate('products')

    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json(err);
  }
};
//Working
exports.addToCart = async (req, res) => {
  const {userId} = req.body;
  const cart = new cartModel({...req.body,user});
  try {
    const doc = await cart.save();
    const result = await doc.populate('products');
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteFromCart = async (req, res) => {
    const { id } = req.params;
    try {
    const doc = await cartModel.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await cartModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const result = await cart.populate('products');

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};