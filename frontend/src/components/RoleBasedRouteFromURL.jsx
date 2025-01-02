import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleBasedRouteFromURL = ({ element }) => {
  const { role: urlRole } = useParams();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== urlRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

export default RoleBasedRouteFromURL;
