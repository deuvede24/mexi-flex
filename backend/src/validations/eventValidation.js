import { body } from 'express-validator';

export const eventValidator = [
  body('title')
    .notEmpty()
    .withMessage('El título es obligatorio')
    .isLength({ min: 3 })
    .withMessage('El título debe tener al menos 3 caracteres'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede tener más de 500 caracteres'),

  body('type')
    .notEmpty()
    .withMessage('El tipo de evento es obligatorio')
    .isIn(['receta', 'restaurante'])
    .withMessage('Tipo de evento no válido'),

  body('date')
    .notEmpty()
    .withMessage('La fecha es obligatoria')
    .isISO8601()
    .withMessage('La fecha debe estar en formato ISO (YYYY-MM-DD)')
];
