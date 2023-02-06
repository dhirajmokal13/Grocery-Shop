import mongoose from "mongoose";

const customerRegistration = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    mnumber: { type: Number, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    addr: { type: String, required: true, trim: true },
    uname: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    dt: { type: Date, default: Date.now },
})

const sellerRegistration = new mongoose.Schema({
    sellerName: { type: String, required: true, trim: true },
    businessName: { type: String, required: true, trim: true },
    mnumber: { type: Number, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    addr: { type: String, required: true, trim: true },
    location: { type: [String], default: [0, 0] },
    buname: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    dt: { type: Date, default: Date.now },
})

const productRegistration = new mongoose.Schema({
    productName: { type: String, required: true, trim: true },
    productPrice: { type: Number, required: true, trim: true },
    productDesc: { type: String, required: true, trim: true },
    productType: { type: String, required: true, trim: true },
    productImg: { type: String, required: true, trim: true },
    sellerId: { type: String, required: true, trim: true },
    dt: { type: Date, default: Date.now },
});

const ordersRegistration = new mongoose.Schema({
    pid: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    oredr_confirm: { type: String, trim: true, default: false },
    delivery_status: { type: Boolean, trim: true, default: false },
    sellerId: { type: String, required: true, trim: true },
    customerId: { type: String, required: true, trim: true },
    dt: { type: Date, default: Date.now },
});

const paymentRegistration = new mongoose.Schema({
    Payment_id: { type: String, required: true, trim: true },
    Order_id: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, trim: true },
    amount_paid: { type: Number, required: true, trim: true },
    status: { type: String, required: true, trim: true },
    created_at: { type: Number, required: true, trim: true },
    amount_due: { type: Number, required: true, trim: true },
    attempts: { type: String, required: true, trim: true },
    razorpay_payment_id: { type: String, trim: true, default: "" },
});

const reviewRegistration = new mongoose.Schema({
    product_id: { type: String, required: true, trim: true },
    user_id: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, trim: true },
    review: { type: String, required: true, trim: true },
    uname: { type: String, required: true, trim: true },
    dt: { type: Date, default: Date.now },
});

const cartRegistration = new mongoose.Schema({
    customer_id: { type: String, required: true, trim: true },
    product_id: { type: String, required: true, trim: true },
    dt: { type: Date, default: Date.now },
})

const registrationModel = {
    customer: mongoose.model('customer', customerRegistration),
    seller: mongoose.model('seller', sellerRegistration),
    product: mongoose.model('product', productRegistration),
    order: mongoose.model('order', ordersRegistration),
    payment: mongoose.model('payment', paymentRegistration),
    review: mongoose.model('review', reviewRegistration),
    cart: mongoose.model('cart', cartRegistration),
};

export default registrationModel;