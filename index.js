const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const MenuItem = require('./schema');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Create Menu Item
app.post('/menu', async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and Price are required',
      });
    }
    const newMenuItem = new MenuItem({ name, description, price });
    await newMenuItem.save();
    res.status(201).json({
      success: true,
      message: 'New menu item created successfully',
      data: newMenuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating menu item',
      error: error.message,
    });
  }
});

// Get All Menu Items
app.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json({
      success: true,
      data: menuItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching menu items',
      error: error.message,
    });
  }
});

// Update Menu Item
app.put('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      id,
      { name, description, price },
      { new: true, runValidators: true }
    );
    if (!updatedMenuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: updatedMenuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating menu item',
      error: error.message,
    });
  }
});

// Delete Menu Item
app.delete('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMenuItem = await MenuItem.findByIdAndDelete(id);
    if (!deletedMenuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting menu item',
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
