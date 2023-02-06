import { useEffect, useState } from "react";

export function idSelector(dt) {
  return document.getElementById(dt);
}

export const productType = ['Bakery and Bread', 'Meat and Seafood', 'Oils, Sauces, Salad Dressings, and Condiments', 'Cereals and Breakfast Foods', 'Soups and Canned Goods', 'Frozen Foods', 'Dairy, Cheese, and Eggs', 'Snacks and Crackers', 'Fruits and Vegetables', 'Others'];

export function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export const useGeoLocation = () => {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: "", lng: "" },
  });

  const onSuccess = (location) => {
    setLocation({
      loaded: true,
      coordinates: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
    });
  };

  const onError = (error) => {
    setLocation({
      loaded: true,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      onError({
        code: 0,
        message: "Geolocation not supported",
      });
    } else {
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    }
  }, []);

  return location;
};
