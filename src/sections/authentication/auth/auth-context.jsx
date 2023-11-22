import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import { userLogin } from '../api-request/User';
import { encryptPassword } from './EncryptPassword';
import { useUser } from '../user/user-context';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const { fetchUserData } = useUser();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleLogout = useCallback(() => {
        Cookies.remove('token');
        Cookies.remove('tokenExpires');
        delete axios.defaults.headers.common.Authorization;
        setIsLoggedIn(false);
        navigate('/auth/login');
    }, [navigate]);


    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            const expiryTime = new Date(Cookies.get('tokenExpires'));
            if (expiryTime && expiryTime < new Date()) {
                handleLogout();
            } else {
                setIsLoggedIn(true);
                axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            }
        }

        setLoading(false);
    }, [handleLogout]);


    const handleLogin = useCallback(async (email, password) => {
        const maxRetries = 5; // maximum number of retries
        const retryDelay = 200; // delay between retries in ms

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const encryptedPassword = encryptPassword(password); 
                // eslint-disable-next-line
                const response = await userLogin(
                    { email, password: encryptedPassword },
                    {
                        headers: { 'Content-Type': 'application/json' }
                    });

                const { token } = response.data;
                const expiryTime = new Date();
                expiryTime.setTime(expiryTime.getTime() + 6 * 60 * 60 * 1000); // Expired in 6 hours || 6hr, 60min, 60sec, 1000ms

                Cookies.set('token', token, { expires: expiryTime, secure: true, sameSite: 'strict' });
                setIsLoggedIn(true);
                axios.defaults.headers.common.Authorization = `Bearer ${token}`;
                navigate('/dashboard', { replace: true });
                
                // eslint-disable-next-line
                await fetchUserData();

                // Wait for retryDelay milliseconds before next attempt
                if (attempt < maxRetries - 1) {
                    // eslint-disable-next-line
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                }

                return true;
            } catch (error) {
                console.error('Error during login attempt:', error);
                if (axios.isAxiosError(error) && error.response) {
                    console.error('Error details:', error.response.data);
                }
                setLoginError('Login failed. Please check your credentials.');
            }
        }

        return false;
    }, [navigate, fetchUserData]);


    const contextValue = useMemo(() => (
        {
            isLoggedIn, handleLogout, handleLogin, loginError, setLoginError, loading
        }
    ), [isLoggedIn, handleLogout, handleLogin, loginError, setLoginError, loading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
