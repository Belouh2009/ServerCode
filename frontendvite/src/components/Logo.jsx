import React from 'react';
import {FireFilled} from '@ant-design/icons';
import logo from './image/logo.png';
import '../index.css'

const Logo = () => {
  return (
    <div className='logo'>
      <div className="logo-icon">
      <img src={logo} alt="Logo" className="animated-logo" />
      </div>
    </div>
  )
}

export default Logo
