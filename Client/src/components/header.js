import React, { useEffect, useState } from 'react'
import ProtoTypes from 'prop-types';
import { idSelector } from '../javascript/first';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverLink } from '../App';
import swal from 'sweetalert';
import moment from 'moment';
import '../javascript/iconScript';

const styleSearch = {
  width: '40vh',
}
export default function Header(props) {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (/^\S*$/.test(search) && search.length > 0) {
      navigate(`search/${search}`);
    } else {
      if (window.location.pathname.match(/^\/search\/([a-zA-Z0-9]+)$/)) {
        navigate(-1);
      }
    }
  }
  const getCart = () => {
    axios.get(`${serverLink}/product/cart/${JSON.parse(localStorage.getItem('userData')).id}`).then(res => {
      setCart(res.data.product_cart);
    }).catch(err => {
      console.log(err);
    })
  }

  useEffect(() => {
    if (localStorage.getItem('loginStatus') === 'customer') { getCart() }
  }, []);

  //Login for user
  const Logout = (e) => {
    axios.get(`${serverLink}/logout`, {
      headers: {
        'Authorization': localStorage.getItem("token")
      }
    }).then(res => {
      if (res.data.expire) {
        localStorage.clear();
        navigate('/');
      }
    }).catch(err => {
      console.log(err)
    })

    localStorage.clear();
    navigate('/');
  }
  const LoginUser = (e) => {
    e.preventDefault();
    let username = idSelector('username').value;
    let userpwd = idSelector('userpwd').value;
    if (username && userpwd) {

      axios.post(`${serverLink}/loginCustomer`, { 'username': username, 'password': userpwd })
        .then(res => {
          if (res.data.authData && res.data.loginWho) {
            localStorage.setItem('loginStatus', res.data.loginWho);
            localStorage.setItem('token', res.data.authData);
            localStorage.setItem('userData', res.data.userData);
            swal({
              title: 'Success',
              text: 'Login Successfull',
              icon: 'success',
            });
            navigate('/');
          } else {
            swal({
              title: 'Failed',
              text: 'Wrong Credentials',
              icon: 'error',
            });
          }
        });

    } else {
      swal({
        title: 'Failed',
        text: 'Enter Valid Data',
        icon: 'warning',
      });
    }
  }

  const Loginseller = (e) => {
    e.preventDefault();
    let username = idSelector('sluser').value;
    let userpwd = idSelector('slpwd').value;
    if (username && userpwd) {
      axios.post(`${serverLink}/loginseller`, { 'username': username, 'password': userpwd })
        .then(res => {
          if (res.data.authData && res.data.loginWho) {
            localStorage.setItem('loginStatus', res.data.loginWho);
            localStorage.setItem('token', res.data.authData);
            localStorage.setItem('userData', res.data.userData);
            swal({
              title: 'Success',
              text: 'Login Successfull',
              icon: 'success',
            });
            navigate('/sellerpanel');
          } else {
            swal({
              title: 'Failed',
              text: 'Wrong Credentials',
              icon: 'error',
            });
          }
        })

    } else {
      swal({
        title: 'Failed',
        text: 'Enter Valid Data',
        icon: 'warning',
      });
    }
  }

  const removeCart = async (pid) => {
    let a = await axios.delete(`${serverLink}/product/cart/${pid}/${JSON.parse(localStorage.getItem('userData')).id}`)
      .then(res => { return res.data }).catch(err => {
        console.log(err);
      })
    return a;
  }

  const handleRemoveCart = async (e) => {
    if (await removeCart(e.target.value)) {
      getCart();
    }
  }

  const buyCart = async (e) => {
    if (await removeCart(e.target.value)) {
      getCart();
      navigate(`/product-order/${e.target.value}`);
    }
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top" style={{ boxShadow: 'rgb(0 0 0 / 3%) 0px 10px 16px 0px, rgb(0 0 0 / 17%) 0px 6px 20px 0px' }}>
        <div className="container-fluid">
          <Link className="navbar-brand" style={{ color: '#6f42c1' }} to="/">
            <img src="https://cdn-icons-png.flaticon.com/512/3724/3724763.png" alt="Logo" width="30" height="24" className="d-inline-block align-text-top me-2" />
            <span className="typewrite" data-period="2000" data-type='[ "Grocery-Shop", "Buy Groceries.", "Sell Groceries." ]'>
              <span className="wrap">Grocery-Shop</span>
            </span>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              {/* check user login or not if not then show login*/}
              {/*if seller login then show account*/}
              {localStorage.getItem('loginStatus') === 'seller' ?
                <li className="nav-item">
                  <Link className="nav-link" to="#" data-bs-toggle="modal" data-bs-target="#userAccount">Seller</Link>
                </li>

                /*if customer login then show account*/
                : localStorage.getItem('loginStatus') === 'customer' ?
                  <li className="nav-item">
                    <Link className="nav-link" to="#" data-bs-toggle="modal" data-bs-target="#userAccount">Customer</Link>
                  </li>
                  /*if No one is login show this */
                  :
                  <li className="nav-item dropdown">
                    <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Login
                    </Link>
                    <ul className="dropdown-menu">
                      <li><Link className="dropdown-item" data-bs-toggle="modal" data-bs-target="#customerLogin"
                        to="">Customer</Link></li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li><Link className="dropdown-item" data-bs-toggle="modal" data-bs-target="#sellerLogin"
                        to="">Seller</Link></li>
                    </ul>
                  </li>
              }
            </ul>
            <form className="d-flex input-group" role="search" style={styleSearch}>
              <input className="form-control" type="search" placeholder="Search" aria-label="Search" value={search} onChange={(e) => { setSearch(e.target.value) }} />
              <button className="btn btn-outline-success" id="searchbtn" type="submit" onClick={handleSearch}>Search</button>
            </form>

            {localStorage.getItem('loginStatus') === 'customer' ?
              <button type="button" className="btn btn-outline-secondary ms-2 position-relative" fdprocessedid="e3bgk8" title=' My cart' data-bs-toggle="modal" data-bs-target="#cartmodal">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bag" viewBox="0 0 16 16">
                  <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"></path>
                </svg>
                <span className="position-absolute top-2 start-100 translate-middle badge rounded-pill bg-danger" style={{ top: '5px' }}>
                  {cart[0] && cart[0].length}
                </span>
              </button> : ""}

          </div>
        </div>
      </nav>

      {localStorage.getItem('loginStatus') == null ?
        /* modal of customerLogin */

        /* modal of customerLogin */
        <>
          {/* modal of customerLogin */}
          <div className="modal fade" id="customerLogin" tabIndex="-1" aria-labelledby="customerLoginLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="customerLoginLabel">Customer Login</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form className="row g-3" onSubmit={LoginUser}>
                    <div className="col-auto">
                      <label htmlFor="staticEmail2" className="visually-hidden">username</label>
                      <input type="text" className="form-control" id="username" autoComplete="username" placeholder="Username" />
                    </div>
                    <div className="col-auto">
                      <label htmlFor="inputPassword2" className="visually-hidden">Password</label>
                      <input type="password" className="form-control" id="userpwd" autoComplete="current-password" placeholder="Password" />
                    </div>
                    <div className="col-auto">
                      <button type="submit" className="btn btn-outline-success mb-3">Login</button>
                    </div>
                  </form>
                  <Link to="/userregistration">Craete User Account</Link>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
          {/* modal of seller login  */}
          <div className="modal fade" id="sellerLogin" tabIndex="-1" aria-labelledby="sellerLoginLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="sellerLoginLabel">Seller Login</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form className="row g-3" onSubmit={Loginseller}>
                    <div className="col-auto">
                      <label htmlFor="staticEmail2" className="visually-hidden">username</label>
                      <input type="text" className="form-control" id="sluser" autoComplete="username" placeholder="Username" />
                    </div>
                    <div className="col-auto">
                      <label htmlFor="inputPassword2" className="visually-hidden">Password</label>
                      <input type="password" className="form-control" id="slpwd" autoComplete="current-password" placeholder="Password" />
                    </div>
                    <div className="col-auto">
                      <button type="submit"
                        className="btn btn-outline-success mb-3">Login</button>
                    </div>
                  </form>
                  <Link to="/sellerregistration">Craete Seller Account</Link>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </>
        :
        <div className="modal fade" id="userAccount" tabIndex="-1" aria-labelledby="userAccountLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="userAccountLabel">Account {localStorage.getItem('loginStatus')}</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <h5>Username : <span className='text-success'>{JSON.parse(localStorage.getItem('userData')).uname}</span></h5>
                <h5>Name : <span className='text-success'>{JSON.parse(localStorage.getItem('userData')).Name}</span></h5>
                <h5>Email : <span className='text-success'>{JSON.parse(localStorage.getItem('userData')).email}</span></h5>
                {localStorage.loginStatus === 'seller' ? <><hr /><Link to="/sellerpanel" className='me-3 text-decoration-none'>Seller Panel</Link>  <Link to="/seller-orders" className='text-decoration-none me-3'>Seller Orders</Link><Link to="/seller/location" className='text-decoration-none'>Location</Link></> : ""}
                <hr />
                <button className='btn btn-outline-danger me-2' onClick={Logout}>Logout</button>
                {localStorage.getItem('loginStatus') === 'customer' ? <Link to='/customer-orders' className='btn btn-outline-secondary'>My Orders</Link> : ""}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      }

      {localStorage.getItem('loginStatus') === 'customer' ?

        < div className="modal fade" id="cartmodal" tabIndex="-1" aria-labelledby="cartmodalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="cartmodalLabel">Cart</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">{
                cart[0] && cart[0].map((item, index) => {
                  return (
                    <div className="card my-3" key={index}>
                      <h5 className="card-header"><span className="text-success">{item.productName}</span> Price: {item.productPrice}<button className="btn text-success ms-2" value={item._id} onClick={buyCart}>Buy</button><button className="btn text-danger ms-2" value={item._id} onClick={handleRemoveCart}>Remove</button></h5>
                      <div className="card-body">
                        <p className="card-text"><span className="text-primary">Type:</span> {item.productType} <span className="text-primary">Added:</span> {moment(cart[1][index].dt).fromNow()}</p>
                      </div>
                    </div>
                  )
                })
              }
                {
                  cart[0] !== undefined ?
                    cart[0].length === 0 ? <span>There is Not Any Poduct Yet</span> : "" : ""
                }
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

        : ""
      }
    </>
  )
}
Header.defaultProps = {
  title: "Grocery-Shop",
  isLogin: false,
}
Header.prototype = {
  title: ProtoTypes.string,
}