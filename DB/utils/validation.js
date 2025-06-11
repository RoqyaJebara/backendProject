import Joi from "joi";
import { body, validationResult } from 'express-validator';

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password_hash: Joi.string()
    .min(8)
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$_%^&*])(?=.{8,})")
    )
    .message(
      "Password must contain at least one uppercase, one lowercase, one number and one special character"
    )
    .required(),
  role: Joi.string().valid("admin", "student", "instructor").default("student").required(), // Default role is 'user'
  oauth_provider: Joi.string().valid("google", "LMS").required(),
  oauth_id: Joi.string().valid('1', '2').required(), // Optional for OAuth users
  is_active: Joi.boolean().default(true).required(), // Default is active
 } );

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password_hash: Joi.string().required(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%_^&*])(?=.{8,})/)
    .required()
    .invalid(Joi.ref("currentPassword")) // Alternative to disallow
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase, one lowercase, one number and one special character",
      "any.invalid": "New password cannot be the same as current password",
    }),
});
//////////////////////////
// utils/validation.js


// Define schema for updating a user (all fields optional except id in URL)
export const updateUserSchema = Joi.object({
 name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password_hash: Joi.string()
    .min(8)
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$_%^&*])(?=.{8,})")
    )
    .message(
      "Password must contain at least one uppercase, one lowercase, one number and one special character"
    )
    .required(),
  role: Joi.string().valid("admin", "student", "instructor").default("student").required(), // Default role is 'user'
  oauth_provider: Joi.string().valid("google", "LMS").required(),
  oauth_id: Joi.string().valid('1', '2').required(), // Optional for OAuth users
  is_active: Joi.boolean().default(true).required(), // Default is active
});

///////////////////////
export const courseValidationRules = () => [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('instructor_id').isInt({ gt: 0 }).withMessage('Instructor ID must be a positive integer'),
  body('category_id').isInt({ gt: 0 }).withMessage('Category ID must be a positive integer'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('is_published').optional(),
  body('is_approved').optional(),
];

export const validateCourse = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  next();
};
export function parseBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return false; // default fallback
}


