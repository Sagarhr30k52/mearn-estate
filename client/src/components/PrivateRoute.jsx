import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

function PrivateRoute() {
    const {currentUser} = useSelector((state) => state.user.user);

  return (
    currentUser? <Outlet></Outlet> : <Navigate to="/sign-in"/>
  )
}

export default PrivateRoute
