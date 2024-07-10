const productModel = require('../models/productsModel')
module.exports.addProducts = async (req, res) => {
    console.log(req.body, '10')
    const newProduct = new productModel(req.body)
    const isSaved = await newProduct.save()
    if (isSaved) {
        res.send("Saved!")
    }
    else {
        res.send("Failed to save")
    }

}

module.exports.getProducts=async (req,res)=>{
    const data= await productModel.find({})
    if(data.length>0){
        res.send({code:200,message:"Find successfully",data:data})
    }
    else if(data.length==0){
        res.send({code:404,message:"Data not Found"})
    }
    else(
        res.send({code:500,message:"Server Error!"})
    )
}

module.exports.updateOneProduct=async(req,res)=>{
    let data={}
    if(req.body.title){
        data["title"]=req.body.title
    }
    if(req.body.description){
        data["description"]=req.body.description
    }
    if(req.body.price){
        data["price"]=req.body.price
    }
    if(req.body.size){
        data["size"]=req.body.size
    }
    if(req.body.stock){
        data["stock"]=req.body.stock
    }
    if(req.body.color){
        data["color"]=req.body.color
    }
    if(req.body.brand){
        data["brand"]=req.body.brand
    }
    if(req.body.title){
        data["category"]=req.body.category
    }
    if(req.body.thumbnail){
        data["thumbnail"]=req.body.thumbnail
    }
    const id=req.body.id
    const filter={id:id}

    const newData=await productModel.findOneAndUpdate(filter,data,{new:true})
    if(newData){
        res.send({code:200,message:"Update Successfully",data:newData})
    }
    else{
        res.send({code:500,message:"Server Error"})
    }
}
module.exports.getProductById = async (req, res) => {
  const productId = req.params.id; // Use req.params.id
  console.log(req.params)
  try {
    const data = await productModel.findById(productId);
    if (data) {
      res.send({ code: 200, message: "Product Fetch Successfully", data: data });
    } else {
      res.status(404).send({ code: 404, message: "Product Not Found" });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send({ code: 500, message: "Internal Server Error" });
  }
};



  
  
module.exports.deleteProducts = async (req, res) => {
    console.log(req.body)
    const ids=req.body
    try {
        const response = await productModel.deleteMany({_id:{$in:ids}});
        if (response) {
          res.send({ code: 200, message: "Product Deleted Successfully", data: response });
        } else {
          res.status(404).send({ code: 404, message: "Product Not Found" });
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send({ code: 500, message: "Internal Server Error" });
      }
}


// API Route for Posting Reviews (assuming separate routes for other product actions)
module.exports.giveReview = async (req, res) => {
  const productId = req.params.id; // Use lowercase 'id'
  const { review, rating ,userId} = req.body;

  try {
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.reviews.push({ review, rating,userId }); // Add review to existing reviews array
    await product.save();
    console.log(product)

    res.status(201).json({ message: 'Review and rating submitted successfully' });
  } catch (error) {
    console.error('Error posting review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports.filteredProducts=async (req, res) => {
    const { color, size, brand, category } = req.query; // Get filter parameters from query string
  
    let filterQuery = {}; // Combine all filters using AND operator
  
    // Build filter query based on provided parameters
    if (color) {filterQuery.color = color;}
    if (size) {
      // Handle multiple size selections (use $in operator)
      filterQuery.size = { $in: size.split(',') }; // Split comma-separated values
    }
    if (brand) {
      // Case-insensitive brand matching
      filterQuery.brand = { $regex: new RegExp(brand, 'i') };
    }
    if (category){
        filterQuery.category = category;
    } 
  
    try {
      const filteredProducts = await Product.find(filterQuery);
      res.json(filteredProducts);
      console.log(filteredProducts)
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching products' });
    }
}