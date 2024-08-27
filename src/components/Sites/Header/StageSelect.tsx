import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface StageSelectProps {
    stage: string;
}

const StageSelect: React.FC<StageSelectProps> = ({ stage }) => {
    const [selectedStage, setStage] = React.useState(stage);

    const handleChange = (event: SelectChangeEvent) => {
        setStage(event.target.value as string);
        // TODO: update value in DB
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
            <Select
                id="stage-select"
                value={selectedStage}
                onChange={handleChange}
                className='w-40 h-10'
            >
                <MenuItem className='text-primary' value={'design'}>Design</MenuItem>
                <MenuItem value={'sold'}>Sold</MenuItem>
                <MenuItem value={'operational'}>Operational</MenuItem>
            </Select>
            </FormControl>
        </Box>
    );
}

export default StageSelect;
