import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

LogsSearch.propTypes = {
    onSearch: PropTypes.func.isRequired,
};

export default function LogsSearch({ onSearch }) {
    const handleSearchChange = (event) => {
        onSearch(event.target.value);
    };

    return (
        <TextField
            size="small"
            variant="outlined"
            placeholder="Search logs.."
            color="primary"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                ),
            }}
            onChange={handleSearchChange}
        />
    );
}
