import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SiteMap from './SiteMap'
import { SiteData } from '../../../common/types/types';
import IconButton from '@mui/material/IconButton';
import { STAGES } from '../../../common/constants/constants';
import { v4 as uuidv4 } from 'uuid';
import { createSite } from '../../../services/apiService';
import { debounce } from 'lodash'
import { useLoadScript } from '@react-google-maps/api';
import { getTotalCapacity, getHardwareCost } from '../../../utils/siteUtils';
import { numberToString, numberToMoneyString } from '../../../utils/formatUtils';

const libraries = ['places'];

interface SiteTableProps {
  sites: SiteData[];
  onAddSite: (site: SiteData) => void;
  onAddSiteLoading: (loading: boolean) => void;
}

const SiteTable: React.FC<SiteTableProps> = ({ sites, onAddSite, onAddSiteLoading }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredData, setFilteredData] = useState<SiteData[]>(sites);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [newSite, setNewSite] = useState<Partial<SiteData>>({});
  const [selectedSite, setSelectedSite] = useState<Partial<SiteData>>({});

  useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const getCityFromLatLng = (lat: number, lng: number): string => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat: lat, lng: lng};
    let city = '';

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (!results) return city;
      if (status === 'OK') {
        if (results[0]) {
          const addressComponents = results[0].address_components;
          for (const component of addressComponents) {
            if (component.types.includes('locality')) {
              city = component.long_name;
            }
          }
        } else {
          console.error('No results found');
        }
      } else {
        console.error('Geocoder failed due to: ' + status);
      }
    });
    return city;
  };

  const toTitleCase = (str: string) => {
    return str.toLowerCase().split(' ').map((word: string) => {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

  const getCapacity = (): string => {
    if (!selectedSite?.layout) return '-';
    return numberToString(getTotalCapacity(selectedSite.layout.flat()));
  }

  const getCost = (): string => {
    if (!selectedSite?.layout) return '-';
    return numberToMoneyString(getHardwareCost(selectedSite.layout.flat()));
  }

  const getRevenueStreams = (): string | null => {
    if (!selectedSite?.revenue_streams) return null;
    return selectedSite.revenue_streams.join(', ');
  }

  const handleRowClick = (path: string) => {
    const site = sites.find((site) => site.path === path)
    if (!site) return;
    setSelectedSite(site)
  };

  const handleDesignSite = (path: string) => {
    navigate(`/sites/${path}`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredData(
      sites.filter((row) =>
        row.name.toLowerCase().includes(query) ||
        row.stage.toLowerCase().includes(query) ||
        row.address.toLowerCase().includes(query) ||
        row.created_date.toLowerCase().includes(query) ||
        row.updated_date.toLowerCase().includes(query)
      )
    );
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleAddSite = async () => {
    onAddSiteLoading(true);
    if (newSite.name) {
      newSite.path = checkPath(newSite.name.toLowerCase());
      newSite.stage = STAGES[0].value;
      newSite.id = uuidv4();
      if (newSite.lat && newSite.long) {
        newSite.address = getCityFromLatLng(newSite.lat, newSite.long)
      }
      await debouncedCreateSite(newSite);
      // setFilteredData([...filteredData, newSite as SiteData]);
      setNewSite({});
      handleCloseModal();
    }
  };

  // Create new site in database
	const debouncedCreateSite = useCallback(
		debounce(async (newSite: Partial<SiteData>) => {
			try {
				await createSite(newSite);
        onAddSite(newSite as SiteData);
        setTimeout(() => {
          onAddSiteLoading(false);
        }, 3000)
			} catch (error) {
				console.error('Error create site:', error);
			}
		}, 1000),
		[]
	);

  const checkPath = (path: string, suf?: number): string => {
    let suffix: number = suf || 1;
    if (sites.find(site => site.path === path)) {
      path = path + suffix;
      suffix += 1;
      checkPath(path, suffix); 
    }
    return path
  }

  return (
    <div className='flex p-10'>
      <div className='w-full'>
        <div className='flex items-center mb-4 justify-between'>
          <TextField
            label='Search'
            variant='outlined'
            value={searchQuery}
            onChange={handleSearchChange}
            className='mr-4'
          />
          <Button variant='contained' aria-label='add site' onClick={handleOpenModal}>
            <AddRoundedIcon />
            Add Site
          </Button>
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Stage</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Updated Date</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow
                  key={row.path}
                  onClick={() => handleRowClick(row.path)}
                  className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} cursor-pointer`}
                >
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{toTitleCase(row.stage)}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>{row.created_date}</TableCell>
                  <TableCell>{row.updated_date}</TableCell>
                  <TableCell align='center' padding='none'>
                    <IconButton aria-label='design site' onClick={() => handleDesignSite(row.path)}>
                      <EditRoundedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {Object.keys(selectedSite).length > 0 && (
        <div className='pl-20 w-2/3'>
          <div className='flex justify-between items-end mb-4'>
            <div className='text-2xl font-bold'>
              {selectedSite.name}
            </div>
            <div className='ml-4 whitespace-nowrap'>
              {selectedSite.address}
            </div>
          </div>
          <div className='flex flex-col gap-2 mb-4'>
            <div className='flex justify-between'>
              <div>Capacity</div>
              <div className='pl-10 font-bold'>{getCapacity()} kWh</div>
            </div>
            <div className='flex justify-between'>
              <div>Hardare Cost</div>
              <div className='pl-10 font-bold'>{getCost()}</div>
            </div>
            <div className='flex justify-between'>
              <div>Metering</div>
              <div className='pl-10 font-bold'>{selectedSite.metering}</div>
            </div>
            <div className='flex justify-between'>
              <div>Revenue Streams</div>
              <div className='pl-10 font-bold'>{getRevenueStreams()}</div>
            </div>
          </div>
          <SiteMap site={selectedSite}/>
        </div>
      )}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md'
          sx={{ width: 400 }}
        >
          <Typography variant='h6' component='h2' gutterBottom>
            Add New Site
          </Typography>
          <TextField
            label='Name'
            variant='outlined'
            fullWidth
            margin='normal'
            value={newSite.name || ''}
            onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
          />
          <TextField
            label='Latitude'
            variant='outlined'
            fullWidth
            margin='normal'
            value={newSite.lat || ''}
            type='number'
            onChange={(e) => setNewSite({ ...newSite, lat: e.target.value })}
          />
          <TextField
            label='Longitude'
            variant='outlined'
            fullWidth
            margin='normal'
            value={newSite.long || ''}
            type='number'
            onChange={(e) => setNewSite({ ...newSite, long: e.target.value })}
          />
          <TextField
            label='Market'
            variant='outlined'
            fullWidth
            margin='normal'
            value={newSite.market || ''}
            onChange={(e) => setNewSite({ ...newSite, market: e.target.value })}
          />
          <TextField
            label='Metering'
            variant='outlined'
            fullWidth
            margin='normal'
            value={newSite.metering || ''}
            onChange={(e) => setNewSite({ ...newSite, metering: e.target.value })}
          />
          <Button
            variant='contained'
            color='primary'
            onClick={handleAddSite}
            fullWidth
            className='mt-4'
          >
            <AddRoundedIcon />
            Add Site
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default SiteTable;
