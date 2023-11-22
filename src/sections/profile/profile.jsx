import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Box, TextField, Button, Alert, Stack, Typography, Divider, IconButton, InputAdornment, Card, Container } from '@mui/material';
import { VisibilityOutlined, VisibilityOffOutlined } from '@mui/icons-material';

import { useUser } from '../authentication/user/user-context';
import { userChangePassword } from '../authentication/api-request/User';

const PasswordInput = ({ value, label, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <TextField
            type={showPassword ? "text" : "password"}
            label={label}
            value={value}
            onChange={onChange}
            fullWidth
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};

const ProfilePage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const { userEmail, userName } = useUser();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        setName(userName);
        setEmail(userEmail);
        // eslint-disable-next-line
    }, [setName, setEmail]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            setError("New Password and Confirm New Password do not match!");
            return;
        }

        try {
            await userChangePassword({
                old_password: currentPassword,
                new_password: newPassword
            });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setError("");
            setSuccessMessage("Password updated successfully!");

            // Log the user out after changing password
            // setTimeout(() => {
            //      handleLogout();
            // }, 1500); //1.5 sec
        } catch (err) {
            setError("Error updating password.");
            console.error("Error updating password:", err);
        }
    };

    const handleReset = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setError("");
        setSuccessMessage("");
    };

    return (
        <Container>
            <Card>
                <Box
                    component="form"
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, m: 2 }}
                    onSubmit={handleSubmit}
                >
                    <Typography variant="h4">My Profile</Typography>
                    <Divider />
                    <TextField sx={{ mt: 1 }}
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        disabled
                    />
                    <TextField sx={{ mt: 1 }}
                        label="Nama"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                    />
                    <PasswordInput sx={{ mt: 1 }}
                        label="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <PasswordInput sx={{ mt: 1 }}
                        label="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <PasswordInput sx={{ mt: 1 }}
                        label="Confirm New Password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    <Stack spacing={2}>
                        {error && <Alert variant="outlined" severity="error" color="secondary">{error}</Alert>}
                        {successMessage && <Alert variant="outlined" severity="success">{successMessage}</Alert>}
                    </Stack>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                        <Button variant="outlined" onClick={handleReset}>
                            Reset
                        </Button>
                    </Box>
                </Box>
            </Card>
        </Container >
    );
};

PasswordInput.propTypes = {
    value: PropTypes.string.isRequired,
    label: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

export default ProfilePage;
