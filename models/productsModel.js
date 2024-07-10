const mongoose=require('mongoose')
const { Schema } = mongoose;

const productSchema = new Schema({
  title: String, 
  description: String,
  price: Number,
  size: String,
  stock: Number,
  color: String,
  brand: String,
  category: String,
  thumbnail: String,
  reviews:[{
    review:String,
    rating:Number,
    userId:String,
    
  }]
});

module.exports=mongoose.model("products",productSchema)

