import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'src/sections/authentication/auth/auth-context';

const ProtectedRoute = ({ element }) => {
    const { isLoggedIn, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return isLoggedIn ? element : <Navigate to="/auth/login" replace />;
};

ProtectedRoute.propTypes = {
    element: PropTypes.node,
};

export default ProtectedRoute;
