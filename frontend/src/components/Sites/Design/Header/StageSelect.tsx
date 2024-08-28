import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { STAGES } from '../../../../common/constants/constants';

interface StageSelectProps {
    stage: string;
}

const StageSelect: React.FC<StageSelectProps> = ({ stage }) => {
    const initialStage = STAGES.find((stageOption) => stageOption.display === stage)?.value ?? '';
    const [selectedStage, setStage] = React.useState(initialStage);

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
                {STAGES.map((stage, index) => {
                    return <MenuItem className='text-primary' value={stage.value} key={index}>{stage.display}</MenuItem>
                })}
            </Select>
            </FormControl>
        </Box>
    );
}

export default StageSelect;
