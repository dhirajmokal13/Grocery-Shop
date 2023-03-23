import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { serverLink } from '../App';
import swal from 'sweetalert';
import { productType } from '../javascript/first';

export const Mainpage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const login = localStorage.getItem('loginStatus');
    const getData = async () => {
        await axios.get(`${serverLink}/showproducts`)
            .then(res => {
                setProducts(res.data.products)
            }).catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        getData();
    }, []);


    // Order for product
    const orderProduct = (e) => {
        if (login === 'customer') {
            navigate(`/product-order/${e.target.value}`)
        } else {
            swal({
                title: 'Failed',
                text: 'Please Login As Customer',
                icon: 'warning',
            });
        }
    }

    // add pro products to card
    const addCart = (e) => {
        if (login === 'customer') {
            let pid = e.target.value;
            axios.post(`${serverLink}/product/cart`, { 'product_id': pid, 'customer_id': JSON.parse(localStorage.getItem('userData')).id }).then(res => {
                if (res.data.added) {
                    swal({
                        title: "Product Added Successfully",
                        icon: 'success',
                    });
                } else {
                    swal({
                        title: "Cart Size is Lengthy",
                        text: res.data.reason,
                        icon: 'warning',
                    });
                }
            }).catch(err => {
                console.log(err);
            });

        } else {
            swal({
                title: 'Failed',
                text: 'Please Login As Customer',
                icon: 'warning',
            });
        }
    }

    const productFltered = async (e) => {
        await axios.get(`${serverLink}/showproducts/${e.target.value}`)
            .then(res => {
                setProducts(res.data.products)
            }).catch(err => {
                console.log(err);
            })
    }

    const styles = `.img-effect img {
        transition: 0.8s all ease-in-out;
    }
      
    .img-effect:hover img {
        transform: scale(1.5);
    }`;

    return (
        <>
            <div className="container my-5">
                <select name="ptype" style={{ maxWidth: '355px' }} onChange={productFltered} className="form-select mt-2 mb-4 shadow-lg p-3bg-body-tertiary rounded">
                    <option value='*'>All Categories</option>
                    {
                        productType.map(ptype => (
                            <option key={ptype} value={ptype}>{ptype}</option>
                        ))
                    }
                </select>
                <style>{styles}</style>
                <div className='row'>
                    {
                        products && products.map((pro, index) => {
                            return (
                                <div key={index} className="col mb-3">
                                    <div className="card" style={{ width: "18rem", boxShadow: "0 10px 16px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)"}}>
                                        <div className="card-header">
                                            Price: <span className='text-success'>{pro.productPrice}</span>
                                        </div>
                                        <div className='img-effect' style={{overflow:"hidden"}}><img src={`${serverLink}/product_image/${pro.productImg}`} className="card-img-top" alt="..." /></div>
                                        <div className="card-body">
                                            <h5 className="card-title" style={{color: '#3d0a91'}}>{pro.productName}</h5>
                                            <hr />
                                            <p className="card-text text-danger" title='Category of Product'>{pro.productType}</p>
                                            <hr />
                                            <p className="card-text text-secondary" title='Product Description' dangerouslySetInnerHTML={{ __html: (pro.productDesc).slice(0, 80) + " ......" }}></p>
                                        </div>
                                        <div className="d-flex text-center card-footer py-2"><button className="btn btn-outline-success me-2" value={pro._id} onClick={orderProduct}>Buy</button><button className="btn btn-outline-success" onClick={addCart} value={pro._id}>Add Card</button></div>
                                    </div>
                                </div>
                            )
                        })

                    }
                    {
                        products.length === 0 ? <span className='text-danger text-center h3'>There is Not Any Poduct Yet</span> : ""
                    }

                    {document.getElementsByTagName('body')[0].setAttribute('style', '')}
                </div>
            </div>
        </>
    )

}