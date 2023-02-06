import React from 'react'
import { Link } from 'react-router-dom'

export const Footer = () => {
    return (
        <>
            <footer className="bg-light text-center text-lg-start">
                <div className="text-center p-3" style={{ backgroundcolor: "rgba(0, 0, 0, 0.2)" }}>
                    © 2023 Copyright:
                    <Link className="text-dark"> Grocery Shop</Link>
                </div>
            </footer>
        </>
    )
}

