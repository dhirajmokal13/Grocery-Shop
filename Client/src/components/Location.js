import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { serverLink } from '../App';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { useGeoLocation, idSelector } from '../javascript/first';
import swal from 'sweetalert';

function Location() {
    const navigate = useNavigate();
    let location = useGeoLocation();
    const [sellers, setSellers] = useState([]);
    const [position, setPosition] = useState([19.855880, 74.382425]);

    const mapRef = useRef();
    const setMyPosition = (data) => {
        let locSel = data.filter((da) => { return da._id === JSON.parse(localStorage.getItem('userData')).id })[0].location;
        if (locSel[0] !== '0') {
            setPosition(locSel);
            mapRef.current.flyTo(locSel, 14, { animate: true })
        }
    }

    const getSellers = () => {
        axios.get(`${serverLink}/sellers/data`)
            .then(res => {
                setSellers(res.data);
                setMyPosition(res.data);
            }).catch(err => {
                console.log(err);
            })
    };

    const myLocation = () => {
        if (location.loaded && !location.error) {
            setPosition([location.coordinates.lat, location.coordinates.lng]);
            mapRef.current.flyTo([location.coordinates.lat, location.coordinates.lng], 14, { animate: true })
        } else {
            swal({
                title: 'Failed',
                text: location.error,
                icon: 'error',
            });
        }
    }

    const icon = new L.icon({
        iconUrl: `${serverLink}/shop.svg`,
        iconSize: [21, 21],
        iconAnchor: [17, 45],
        popupAnchor: [3, -46]
    });

    const icon1 = new L.icon({
        iconUrl: `${serverLink}/marker.png`,
        iconSize: [25, 25],
        iconAnchor: [17, 45],
        popupAnchor: [3, -46]
    });

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
        getSellers();
    }, [navigate]);

    const updateLocation = () => {
        let dragLoc = idSelector('location').value;
        let loc;
        dragLoc !== 'false' ? loc = [dragLoc] : loc = position;
        axios.patch(`${serverLink}/seller/location/${JSON.parse(localStorage.getItem('userData')).id}/${loc}`)
            .then(res => {
                if (res.data) {
                    swal({ title: 'success', text: 'Location Updated Successfull', icon: 'success', })
                } else {
                    swal({ title: 'error', text: 'Location Not Updated', icon: 'error', })
                }
            }).catch(err => {
                console.log(err)
            })
    }

    return (
        <>
            <div className="container mt-5">
                <h3 className="text-secondary mt-3 text-center my-2">Locations</h3>
                <MapContainer center={position} zoom={14} ref={mapRef}>
                    <TileLayer
                        url='https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=VQ7cKnFLBfkQ4RMUGDmT'
                        attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                    />
                    {
                        sellers && sellers.map((item, index) => {
                            if (item._id === JSON.parse(localStorage.getItem('userData')).id && item.location[0] !== '0') {
                                return (
                                    <Marker position={[item.location[0], item.location[1]]} icon={icon1} key={index}>
                                        <Popup>
                                            <span className='text-success mb-2'>{item.businessName} ({item.sellerName}) Me</span>
                                            <span className="text-secondary d-block"><i className="bi bi-envelope-at-fill"></i> {item.email}</span>
                                            <span className="text-secondary d-block"><i className="bi bi-house"></i> {item.addr}</span>
                                        </Popup>
                                    </Marker>
                                )
                            } else {
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
                            }
                        })
                    }
                    {position !== [] && (<Marker draggable={true} eventHandlers={{
                        dragend: (e) => {
                            idSelector('location').value = [e.target._latlng.lat, e.target._latlng.lng];
                            console.log(e.target._latlng)
                        },
                    }} icon={icon1} position={[location.coordinates.lat, location.coordinates.lng]}><Popup>My Current Location <span className='text-success ms-2'>{` [${location.coordinates.lat},${location.coordinates.lng}]`}</span></Popup></Marker>)}
                </MapContainer>
                <div className=' mx-auto d-block text-center'>
                    <button className='btn btn-outline-success my-3 me-2' onClick={myLocation}>My Location</button>
                    <button className='btn btn-outline-success my-3 me-2' onClick={updateLocation}>Update Location</button>
                    <input type="text" className='form-control' style={{ display: 'inline-block', width: '20rem' }} id='location' value={false} disabled />
                </div>
            </div>
        </>
    )
}

export default Location