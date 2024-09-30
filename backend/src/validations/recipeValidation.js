import { body, param } from 'express-validator';

// Validación para la receta principal
export const recipeValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title should be a string')
    .isLength({ min: 5 })
    .withMessage('Title should be at least 5 characters'),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description should be a string'),

  body('is_premium')
    .isBoolean()
    .withMessage('Is premium should be a boolean'),

  body('steps')
    .isArray({ min: 1 })
    .withMessage('At least one step is required')
    .custom((steps) => {
      if (!steps.every(step => typeof step === 'object' && 'description' in step && typeof step.description === 'string' && step.description.length > 0)) {
        throw new Error('Each step should be a non-empty object with a "description" field');
      }
      return true;
    }),

  // Validación para los ingredientes
  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('At least one ingredient is required'),

  body('ingredients.*.ingredient_name')
    .notEmpty()
    .withMessage('Ingredient name is required')
    .isString()
    .withMessage('Ingredient name should be a string'),

  body('ingredients.*.quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isString()
    .withMessage('Quantity should be a string'),
];

// Validador para actualizaciones parciales de receta (PATCH)
export const recipeValidatorPatch = [
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Title cannot be empty if provided')
    .isString()
    .withMessage('Title should be a string'),

  body('description')
    .optional()
    .notEmpty()
    .withMessage('Description cannot be empty if provided')
    .isString()
    .withMessage('Description should be a string'),

  body('is_premium')
    .optional()
    .isBoolean()
    .withMessage('Is premium should be a boolean'),

  body('steps')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Steps are required if provided')
    .custom((steps) => {
      if (!steps.every(step => typeof step === 'object' && 'description' in step && typeof step.description === 'string' && step.description.length > 0)) {
        throw new Error('Each step should be a non-empty object with a "description" field');
      }
      return true;
    }),

  body('ingredients')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Ingredients are required if provided'),

  body('ingredients.*.ingredient_name')
    .optional()
    .notEmpty()
    .withMessage('Ingredient name is required if provided')
    .isString()
    .withMessage('Ingredient name should be a string'),

  body('ingredients.*.quantity')
    .optional()
    .notEmpty()
    .withMessage('Quantity is required if provided')
    .isString()
    .withMessage('Quantity should be a string'),
];

// Validador para ID (cuando se requiere un ID en la URL)
export const idValidator = [
  param('id').isInt().withMessage('Invalid ID'),
];
