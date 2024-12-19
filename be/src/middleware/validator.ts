import { body, param, validationResult } from 'express-validator'
import { NextFunction, Request, Response } from 'express'


const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
    return
  }
  next();
};


export const productValidation = {
  update: [
    param('id')
      .isInt()
      .withMessage('Invalid product ID'),
    body('stock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Stock must be a positive number'),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('name')
      .optional()
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Name cannot be empty'),
    validateRequest,
  ],
};

export const cashValidation = {
  update: [
    param('id').isInt().withMessage('Invalid cash inventory ID'),
    body('quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Quantity must be a positive number'),
    validateRequest
  ]

}

export const transactionValidation = {
  purchase: [
    body('productId')
      .isInt({ min: 1 })
      .withMessage('Invalid product ID'),
    body('insertedCash')
      .isArray()
      .withMessage('Inserted cash must be an array')
      .notEmpty()
      .withMessage('Must insert cash'),
    body('insertedCash.*.denomination')
      .isFloat({ min: 0 })
      .withMessage('Invalid denomination'),
    body('insertedCash.*.type')
      .isIn(['COIN', 'BANKNOTE'])
      .withMessage('Invalid cash type'),
    body('insertedCash.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1'),
    validateRequest
  ]
}
