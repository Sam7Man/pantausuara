import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

import { userGetId, userLogin } from '../api-request/User';
import { encryptPassword } from './EncryptPassword';
import { useUser } from '../user/user-context';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const { setUserName, setUserEmail, userEmail } = useUser();
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
        try {
            const encryptedPassword = encryptPassword(password);
            const response = await userLogin(
                { email, password: encryptedPassword },
                {
                    headers: { 'Content-Type': 'application/json' }
                });

            const { token } = response.data;
            // const token = response.data.token;
            const expiryTime = new Date();
            expiryTime.setTime(expiryTime.getTime() + 6 * 60 * 60 * 1000); // Expired in 6 hours || 6hr, 60min, 60sec, 1000ms

            Cookies.set('token', token, { expires: expiryTime, secure: true, sameSite: 'strict' });
            setIsLoggedIn(true);
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            navigate('/dashboard', { replace: true });
            
            const decodedToken = jwtDecode(token);
            const userDataResponse = await userGetId(decodedToken.sub);
            if (userDataResponse) {
                const { name } = userDataResponse.data;
                setUserName(name);
                setUserEmail(userEmail);
            }

            return true;
        } catch (error) {
            console.error('Error during login:', error); 
            return false;
        }
    }, [navigate, setUserName, userEmail, setUserEmail]);


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
