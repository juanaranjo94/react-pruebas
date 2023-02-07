import React from 'react'
import {  NavLink } from 'react-router-dom';



const Header = () => {

  return (
    <ul className="header" >
        <li>
        <NavLink to="/en">
          English
        </NavLink>
        </li>
        <li>
        <NavLink to="/es">
          Español
        </NavLink>
        </li>
    </ul>
  )
}

export default Header