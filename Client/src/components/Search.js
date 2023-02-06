import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { serverLink } from '../App';
import swal from 'sweetalert';
function Search() {
    const { search_txt } = useParams();
    const [searchProduct, setSearchProduct] = useState([]);
    const login = localStorage.getItem('loginStatus');
    const [txt,setTxt] = useState('');
    const navigate = useNavigate();
    const getProducts = () => {
        axios.get(`${serverLink}/search/${search_txt}`)
            .then(res => {
                setSearchProduct(res.data);
            }).catch(err => {
                console.log(err);
            })
    }

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

    useEffect(() => {
        setTxt(search_txt);
        getProducts();
    }, [search_txt]);

    return (
        <div className="container">
            <h3 className='text-center my-3'>Search Result : <span className="text-success">{search_txt}</span></h3>
            <div className="row">
                {

                    searchProduct && searchProduct.map((item, index) => {
                        return (
                            <div key={index} className="col mb-3">
                                <div className="card" style={{ width: "18rem", boxShadow: "0 10px 16px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)" }}>
                                    <div className="card-header">
                                        Price: <span className='text-success'>{item.productPrice}</span>
                                    </div>
                                    <img src={`${serverLink}/product_image/${item.productImg}`} className="card-img-top" alt="..." />
                                    <div className="card-body">
                                        <h5 className="card-title" style={{color: '#3d0a91'}}>{item.productName}</h5>
                                        <hr />
                                        <p className="card-text text-danger" title='Category of Product'>{item.productType}</p>
                                        <hr />
                                        <p className="card-text text-secondary" title='Product Description' dangerouslySetInnerHTML={{ __html: (item.productDesc).slice(0, 80) + " ......" }}></p>
                                    </div>
                                    <div className="d-flex text-center card-footer py-2"><button className="btn btn-outline-success me-2" value={item._id} onClick={orderProduct}>Buy</button><button className="btn btn-outline-success" onClick={addCart} value={item._id}>Add Card</button></div>
                                </div>
                            </div>
                        )
                    })
                }
                {
                    searchProduct.length === 0 ? <span className='text-center text-danger fs-5 my-5'>Not Any Matching Result</span> : ""
                }
            </div>
        </div>
    )
}

export default Search