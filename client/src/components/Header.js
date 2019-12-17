import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className='nav-wrapper'>
      <Link style={{marginLeft: 10}} to={'/'} className='brand-logo'>It courses</Link>        

      <ul id='nav-mobile' className='right hide-on-med-and-down'>
        <li>
          <Link to={'/shop'} >Shop</Link>                    
        </li>
        <li>
          <Link to={'/about'} >About</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;