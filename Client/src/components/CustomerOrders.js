import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { serverLink } from '../App'
import moment from 'moment/moment'

export const CustomerOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [payInfo, setPayInfo] = useState([]);
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

    const getOrders = async () => {
        await axios.get(`${serverLink}/get-orders/${JSON.parse(localStorage.getItem('userData')).id}`)
            .then(res => {
                setOrders(res.data.orders);
                setProducts(res.data.product);
                setPayInfo(res.data.payInfo);
            }).catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        validateUser();
        getOrders();
    }, []);

    return (
        <div className='container'>
            <h3 className='text-secondary text-center mt-4 mb-4'>My Orders ({orders.length})</h3>
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
                                    Order Date: <span className='me-3 text-secondary'>{moment(new Date(order.dt)).format('D MMMM YYYY h:m A')}</span>
                                    Order Status: <span className='me-3'>{order.oredr_confirm === 'false' ? <h6 className='text-secondary d-inline'>Waiting To Confirmation</h6> : order.oredr_confirm === 'reject' ? <h6 className='text-danger d-inline'>Rejected</h6> : <h6 className='text-success d-inline'>Accepted</h6>}</span>
                                    Delivery Status: <span>{order.delivery_status === false ? <h6 className='text-secondary d-inline'>Pending</h6> : <h6 className='text-success d-inline'>Delivered</h6>}</span>
                                </div>
                            </div>
                            <div className="card-footer">
                                Delivery Address: <span className="text-secondary">{order.address}</span>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
