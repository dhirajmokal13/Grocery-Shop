import React, { useState, useEffect, useRef } from 'react'
import '../css/App.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { serverLink } from '../App'
import axios from 'axios';
import { useGeoLocation } from '../javascript/first';
import swal from 'sweetalert';

export const About = () => {
    const [sellers, setSellers] = useState([]);
    let location = useGeoLocation();
    const mapRef = useRef();

    const getSellers = () => {
        axios.get(`${serverLink}/sellers/data`)
            .then(res => {
                setSellers(res.data);
            }).catch(err => {
                console.log(err);
            })
    };

    useEffect(() => {
        getSellers();
    }, []);

    const position = [19.855880, 74.382425];
    const myLocation = () => {
        if (location.loaded && !location.error) {
            mapRef.current.flyTo([location.coordinates.lat, location.coordinates.lng], 14, { animate: true })
        } else {
            swal({
                title: 'Failed',
                text: location.error.message,
                icon: 'error',
            });
        }
    }
    const icon = new L.icon({
        iconUrl: `${serverLink}/shop.svg`,
        iconSize: [25, 25],
        iconAnchor: [17, 45],
        popupAnchor: [3, -46]
    });

    const icon1 = new L.icon({
        iconUrl: `${serverLink}/marker.png`,
        iconSize: [25, 25],
        iconAnchor: [17, 45],
        popupAnchor: [3, -46]
    });
    return (
        <>
            <div className="container about my-5">
                <h3 className="text-center">About Section</h3>
                <p className='text-secondary px-2'>Our Website Grocery Shop Connect Customer and Seller to achieve the goals.  Customers can  register on site and get access to site for use features.</p>
                <p className='text-secondary px-2'>Top Features like online payment gateway, mail sent, Order Status are available on webapp.</p>
                <p className='text-secondary px-2'>Different types of groceries are available on app. we can filter the product on category wise.</p>
            </div>
            <div className="cotainer">
                <h4 className='text-secondary text-center'>Our Sellers Located</h4>
                <MapContainer center={position} zoom={14} ref={mapRef}>
                    <TileLayer
                        url='https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=VQ7cKnFLBfkQ4RMUGDmT'
                        attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                    />
                    {
                        sellers && sellers.map((item, index) => {
                            if (item.location[0] !== '0' && item.location[1] !== '0') {
                                return (
                                    <Marker position={[item.location[0], item.location[1]]} icon={icon} key={index}>
                                        <Popup>
                                            <span className='text-success mb-2'>{item.businessName} ({item.sellerName})</span>
                                            <span className="text-secondary d-block"><i className="bi bi-envelope-at-fill"></i> {item.email}</span>
                                            <span className="text-secondary d-block"><i className="bi bi-house"></i> {item.addr}</span>
                                        </Popup>
                                    </Marker>
                                )
                            }
                            return [];
                        })
                    }

                    {location.loaded && !location.error && (<Marker draggable={true} icon={icon1} position={[location.coordinates.lat, location.coordinates.lng]}><Popup>My Location <span className='text-success ms-2'>{` [${location.coordinates.lat},${location.coordinates.lng}]`}</span></Popup></Marker>)}
                </MapContainer>
                <button className='btn btn-outline-success my-3 mx-auto d-block' onClick={myLocation}>My Location</button>
            </div>
        </>
    )
}
