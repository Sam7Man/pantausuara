import React, { createContext, useState, useCallback, useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { userGetId } from '../api-request/User';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userName, setUserName] = useState("");

    const fetchUserData = useCallback(async () => {
        try {
            const token = Cookies.get('token');
            if (!token) return;

            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.sub);
            setUserEmail(decodedToken.name);

            const response = await userGetId(decodedToken.sub);
            if (response && response.data) {
                setUserName(response.data.name);
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const contextValue = useMemo(() => ({
        userId,
        userEmail,
        userName,
        setUserName,
        setUserEmail,
        fetchUserData
    }), [userId, userEmail, userName, setUserName, setUserEmail, fetchUserData]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
