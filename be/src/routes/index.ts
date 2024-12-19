import { Router } from "express";
import controllers from "../controllers";
import { cashValidation, productValidation, transactionValidation } from "../middleware/validator";

const router = Router()
const { productController, transactionController, cashController } = controllers

// product routes
router.get('/products', productController.getAllProducts.bind(productController))
router.get('/products/:id', productController.getProductById.bind(productController))
router.post('/products', productController.createProduct.bind(productController))
router.patch('/products/:id', productValidation.update, productController.updateProductById.bind(productController))

// cash routes
router.get('/cash-inventory', cashController.getAllCashes.bind(cashController))
router.patch('/cash-inventory/:id', cashValidation.update, cashController.updateCashById.bind(cashController))

// transaction routes
router.post('/transactions', transactionValidation.purchase, transactionController.purchase.bind(transactionController))

export default router
