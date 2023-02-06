import React from 'react'
import { idSelector } from '../javascript/first';
import axios from 'axios';
import { serverLink } from '../App';
import swal from 'sweetalert';

function getOtp(e) {
    e.preventDefault();
    let email = idSelector('ruemail').value;
    if (email) {
        axios.post(`${serverLink}/getotp`, { 'email': email })
            .then(res => {
                if (res.data.send) {
                    idSelector('otpbtn').innerHTML = '<button class="form-text btn btn-outline-success" id="verifyotp">Verify Otp</button>';
                    idSelector('verifyotp').addEventListener('click', (e) => {
                        e.preventDefault();
                        if (Number(idSelector('otp').value) === res.data.otp) {
                            idSelector('otp').setAttribute('data-verify', 'true');
                            swal({
                                title: 'Success',
                                text: 'Otp Varified Successfully',
                                icon: 'success',
                            });
                        } else {
                            swal({
                                title: 'Failed',
                                text: 'Wrong Otp',
                                icon: 'error',
                            });
                        }
                    })
                    
                } else {
                    swal({
                        title: 'Failed',
                        text: 'Enter Valid Email',
                        icon: 'warning',
                    });
                }
            })
    } else {
        swal({
            title: 'Failed',
            text: 'Enter Email First',
            icon: 'warning',
        });
    }
}

export function UserRegistration(props) {
    const userSignup = (e) => {
        e.preventDefault();
        let pass = idSelector("rupass").value;
        let cpass = idSelector("rucpass").value;
        let name = idSelector("runame").value;
        let email = idSelector("ruemail").value;
        let mobile = idSelector("rumobile").value;
        let uname = idSelector("ruuname").value;
        let addr = idSelector("ruaddr").value;
        let otpverified = idSelector('otp').getAttribute('data-verify') === 'true'
        if (pass && cpass && name && email && mobile && uname && addr && otpverified) {
            if (pass === cpass) {
                axios.post(`${serverLink}/registeruser`, { 'name': name, 'password': pass, 'email': email, 'mobile': mobile, 'username': uname, 'address': addr })
                    .then(res => {
                        if (res.data.signup) {
                            idSelector('cregfrm').reset();
                            swal({
                                title: 'Success',
                                text: 'Account Created Successfully',
                                icon: 'success',
                            });
                        } else {
                            alert(res.data.reason);
                        }
                    })
            } else {
                swal({
                    title: 'Failed',
                    text: 'Password Mismatched',
                    icon: 'error',
                });
            }
        } else {
            swal({
                title: 'Failed',
                text: 'Fill All The Data',
                icon: 'warning',
            });
        }

    }

    return (
        <div className="container mb-4">
            <h2 className='text-center mt-3 mb-2'>Customer Registration</h2>
            <form id="cregfrm" onSubmit={userSignup}>
                <div className="mb-3">
                    <label htmlFor="runame" className="form-label">Name</label>
                    <input type="text" placeholder='Enter Your Name' className="form-control" id="runame" />
                </div>
                <div className="mb-3">
                    <label htmlFor="ruemail" className="form-label">Email</label>
                    <input type="email" placeholder='Enter Your Email' className="form-control" id="ruemail" />
                </div>
                <div className="row g-3 align-items-center">
                    <div className="col-auto">
                        <input type="number" data-verify='false' id="otp" placeholder='Otp' className="form-control" />
                    </div>
                    <div className="col-auto" id='otpbtn'>
                        <button className="form-text btn btn-outline-success" onClick={getOtp}>
                            Get Otp
                        </button>
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="rumobile" className="form-label">Mobile Number</label>
                    <input type="number" placeholder='Enter Your Mobile Number' className="form-control" id="rumobile" />
                </div>
                <div className="mb-3">
                    <label htmlFor="ruuname" className="form-label">Username</label>
                    <input type="text" placeholder='Enter Your Username' className="form-control" id="ruuname" />
                </div>
                <div className="mb-3">
                    <label htmlFor="ruaddr" className="form-label">Address</label>
                    <input type="text" placeholder='Enter Your Address' className="form-control" id="ruaddr" />
                </div>
                <div className="mb-3">
                    <label htmlFor="rupass" className="form-label">Password</label>
                    <input type="password" placeholder='Create Password' className="form-control" id="rupass" />
                </div>
                <div className="mb-3">
                    <label htmlFor="rucpass" className="form-label">Confirm Password</label>
                    <input type="password" placeholder='Confirm Password' className="form-control" id="rucpass" />
                </div>
                <button type="submit" className="btn btn-outline-primary">Submit</button>
                <button type="reset" className="btn btn-outline-primary ms-2">Reset</button>
            </form>
        </div>

    )
}

