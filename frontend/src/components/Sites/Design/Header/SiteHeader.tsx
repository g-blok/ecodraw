import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import StageSelect from './StageSelect';
// import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { SiteData } from '../../../../common/types/types'

interface SiteHeaderProps {
  site: SiteData;
}

const SiteHeader: React.FC<SiteHeaderProps> = ({ site }) => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [editedSite, setEditedSite] = useState<Partial<SiteData>>({});

    // const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleEditSite = () => {
        if (editedSite.name && editedSite.path) {
            // updateSite(editedSite);
            handleCloseModal();
        }
    };

    
    return (
        <div className='flex w-full justify-between items-center p-4 pr-8 mb-2 border-b-2'>
            <div className='flex gap-8 items-center'>
                <div className='font-bold'>
                    {site.name}
                </div>
                <StageSelect site={site} />
            </div>
            <div className='flex gap-8 items-center '>
                <div>{site.address}</div>
                {/* <IconButton className="w-16 h-16" size="large" aria-label="open settings" onClick={handleOpenModal}>
                    <EditRoundedIcon />
                </IconButton> */}
            </div>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md"
                    sx={{ width: 400 }}
                    >
                    <Typography variant="h6" component="h2" gutterBottom>
                        Edit Site
                    </Typography>
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={editedSite.name || ''}
                        onChange={(e) => setEditedSite({ ...editedSite, name: e.target.value })}
                    />
                    <TextField
                        label="Path"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={editedSite.path || ''}
                        onChange={(e) => setEditedSite({ ...editedSite, path: e.target.value })}
                    />
                    <TextField
                        label="Address"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={editedSite.address || ''}
                        onChange={(e) => setEditedSite({ ...editedSite, address: e.target.value })}
                    />
                    <TextField
                        label="Market"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={editedSite.market || ''}
                        onChange={(e) => setEditedSite({ ...editedSite, market: e.target.value })}
                    />
                    <TextField
                        label="Metering"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={editedSite.metering || ''}
                        onChange={(e) => setEditedSite({ ...editedSite, metering: e.target.value })}
                    />
                    <div>Revenue Streams</div>
                    <div className='mb-4'>
                        <FormControlLabel control={<Checkbox defaultChecked />} label="SGIP" />
                        <FormControlLabel control={<Checkbox defaultChecked />} label="DRAM" />
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleEditSite}
                        fullWidth
                        className="mt-4"
                    >
                        <EditRoundedIcon />
                        Edit Site
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default SiteHeader;
