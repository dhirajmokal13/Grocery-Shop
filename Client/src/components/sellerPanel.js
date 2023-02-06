import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { idSelector } from '../javascript/first';
import { serverLink } from '../App';
import swal from 'sweetalert';
import { productType } from '../javascript/first';
import { Editor } from '@tinymce/tinymce-react';

export const SellerPanel = () => {
    const navigate = useNavigate();
    const [sellerPrudct, setSellerProduct] = useState([]);
    const editorRef = useRef(null);
    const getSellerProducts = () => {
        axios.get(`${serverLink}/product/seller/${JSON.parse(localStorage.getItem('userData')).id}`)
            .then(res => {
                setSellerProduct(res.data);
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

        getSellerProducts();
    }, [navigate]);

    const [product, setProduct] = useState({
        pname: "",
        pprice: "",
        pdesc: "",
        ptype: "",
    });

    const [pimage, setPimage] = useState(true);

    const handleChange = e => {
        const { name, value } = e.target
        setProduct({
            ...product,
            [name]: value
        })
    }
    const handleText = () => {
        if (editorRef.current) {
            setProduct({
                ...product,
                ["pdesc"]: editorRef.current.getContent()
            })
        }
    }
    const addProducts = (e) => {
        e.preventDefault();
        const { pname, pprice, pdesc, ptype } = product;
        if (pname && pprice && pdesc && ptype && pimage) {
            let data = new FormData();
            data.append('img', pimage);
            data.append('product_name', pname);
            data.append('product_price', pprice);
            data.append('product_desc', pdesc);
            data.append('product_type', ptype);
            data.append('seller_id', JSON.parse(localStorage.userData).id);
            axios.post(`${serverLink}/addproduct`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': localStorage.getItem("token"),
                }
            }).then(res => {
                if (res.data.status === 'success') {
                    idSelector('proAdd').reset();
                    setProduct({
                        pname: "",
                        pprice: "",
                        pdesc: "",
                        ptype: "",
                    })
                    swal({
                        title: 'Success',
                        text: 'Product Added Successfully',
                        icon: 'success',
                    });
                } else {
                    swal({
                        title: 'Failed',
                        text: 'Something Went to wrong',
                        icon: 'warning',
                    });
                }
            })
        } else {
            swal({
                title: 'Failed',
                text: 'Fill All data',
                icon: 'warning',
            });
        }
    }

    return (
        <>
            <div className='container' style={{ maxWidth: '933px' }}>
                <h2 className='text-center my-3 text-success'>Seller Panel</h2>
                <hr />
                <h4 className='text-center my-3 text-primary'>Add Products</h4>
                <form onSubmit={addProducts} id='proAdd'>
                    <div className="col-auto mt-3 mb-2">
                        <label htmlFor="pname" className="visually-hidden">Product Name</label>
                        <input type="text" name="pname" value={product.pname} onChange={handleChange} className="form-control" id="pname" autoComplete="pname" placeholder="Product Name" />
                    </div>
                    <div className="col-auto my-2">
                        <label htmlFor="pprice" className="visually-hidden">Product Price</label>
                        <input type="number" name="pprice" value={product.pprice} onChange={handleChange} className="form-control" id="pprice" autoComplete="pprice" placeholder="Product Price" />
                    </div>
                    <select name="ptype" value={product.ptype} onChange={handleChange} className="form-select my-2">
                        <option defaultValue="none">Select Product Type</option>
                        {
                            productType.map(ptype => (
                                <option key={ptype} value={ptype}>{ptype}</option>
                            ))
                        }
                    </select>
                    <div className="my-2">
                        <label htmlFor="pimg" className="form-label">Product Image Upload</label>
                        <input className="form-control" name="pimg" onChange={((e) => { setPimage(e.target.files[0]) })} accept="image/*" type="file" id="pimg" />
                    </div>
                    <div className="form-floating my-2">
                        <Editor
                            apiKey='7bjtstpbggui4x8y0f755nwidiber13mtk1fpw6s6epmlpvn'
                            onChange={handleText}
                            onInit={(evt, editor) => editorRef.current = editor}
                            init={{
                                height: 230,
                                menubar: false,

                                plugins: 'preview fullscreen lists advlist code link help advcode wordcount',
                                toolbar: 'undo redo | styles fontfamily fontsize | ' +
                                    'forecolor preview  fullscreen | link code | numlist bullist | outdent indent | ' +
                                    'removeformat help',
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                            }}
                        />

                    </div>
                    <button className='btn btn-outline-primary mb-3 mt-2'>Add Product</button>
                </form>
            </div>
            <hr />
            <h4 className='text-center my-4 text-secondary'>My Products</h4>
            <div className="container">
                <hr />
                <div className="row">
                    {
                        sellerPrudct && sellerPrudct.map((item, index) => {
                            return (
                                <div key={index} className="col mb-3">
                                    <div className="card" style={{ width: "18rem", boxShadow: "0 10px 16px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)" }}>
                                        <div className="card-header">
                                            Price: <span className='text-success'>{item.productPrice}</span>
                                        </div>
                                        <img src={`${serverLink}/product_image/${item.productImg}`} className="card-img-top" alt="..." />
                                        <div className="card-body">
                                            <h5 className="card-title">{item.productName}</h5>
                                            <hr />
                                            <p className="card-text text-danger" title='Category of Product'>{item.productType}</p>
                                            <hr />
                                            <p className="card-text text-secondary" title='Product Description' dangerouslySetInnerHTML={{ __html: (item.productDesc).slice(0, 80) + " ......" }}></p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {document.getElementsByTagName('body')[0].setAttribute('style', '')}
        </>
    )
}
