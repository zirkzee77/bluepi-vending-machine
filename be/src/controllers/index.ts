import { ProductRepository } from "../repositories/product.repository"
import { ProductService } from "../services/product.service"
import { ProductController } from "./product.controller"
import { CashRepository } from "../repositories/cash.repository"
import { CashService } from "../services/cash.service"
import { TransactionService } from "../services/transaction.service"
import { TransactionController } from "./transaction.controller"
import { CashController } from "./cash.controller"

const initControllers = () => {
  // repositories
  const productRepository = new ProductRepository()
  const cashRepository = new CashRepository()

  // services
  const productService = new ProductService(productRepository)
  const cashService = new CashService(cashRepository)
  const transactionService = new TransactionService(productService, cashService)

  // controllers
  const productController = new ProductController(productService)
  const transactionController = new TransactionController(transactionService)
  const cashController = new CashController(cashService)

  return {
    productController,
    transactionController,
    cashController
  }
}

const controllers = initControllers()

export default controllers
