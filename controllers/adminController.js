const adminModel=require('../models/adminModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
dotenv.config();

module.exports.adminSignup = async (req, res) => {
    const { userName, email, password, phone, gender, adminSecret } = req.body;
  
    try {
      if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ message: 'Invalid admin secret' });
      }
  
      const existingAdmin = await adminModel.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists' });
      }
  
      const admin = new adminModel({ userName, email, password, phone, gender });
      await admin.save();
  
      const token = jwt.sign({ adminId: admin._id }, process.env.ADMIN_SECRET, { expiresIn: '1h' });
  
      res.status(201).json({ message: 'Admin created successfully', token, adminId: admin._id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

module.exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const adminToken = jwt.sign({ adminId: admin._id }, process.env.ADMIN_SECRET, { expiresIn: '1h' });

        res.send({ message: 'Login successful', adminToken ,adminId:admin._id});
        console.log(req.body)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

  
  
  



