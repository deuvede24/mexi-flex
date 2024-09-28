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

  // Validación para las versiones
  body('versions')
    .isArray({ min: 1 })
    .withMessage('At least one version is required'),

  // Validación para cada versión dentro de versiones
  body('versions.*.version_name')
    .notEmpty()
    .withMessage('Version name is required')
    .isString()
    .withMessage('Version name should be a string'),
  
  body('versions.*.steps')
    .isArray({ min: 1 })
    .withMessage('Steps are required for each version')
    .custom((steps) => {
      // Validamos que cada paso sea un objeto con una propiedad 'descripcion' no vacía
      if (!steps.every(step => typeof step === 'object' && 'descripcion' in step && typeof step.descripcion === 'string' && step.descripcion.length > 0)) {
        throw new Error('Each step should be a non-empty object with a "descripcion" field');
      }
      return true;
    }),

  // Validación para los ingredientes de cada versión
  body('versions.*.ingredients')
    .isArray({ min: 1 })
    .withMessage('Ingredients are required for each version'),

  body('versions.*.ingredients.*.ingredient_name')
    .notEmpty()
    .withMessage('Ingredient name is required')
    .isString()
    .withMessage('Ingredient name should be a string'),

  body('versions.*.ingredients.*.imperial_quantity')
    .notEmpty()
    .withMessage('Imperial quantity is required')
    .isString()
    .withMessage('Imperial quantity should be a string'),

  body('versions.*.ingredients.*.metric_quantity')
    .notEmpty()
    .withMessage('Metric quantity is required')
    .isString()
    .withMessage('Metric quantity should be a string'),
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

  body('versions')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one version is required if provided'),

  body('versions.*.version_name')
    .optional()
    .notEmpty()
    .withMessage('Version name is required if provided')
    .isString()
    .withMessage('Version name should be a string'),
  
  body('versions.*.steps')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Steps are required for each version if provided')
    .custom((steps) => {
      if (!steps.every(step => typeof step === 'object' && 'descripcion' in step && typeof step.descripcion === 'string' && step.descripcion.length > 0)) {
        throw new Error('Each step should be a non-empty object with a "descripcion" field');
      }
      return true;
    }),

  body('versions.*.ingredients')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Ingredients are required for each version if provided'),

  body('versions.*.ingredients.*.ingredient_name')
    .optional()
    .notEmpty()
    .withMessage('Ingredient name is required if provided')
    .isString()
    .withMessage('Ingredient name should be a string'),

  body('versions.*.ingredients.*.imperial_quantity')
    .optional()
    .notEmpty()
    .withMessage('Imperial quantity is required if provided')
    .isString()
    .withMessage('Imperial quantity should be a string'),

  body('versions.*.ingredients.*.metric_quantity')
    .optional()
    .notEmpty()
    .withMessage('Metric quantity is required if provided')
    .isString()
    .withMessage('Metric quantity should be a string'),
];

// Validador para ID (cuando se requiere un ID en la URL)
export const idValidator = [
  param('id').isInt().withMessage('Invalid ID'),
];
