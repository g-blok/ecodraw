import React, { useState } from 'react';
import { NavLink  } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import IconButton from '@mui/material/IconButton';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Header: React.FC = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    
    const handleCloseSettings = () => {
        handleCloseModal();
    };

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
            <IconButton className="w-16 h-16" size="large" aria-label="open settings"  onClick={handleOpenModal}>
                <SettingsOutlinedIcon />
            </IconButton>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md"
                    sx={{ width: 400 }}
                    >
                    <Typography variant="h6" component="h2" gutterBottom>
                        System Settings
                    </Typography>
                    <div className='my-4'>
                        Hope you are enjoying the app! :)
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCloseSettings}
                        fullWidth
                        className="mt-4"
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default Header;
