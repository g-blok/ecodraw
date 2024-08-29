import React, { useCallback, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { STAGES } from '../../../../common/constants/constants';
import { updateSiteStage } from '../../../../services/apiService';
import { SiteData, Stage } from '../../../../common/types/types';
import { debounce } from 'lodash';

interface StageSelectProps {
    site: SiteData
}

const StageSelect: React.FC<StageSelectProps> = ({ site }) => {
    const initialStage = STAGES.find(stage => stage.value === site.stage.toLowerCase());
    const [selectedStage, setStage] = useState<Stage | undefined>(initialStage ?? undefined);

    const handleChange = (event: SelectChangeEvent) => {
        const newStage = STAGES.find(stage => stage.value === event.target.value)
        if (!newStage) return;
        setStage(newStage);
        debouncedUpdateSite(newStage.value);
		return () => {
			debouncedUpdateSite.cancel();
		};
    };

	// Update site stage in database
	const debouncedUpdateSite = useCallback(
		debounce(async (selectedStage: string) => {
			try {
				await updateSiteStage(site, selectedStage);
			} catch (error) {
				console.error('Error updating site stage:', error);
			}
		}, 1000),
		[site]
	);

    return (
        <Tooltip placement="top" enterDelay={500} title={selectedStage?.description}>
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                <Select
                    id="stage-select"
                    value={selectedStage?.value}
                    onChange={handleChange}
                    className='w-40 h-10'
                >
                    {STAGES.map((stage, index) => {
                        return <MenuItem className='text-primary' value={stage.value} key={index}>{stage.display}</MenuItem>
                    })}
                </Select>
                </FormControl>
            </Box>
        </Tooltip>
    );
}

export default StageSelect;
