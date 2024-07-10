/* const mongoose=require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/quirk-cart',(()=>{
    if(!err){
        console.log("Database connected successfully")
    }
}));
 */
/* const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/quirk-cart';

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err)); */

  const mongoose = require('mongoose');
  const dotenv=require('dotenv')
  dotenv.config()

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('MongoDB connected successfully..........111....11111....1.11..1.1.1.1.'))
  .catch(err => console.error(err));