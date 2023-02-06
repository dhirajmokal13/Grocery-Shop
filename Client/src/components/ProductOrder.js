import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { serverLink } from '../App';
import swal from 'sweetalert';
import { idSelector, loadScript } from '../javascript/first';

export default function ProductOrder() {
    //const [login, setLogin] = useState(localStorage.getItem('loginStatus'));
    const [product, setProduct] = useState([]);
    const [seller, setSeller] = useState([]);
    const [orderaddr, setOrderaddr] = useState(JSON.parse(localStorage.getItem('userData')).address);
    const [albuy, setAlbuy] = useState(false);
    const [reviews, setReviews] = useState([]);

    //reviews params
    const [rating, setRating] = useState(0);
    const [reviewtxt, setReviewtxt] = useState('');

    const { pid } = useParams();
    const navigate = useNavigate();

    //validate user
    const validateUser = () => {
        if (localStorage.getItem("loginStatus") === "customer") {
            axios.get(`${serverLink}/validateseller`, {
                headers: {
                    'Authorization': localStorage.getItem("token")
                }
            }).then((res) => {
                if (res.data.message === 'Invalid') {
                    localStorage.clear();
                    navigate('/');
                }
            })
        } else {
            navigate('/');
        }
    }

    const getProductDetails = async () => {
        await axios.get(`${serverLink}/get-product/${pid}`)
            .then(res => {
                setProduct(res.data.product);
                setSeller(res.data.seller);
            })
    }

    const getReviews = async () => {
        await axios.get(`${serverLink}/get-review/${pid}`)
            .then(res => {
                setReviews(res.data.review);
            }).catch(err => {
                console.log(err);
            })
    }

    const isProductBuy = async () => {
        await axios.get(`${serverLink}/is-product-buy/${JSON.parse(localStorage.getItem('userData')).id}/${pid}`)
            .then(res => {
                if (res.data.buy === true) {
                    setAlbuy(true);
                }
            }).catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        validateUser();
        getProductDetails();
        getReviews();
        isProductBuy();
    }, []);

    const handlePayment = async (data) => {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
            alert("Razorpay script failed to load");
            return;
        }

        const options = {
            key: 'rzp_test_V8dibsyOXL32Hd',
            amount: Number(data.amount),
            currency: data.currency,
            name: 'Grocery Shop',
            description: 'Payment For Groceries',
            order_id: data.id,
            handler: function (responce) {
                axios.post(`${serverLink}/payment-verify`, { responce: responce, amount: data.amount })
                    .then(res => {
                        if (res.data.status === 'valid') {
                            idSelector('conf').innerHTML = `<button class='btn btn-outline-success' disabled>Booked Successfully</button>`;
                            swal({
                                title: 'success',
                                text: 'Payment Successfull',
                                icon: 'success',
                            });
                        } else {
                            idSelector('conf').innerHTML = `<button class='btn btn-outline-danger' disabled>Failed</button>`;
                            swal({
                                title: 'Failed',
                                text: 'Payment Failed',
                                icon: 'error',
                            });
                        }
                    }).catch(err => {
                        console.log(err);
                    })
            }
        }
        const rzp = new window.Razorpay(options);
        rzp.open();
    }

    const handleOrder = (e) => {
        e.preventDefault();
        idSelector('cnfbtn').setAttribute('disabled', true)
        idSelector('cnfbtn').innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Confirming...';
        axios.post(`${serverLink}/book-product`, { 'product_id': product._id, 'orderaddr': orderaddr, 'seller_id': seller._id, 'user_id': JSON.parse(localStorage.getItem('userData')).id }, {
            headers: {
                'Authorization': localStorage.getItem("token"),
            }
        })
            .then(res => {
                if (res.data.order_status === true) {
                    swal({
                        title: 'Choose Payment Method',
                        buttons: { online: { text: "Pay Online", value: "online" }, cancel: "Pay By Cash" },
                        showCloseButton: true
                    }).then((data) => {
                        if (data === "online") {
                            axios.post(`${serverLink}/payment-create`, { 'amount': product.productPrice, 'order_id': res.data.oid })
                                .then(res => {
                                    if (res.data.status === 'created') {
                                        handlePayment(res.data);
                                    }
                                })
                        } else {
                            idSelector('conf').innerHTML = `<button class='btn btn-outline-success' disabled>Booked Successfully</button>`;
                            swal({
                                title: 'success',
                                text: 'Booked',
                                icon: 'success',
                            });
                        }
                    })
                    //craete payment


                } else {
                    swal({
                        title: 'Failed',
                        text: 'Something Went Wrong',
                        icon: 'warning',
                    });
                }
            })
    }

    const handleReview = async (e) => {
        e.preventDefault();
        if (reviewtxt) {
            await axios.post(`${serverLink}/add-review`, { pid: pid, uname: JSON.parse(localStorage.getItem('userData')).uname, uid: JSON.parse(localStorage.getItem('userData')).id, rating: rating, review: reviewtxt })
                .then(res => {
                    if (res.data.posted) {
                        swal({
                            title: 'Successfull',
                            text: 'Your Review Added',
                            icon: 'success',
                        });
                        setRating(0);
                        e.target.reset();
                        getReviews();
                    }
                }).catch(err => {
                    console.log(err);
                })
        } else {
            swal({
                title: 'Incorrect Data',
                text: 'Fill All Data',
                icon: 'error',
            });
        }
    }

    return (
        <>
            <div className="d-flex justify-content-center">
                <div className="card mb-3 mt-5" style={{ maxWidth: '700px', boxShadow: '0 10px 16px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)' }}>
                    <img src={`${serverLink}/product_image/${product.productImg}`} className="card-img-top" alt="..." />
                    <span className='card-img-overlay fst-italic fs-5' style={{ textDecoration: 'underline' }}>{product.productType}</span>
                    <h5 className="card-title card-header me-4 fst-italic">{product.productName} &#x20B9;<span className='ms-1 me-2 text-success'>{product.productPrice}</span>  <span className='text-primary-emphasis'>Seller:</span> {seller.businessName} ({seller.sellerName})</h5>
                    <div className="card-body">
                        <p className="card-text" dangerouslySetInnerHTML={{ __html: product.productDesc}}></p>
                    </div>
                    <p className="card-text card-footer"><small className="text-muted"><span className='text-info'>Address: </span>{seller.addr}  <span className='text-info'>Email: </span>{seller.email}  <span className='text-info'>Username: </span>{seller.buname}</small></p>
                </div>
            </div>
            <div className="container mt-3" style={{ maxWidth: '437px' }}>
                <form onSubmit={handleOrder} className='mb-4'>
                    <div className="mb-3">
                        <input type="text" onChange={(e) => { setOrderaddr(e.target.value) }} placeholder='Confirm Delivery Address' defaultValue={orderaddr} className="form-control" />
                    </div>
                    <span id='conf'>
                        <button className='btn btn-outline-success' id='cnfbtn'>Confirm Order</button>
                    </span>
                </form>
                <hr />
                <h3 className='text-center mt-4'>Users Reviews</h3>
            </div>
            <div className="container mt-4 mb-3" style={{ maxWidth: '842px' }}>
                {/* reviews start */}
                {
                    reviews && reviews.map((rev, ind) => {
                        return (
                            <div className="card mb-3" key={ind} style={{ boxShadow: '0 10px 16px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)' }}>
                                <div className="card-header">
                                    {rev.rating}/10
                                </div>
                                <div className="card-body">
                                    <blockquote className="blockquote mb-0">
                                        <p>{rev.review}</p>
                                        <footer className="blockquote-footer"> {rev.uname}</footer>
                                    </blockquote>
                                </div>
                            </div>
                        )
                    })
                }
                {
                    reviews.length === 0 ? <span>There is Not Any Reviews Here 'Be The First One'</span> : ""
                }
                {/* reviews end */}
                <hr className='mt-4 mb-2' />
                {
                    albuy ?
                        <form className='container' onSubmit={handleReview} style={{ maxWidth: '430px' }}>
                            <h4>Write Review Here</h4>
                            <span className='d-flex mb-2'>Ratings:<span className=' ms-1 text-success'>{rating}</span><input type="range" defaultValue={0} min='0' max='10' className="form-range ms-2" onChange={(e) => { setRating(e.target.value) }}></input></span>
                            <textarea type='text' placeholder='Enter The Review' className='form-control' onChange={(e) => { setReviewtxt(e.target.value) }} style={{ height: '100px' }}></textarea>
                            <button className='btn btn-outline-success mt-2'>Submit Review</button>
                        </form> :
                        <span className='text-danger'>You Are Not Buy This Yet</span>
                }
            </div>
        </>
    )
}
