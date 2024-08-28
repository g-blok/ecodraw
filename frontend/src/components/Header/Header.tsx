import React from 'react';
import { NavLink  } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import IconButton from '@mui/material/IconButton';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const Header: React.FC = () => {
  return (
    <div className='static w-full flex justify-between items-center p-4 border-b-2'>
        <img src={logo} alt='Logo' className='h-12 mr-2' />
        <div className='grow'>
            <nav className='flex justify-start gap-4 text-xl'>
            <NavLink
                to='/'
                className={({ isActive }) =>
                    `px-4 py-2 rounded-xl hover:opacity-60 ${
                        isActive ? 'font-bold' : 'font-normal'
                    }`
                }
            >
                Home
            </NavLink>
            <NavLink
                to='/sites'
                className={({ isActive }) =>
                    `px-4 py-2 rounded-xl hover:opacity-60 ${
                        isActive ? 'font-bold' : 'font-normal'
                    }`
                }
            >
                Sites
            </NavLink>
            <NavLink
                to='/management'
                className={({ isActive }) =>
                    `px-4 py-2 rounded-xl hover:opacity-60 ${
                        isActive ? 'font-bold' : 'font-normal'
                    }`
                }
            >
                Management
            </NavLink>
            </nav>
        </div>
        <IconButton className="w-16 h-16" size="large" aria-label="open settings">
            <SettingsOutlinedIcon />
        </IconButton>
    </div>
  );
};

export default Header;
