import dotenv from 'dotenv';
dotenv.config();
import registrationModel from "../models/customerAndUserModel.js";
import Jwt from "jsonwebtoken";
import Razorpay from 'razorpay';
import crypto from 'crypto';
const jwtKey = process.env.JWTKEY;
const instance = new Razorpay({
    key_id: process.env.razorpay_key_id,
    key_secret: process.env.razorpay_key_secret
});

class productController {

    static payment_create = async (req, res) => {
        const { amount, order_id } = req.body;
        try {
            let options = {
                amount: amount * 100,
                currency: 'INR',
            };
            instance.orders.create(options, async function (err, order) {
                if (err) {
                    console.log("Dea " + err);
                } else {
                    await new registrationModel.payment({
                        Payment_id: order.id,
                        Order_id: order_id,
                        amount: order.amount,
                        amount_paid: order.amount_paid,
                        status: order.status,
                        created_at: order.created_at,
                        amount_due: order.amount_due,
                        attempts: order.attempts,
                    }).save();
                    res.send(order)
                }
            })
        } catch (err) {
            res.status(404).send("Internal server error " + err);
        }
    }

    static payment_verify = async (req, res) => {
        try {
            let body = req.body.responce.razorpay_order_id + "|" + req.body.responce.razorpay_payment_id;
            let expectedSign = crypto.createHmac('sha256', process.env.razorpay_key_secret).update(body.toString()).digest('hex');
            if (expectedSign === req.body.responce.razorpay_signature) {
                await registrationModel.payment.updateOne({ 'Payment_id': req.body.responce.razorpay_order_id }, { $set: { 'amount_paid': req.body.amount, amount_due: 0, attempts: 1, razorpay_payment_id: req.body.responce.razorpay_payment_id } });
                res.status(200).send({ status: 'valid' });
            } else {
                res.status(500).send({ status: 'Invalid' });
            }
        } catch (err) {
            res.status(404).send("Internal server error " + err);
        }
    }

    static isProductBuy = async (req, res) => {
        const { user_id, product_id } = req.params;
        let result = await registrationModel.order.findOne({ pid: product_id, customerId: user_id });
        if (result != null) {
            res.status(200).send({ buy: true });
        } else {
            res.status(200).send({ buy: false });
        }
    }

    static searchData = async (req, res) => {
        try {
            const { search_txt } = req.params;
            const products = await registrationModel.product.find({ $or: [{ productName: { "$regex": search_txt, "$options": "i" } }, { productType: { $regex: `.*${search_txt}.*`, "$options": "i" } }] });
            res.send(products);
        } catch (err) {
            res.status(404).send("Internal server error " + err);
        }
    }

    static addReview = async (req, res) => {
        try {
            const { pid, uid, rating, review, uname } = req.body;
            await registrationModel.review({
                product_id: pid,
                user_id: uid,
                rating: rating,
                review: review,
                uname: uname,
            }).save();
            res.status(200).send({ 'posted': true });
        } catch (err) {
            res.status(404).send("Internal server error " + err);
        }
    }

    static getReviews = async (req, res) => {
        try {
            const result = await registrationModel.review.find({ product_id: req.params.pid });
            res.status(200).send({ review: result })
        } catch (err) {
            res.status(404).send("Internal server error " + err);
        }
    }

    static getProductDetails = async (req, res) => {
        try {
            const { pid } = req.params;
            const product_details = await registrationModel.product.findById(pid);
            const seller_details = await registrationModel.seller.findById(product_details.sellerId, 'sellerName businessName email addr buname')
            res.status(202).send({ product: product_details, seller: seller_details });
        } catch (err) {
            res.status(404).send("Internal server error " + err);
        }
    }

    static addProduct = async (req, res, next) => {
        const token = req.headers['authorization'];
        Jwt.verify(token, jwtKey, async (err, decoded) => {
            if (!err) {
                const product_img = req.file.filename;
                const { product_name, product_price, product_desc, product_type, seller_id } = req.body;
                const re = registrationModel.product({
                    productName: product_name,
                    productPrice: product_price,
                    productDesc: product_desc,
                    productType: product_type,
                    productImg: product_img,
                    sellerId: seller_id,
                });
                await re.save();
                await res.status(201).send({ status: 'success' });
            } else {
                res.status(201).send({ 'message': "Invalid" })
            }
        })

    }

    static showSellerProducts = async (req, res) => {
        try {
            const { sid } = req.params;
            const seller_products = await registrationModel.product.find({ sellerId: sid }).sort({ dt: -1 });;
            res.status(200).send(seller_products);
        } catch (err) {
            res.status(404).send("Internal server error " + err);
        }
    }