const sellerSignup = (e) => {
    e.preventDefault();
    let pass = idSelector("rspass").value;
    let cpass = idSelector("rscpass").value;
    let name = idSelector("rsname").value;
    let bname = idSelector("rsbname").value;
    let email = idSelector("rsemail").value;
    let mobile = idSelector("rsmobile").value;
    let uname = idSelector("rsuname").value;
    let addr = idSelector("rsaddr").value;

    if (pass && cpass && name && bname && email && mobile && uname && addr) {
        if (pass === cpass) {
            axios.post(`${serverLink}/registerseller`, { 'name': name, 'bname': bname, 'mobile': mobile, 'email': email, 'address': addr, 'buname': uname, 'password': pass })
                .then(res => {
                    if (res.data.signup) {
                        idSelector('srfrm').reset();
                        swal({
                            title: 'Success',
                            text: 'Seller Account Created Successfully',
                            icon: 'success',
                        });
                    } else {
                        alert(res.data.reason);
                    }
                })
        } else {
            swal({
                title: 'Failed',
                text: 'Password Mismatched',
                icon: 'error',
            });
        }
    } else {
        swal({
            title: 'Failed',
            text: 'Please Fill All data',
            icon: 'warning',
        });
    }
}

export function SellerRegistration(props) {
    return (
        <div className="container mb-4">
            <h2 className='text-center mt-3 mb-2'>Seller Registration</h2>
            <form id="srfrm" onSubmit={sellerSignup}>
                <div className="mb-3">
                    <label htmlFor="rsname" className="form-label">Seller Name</label>
                    <input type="text" placeholder='Enter Your Name' className="form-control" id="rsname" />
                </div>
                <div className="mb-3">
                    <label htmlFor="rsbname" className="form-label">Business Name</label>
                    <input type="text" placeholder='Enter Your Business Name' className="form-control" id="rsbname" />
                </div>
                <div className="mb-3">
                    <label htmlFor="rsemail" className="form-label">Seller Email</label>
                    <input type="email" placeholder='Enter Your Email' className="form-control" id="rsemail" />
                </div>
                <div className="mb-3">
                    <label htmlFor="rsmobile" className="form-label">Seller Mobile Number</label>
                    <input type="number" autoComplete='rsmobile' placeholder='Enter Your Mobile Number' className="form-control" id="rsmobile" />
                </div>
                <div className="mb-3">
                    <label htmlFor="rsuname" className="form-label">Seller Username</label>
                    <input type="text" autoComplete='username' placeholder='Enter Your Username' className="form-control" id="rsuname" />
                </div>
                <div className="mb-3">
                    <label htmlFor="rsaddr" className="form-label">Business Address</label>
                    <input type="text" autoComplete='address' placeholder='Enter Your Address' className="form-control" id="rsaddr" />
                </div>
                <div className="mb-3">
                    <label htmlFor="rspass" className="form-label">Password</label>
                    <input type="password" autoComplete='new-password' placeholder='Create Password' className="form-control" id="rspass" />
                </div>
                <div className="mb-3">
                    <label htmlFor="rscpass" className="form-label">Confirm Password</label>
                    <input type="password" autoComplete='new-password' placeholder='Confirm Password' className="form-control" id="rscpass" />
                </div>
                <button type="submit" className="btn btn-outline-primary">Submit</button>
                <button type="reset" className="btn btn-outline-primary ms-2">Reset</button>
            </form>
        </div>

    )
}

