import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serverLink } from '../App';
import moment from 'moment/moment';
import swal from 'sweetalert';
import { idSelector } from '../javascript/first';

const SellerOrder = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const [payInfo, setPayInfo] = useState([]);
    const [sells, setSells] = useState([]);

    const getOrders = () => {
        axios.get(`${serverLink}/get-orders-seller/${JSON.parse(localStorage.userData).id}`)
            .then(res => {
                setUserInfo(res.data.userInfo);
                setOrders(res.data.orders);
                setProducts(res.data.product);
                setPayInfo(res.data.payInfo);
                setSells(res.data.sells);
            }).catch(err => {
                console.log(err);
            })
    }
    useEffect(() => {
        if (localStorage.getItem("loginStatus") === "seller") {
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
        getOrders();
    }, [navigate]);


    const updateStatus = (e) => {
        let order_confirm = idSelector(`order${e.target.value}`).value;
        let delivery_cnf = idSelector(`delivery${e.target.value}`).value;
        let oid = idSelector(`oid${e.target.value}`).value;
        axios.patch(`${serverLink}/order/change-status/${oid}/${order_confirm}/${delivery_cnf}`)
            .then(res => {
                if (res.data === true) {
                    swal({
                        title: 'Success',
                        text: 'Updated Successfully',
                        icon: 'success',
                    });
                } else {
                    swal({
                        title: 'error',
                        text: 'Not Updated',
                        icon: 'error',
                    })
                }
            }).catch(err => {
                console.log(err);
            })
    }
 
    return (
        <div className='container'>
            <h3 className='text-center text-secondary my-3'>My Orders ({orders.length})</h3>
            <p className='text-center text-secondary font-3 fs-5'>Delivered Orders: <span className="text-success me-3">{sells.delivered}</span> Total Sells: <span className="text-success me-3">{sells.total_amount}</span> Waiting For Confirmation: <span className="text-success me-3">{sells.waiting_cnf}</span>Rejected Orders: <span className="text-danger">{sells.rejected}</span></p>
            {
                orders && orders.map((order, index) => {
                    return (
                        <div className="card mb-4" style={{ maxWidth: "50rem", boxShadow: "0 10px 16px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)", marginLeft: 'auto', marginRight: 'auto' }} key={index}>
                            <div className="card-header">
                                Name: <span className='me-3 text-success'>{products[index].productName}</span>
                                &#x20B9;: <span className='me-3 text-danger'>{products[index].productPrice}</span>
                                Type: <span className='text-success me-3'>{products[index].productType}</span>
                                Payment Status: {payInfo[index] === true ? <span className='text-success'>Paid</span> : <span className='text-danger'>Cash On Delivery</span>}
                            </div>
                            <div className="card-body">
                                <div className="card-text">
                                    <input type="hidden" id={`oid${index}`} value={order._id} />
                                    Order Date: <span className='me-3 text-secondary'>{moment(new Date(order.dt)).format('D MMMM YYYY h:m A')}</span>
                                    Order Status:  <select defaultValue={order.oredr_confirm} className='form-select me-3' id={`order${index}`} style={{ maxWidth: '7rem', display: 'inline-block' }}> <option value="false">Wating</option><option value="true">Accept</option><option value="reject">Reject</option></select>
                                    Delivery Status: <select defaultValue={order.delivery_status} className='form-select me-3' id={`delivery${index}`} style={{ maxWidth: '8rem', display: 'inline-block' }}><option value="false">Pending</option><option value="true">Delivered</option></select>
                                </div>
                                <div className="card-text mt-2">
                                    Ordered By: <span className="me-3 text-info">{userInfo[index].name} ({userInfo[index].uname})</span> Email: <span className="me-3 text-info">{userInfo[index].email}</span> Delivery Address: <span className="text-secondary">{order.address}</span>
                                </div>
                            </div>
                            <div className="card-footer">
                                <button className='btn btn-secondary ms-1' value={index} onClick={updateStatus}>Update</button>
                            </div>
                        </div>
                    )
                })
            }

            {document.getElementsByTagName('body')[0].setAttribute('style', '')}
        </div>
    )
}

export default SellerOrder