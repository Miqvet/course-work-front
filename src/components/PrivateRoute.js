import { Navigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const PrivateRoute = ({ children }) => {
    if (!AuthService.isAuthenticated()) {
        return <Navigate to="/sign-in" />;
    }

    return children;
};

export default PrivateRoute; 