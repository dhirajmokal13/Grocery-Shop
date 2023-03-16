import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import customerAndUser from '../controllers/customerAndUserController.js';
import productController from '../controllers/productController.js';
const router = express.Router();
import multer from 'multer';
import LoginVerify from '../middleware/LoginVerify.js';

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'public/product_image')
    },
    filename: function (req, file, callback) {
      callback(null, Date.now() + "-" + file.originalname)
    }
  })
}).single('img');

router.post('/registeruser', customerAndUser.registerCustomer);
router.post('/registerseller', customerAndUser.registerseller);
router.post('/loginCustomer', customerAndUser.loginCustomer);
router.post('/loginseller', customerAndUser.loginseller);
router.post('/getotp', customerAndUser.getOtp);
router.get('/search/:search_txt', productController.searchData)
router.get('/validateseller', customerAndUser.validateSeller);
router.post('/addproduct', upload, productController.addProduct);
router.get('/showproducts/:filter?', productController.showProducts);
router.patch('/seller/location/:seller_id/:location', customerAndUser.upadateSellerLocation);
router.get('/sellers/data', customerAndUser.getSellerData);
router.get('/product/seller/:sid', productController.showSellerProducts);
router.get('/get-product/:pid', productController.getProductDetails);
router.post('/book-product', productController.bookProduct);
router.get('/product/invoice/:oid/:pid', LoginVerify, productController.getInvoice);
router.post('/product/cart', productController.addCart);
router.get('/product/cart/:customer_id', productController.getCart);
router.delete('/product/cart/:product_id/:customer_id', productController.removeCart);
router.get('/get-orders/:user_id', productController.getOrders);
router.get('/get-orders-seller/:seller_id', productController.getOrders);
router.patch('/order/change-status/:oid/:oredr_confirm/:delivery_status', productController.updateOrder);
router.get('/is-product-buy/:user_id/:product_id', productController.isProductBuy);
router.post('/add-review', productController.addReview);
router.get('/get-review/:pid', productController.getReviews);
router.post('/payment-create', productController.payment_create);
router.post('/payment-verify', productController.payment_verify);
router.get('/logout', customerAndUser.logout);
export default router;