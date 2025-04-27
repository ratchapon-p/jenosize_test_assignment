import express from 'express'
import { body, param, query } from 'express-validator'
import { getCalculateTotalProductPrice, createProduct, getProductList } from '../models/products.js';

const productRouter = express.Router()

const validateCreateProductReq = [
    body('product_name').exists({ checkFalsy: true }).withMessage('Product name is required').isLength({ max: 255 }).withMessage('Product name too long'),
    body('stock_quantity').exists().withMessage('Stock quantity is required').isInt().withMessage('Stock quantity must be an integer').toInt(),
    body('price').isDecimal({ decimal_digits: '0,2' }).withMessage('Price must be a decimal number with up to 2 decimal places')
    .custom(value => {
      const decimalValue = parseFloat(value);
      if (isNaN(decimalValue)) {
        throw new Error('Price must be a valid number');
      }
      return true;
    }),
]

const validGetProductList = [
  query('sorting'),
  query('sorttype'),
  query('search'),
  query('filterdata'),
  query('offset'),
  query('limit'),
]

const validateProductId = [
  param('product_id').isInt().toInt()
]

//? route โดยใช้ express validator เพื่อกัน injection ในระดับหนึ่งและ เอาไว้ validate ค่าที่ได้รับมา
productRouter.post("/", validateCreateProductReq,createProduct)
productRouter.get("/",validGetProductList, getProductList)
productRouter.get("/:product_id",validateProductId, getCalculateTotalProductPrice)

export default productRouter