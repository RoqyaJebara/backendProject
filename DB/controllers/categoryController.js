import * as Category from '../models/categoryModel.js';

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Get category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const newCategory = await Category.create(name);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const updated = await Category.update(req.params.id, name);
    if (!updated) return res.status(404).json({ error: 'Category not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Category not found' });

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};
