import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import {
    Box,
    FormGroup,
    Typography,
    Stack,
    Button,
    InputAdornment,
    IconButton,
    FormControlLabel,
    Checkbox,
} from '@mui/material';

import { VisibilityOutlined, VisibilityOffOutlined } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';

import CustomTextField from 'src/components/forms/custom-text-fields';

import { useAuth } from './auth-context';

const AuthLogin = ({ title, subtitle, subtext }) => {
    const navigate = useNavigate();
    const { isLoggedIn, handleLogin } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/dashboard', { replace: true });
        }
    }, [isLoggedIn, navigate]);

    const validateEmail = () => {
        if (!email) {
            setEmailError('Email tidak boleh kosong');
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Format email salah. Contoh format: contoh@email.com');
        } else {
            setEmailError('');
        }
    };

    const validatePassword = () => {
        if (!password) {
            setPasswordError('Password tidak boleh kosong');
        } else {
            setPasswordError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        validateEmail();
        validatePassword();

        if (!emailError && !passwordError) {
            setIsLoading(true); // Set loading true
            const loginSuccess = await handleLogin(email, password);
            setIsLoading(false); // Set loading false after login attempt

            if (!loginSuccess) {
                setLoginError('Email atau password salah!');
            }
        } else {
            setLoginError('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            <Stack>
                <Box>
                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        component="label"
                        htmlFor="email"
                        mb="5px"
                    >
                        Email
                    </Typography>
                    <CustomTextField
                        id="email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={validateEmail}
                        error={!!emailError}
                        helperText={emailError}
                    />
                </Box>
                <Box mt="25px">
                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        component="label"
                        htmlFor="password"
                        mb="5px"
                    >
                        Password
                    </Typography>
                    <CustomTextField
                        id="password"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={validatePassword}
                        error={!!passwordError}
                        helperText={passwordError}
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
                </Box>
                <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox />} label="Remember this Device" />
                    </FormGroup>
                </Stack>
            </Stack>
            <Box>
                <Button color="primary" variant="contained" size="large" fullWidth type="submit" disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : 'Masuk'}
                </Button>
            </Box>
            {loginError && !emailError && !passwordError && (
                <Typography display="flex" variant="body1" color="error" textAlign="center" justifyContent="center" mt={2}>
                    {loginError}
                </Typography>
            )}
            {subtitle}
        </form>
    );
};

AuthLogin.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.node,
    subtext: PropTypes.node,
};

AuthLogin.defaultProps = {
    title: null,
    subtitle: null,
    subtext: null,
};

export default AuthLogin;
