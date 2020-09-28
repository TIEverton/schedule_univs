import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

import Reservation from './pages/Reservation';
import Dashboard from './pages/Dashboard';

function Routes(){
    return (
        <BrowserRouter>
            <Route path="/" exact component={Landing} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/reservation" component={Reservation} />
            <Route path="/dashboard" component={Dashboard} />
        </BrowserRouter>
    );
}

export default Routes;