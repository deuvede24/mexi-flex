import { param, body } from 'express-validator';

export const idValidator = [
    param('id').isInt().withMessage('Invalid ID')
]

export const nameValidator = [
    body('name').isString().withMessage('Invalid Name file')
]
