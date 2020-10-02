import React from 'react';
import { Switch } from 'react-router-dom';

import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';

import Dashboard from '../pages/Dashboard';

import Route from './Route';

function Routes(){
    return (
        <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            
            <Route path="/dashboard" component={Dashboard} isPrivate />
        </Switch>
    );
}

export default Routes;