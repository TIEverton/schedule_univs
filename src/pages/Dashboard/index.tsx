import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from "../../hooks/AuthContext";

import Reservation from '../../components/Reservation';
import Dash from '../../components/Dash';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [type, setType] = useState<number>(0);
    
    useEffect( () => {
        setType(user.user_type_id)
    }, [user.user_type_id]);

    return (
        <div id="page-reservation" className="container">
        {  
            type === 1 &&
            <>
                <Reservation />
            </>
        }
        {
            type === 2 && 
            <>
                <Dash />
            </>
        }
        </div>
    )
}

export default Dashboard;