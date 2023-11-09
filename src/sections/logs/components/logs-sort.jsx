import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

LogsSort.propTypes = {
    options: PropTypes.array.isRequired,
    onSort: PropTypes.func.isRequired,
};

export default function LogsSort({ options, onSort }) {
    const [sortValue, setSortValue] = React.useState(options[0].value);

    const handleSortChange = (event) => {
        setSortValue(event.target.value);
        onSort(event.target.value);
    };

    return (
        <TextField select size="small" value={sortValue} onChange={handleSortChange}>
            {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
    );
}
