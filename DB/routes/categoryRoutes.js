import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';

const categoryRoutes = express.Router();

// GET /api/categories
categoryRoutes.get('/', getAllCategories);

// GET /api/categories/:id
categoryRoutes.get('/:id', getCategoryById);

// POST /api/categories
categoryRoutes.post('/', createCategory);

// PUT /api/categories/:id
categoryRoutes.put('/:id', updateCategory);

// DELETE /api/categories/:id
categoryRoutes.delete('/:id', deleteCategory);

export default categoryRoutes;