    static showProducts = async (req, res) => {
        try {
            if (req.params.filter && req.params.filter != '*') {
                const products = await registrationModel.product.find({ productType: req.params.filter });
                res.status(202).send({ 'products': products })
            } else {
                const products = await registrationModel.product.find();
                res.status(202).send({ 'products': products })
            }
        } catch (err) {
            res.status(404).send("Internal server error " + err);
        }
    }

    static bookProduct = async (req, res) => {
        const token = req.headers['authorization'];
        Jwt.verify(token, jwtKey, async (err, decoded) => {
            if (!err) {
                const { product_id, orderaddr, seller_id, user_id } = req.body;
                const re = registrationModel.order({
                    pid: product_id,
                    address: orderaddr,
                    sellerId: seller_id,
                    customerId: user_id,
                });
                const result = await re.save();
                res.send({ 'order_status': true, 'oid': (result._id).toString() })
            } else {
                res.status(201).send({ 'message': "Invalid" })
            }
        })
    }

    static addCart = async (req, res) => {
        try {
            const { product_id, customer_id } = req.body;
            const no_of_orders = await registrationModel.cart.countDocuments({ customer_id: customer_id });
            if (no_of_orders < 5) {
                const add = await new registrationModel.cart({ customer_id: customer_id, product_id: product_id }).save();
                add ? res.status(200).send({ added: true, reason: false }) : res.status(200).send({ added: false, reason: 'Something Not Right' })
            } else {
                res.status(200).send({ added: false, reason: 'Max 5 Items Allowed In cart' });
            }
        } catch (err) {
            res.status(404).send("Internal server error " + err);
        }
    }

    static getCart = async (req, res) => {
        try {

            let { customer_id } = req.params;
            const cart_items = await registrationModel.cart.find({ customer_id: customer_id }, 'product_id dt');
            const pids = cart_items.map(items => items.product_id);
            const product_cart = await registrationModel.product.find({ _id: { $in: pids } }, 'productName productPrice productType dt');
            res.status(202).send({ product_cart: [product_cart, [...cart_items]] });
        } catch (err) {
            res.status(404).send("Internal server error " + err);
        }
    }

    static removeCart = async (req, res) => {
        const { product_id, customer_id } = req.params;
        const remove_cart = await registrationModel.cart.findOneAndDelete({ customer_id: customer_id, product_id: product_id });
        if (remove_cart) {
            res.status(200).send(true);
        } else {
            res.status(200).send(false);
        }

    }

    static updateOrder = async (req, res) => {
        try {
            const { oid, oredr_confirm, delivery_status } = req.params;
            const result = await registrationModel.order.findByIdAndUpdate(oid, { $set: { 'oredr_confirm': oredr_confirm, 'delivery_status': delivery_status } });
            if (result) {
                res.status(200).send(true)
            } else {
                res.status(200).send(false)
            }
        } catch (err) {
            res.status(404).send("Internal server error " + err);
        }
    }

    static getOrders = async (req, res) => {
        try {
            let data;
            let userInfo = [];
            let payInfo = [];
            let delivered = 0;
            let total = 0;
            let waiting_cnf = 0;
            let rejected = 0;
            req.params.user_id ? data = { customerId: req.params.user_id } : data = { sellerId: req.params.seller_id }
            const result = await registrationModel.order.find(data);
            const product = [];
            for (let i = 0; i < result.length; i++) {
                result[i].oredr_confirm === "false" ? waiting_cnf += 1 : result[i].oredr_confirm === "reject" ? rejected += 1 : ""
                let pid = result[i].pid;
                let oid = result[i]._id.toString();
                const resu = await registrationModel.payment.findOne({ Order_id: oid }, "amount_due");
                if (resu != null) {
                    resu.amount_due === 0 ? payInfo.push(true) : payInfo.push(false)
                } else {
                    payInfo.push(false);
                }
                const result2 = await registrationModel.product.findById(pid, "productName productPrice productType");
                if (result[i].delivery_status === true) { delivered += 1; total += result2.productPrice; }
                product.push(result2);
            }
            if (req.params.seller_id) {
                for (let i = 0; i < result.length; i++) {
                    let cid = result[i].customerId;
                    const result3 = await registrationModel.customer.findById(cid, "name email uname");
                    userInfo.push(result3);
                }
            }

            res.status(200).send({ 'orders': result, 'product': product, 'userInfo': userInfo, 'payInfo': payInfo, 'sells': { total_amount: total, delivered: delivered, waiting_cnf: waiting_cnf, rejected: rejected } });
        } catch (err) {
            res.status(404).send("Internal server error " + err);
        }
    }

}

export default productController;