import React from 'react';
import { Link } from 'react-router-dom';

import './styles.css';

import logoImg from '../../assets/images/logo.svg';
import landingImg from '../../assets/images/landing.svg';

import loginIcon from '../../assets/images/icons/login.svg';
import rocketIcon from '../../assets/images/icons/rocket.svg';

function Landing() {
    return (
        <div id="page-landing">
            <div id="page-landing-content" className="container">
                <div className="logo-container">
                    <img src={logoImg} alt="UniVS" />
                    <h2>Agende sua vaga agora mesmo</h2>
                </div>
                
                <img 
                    src={landingImg}
                    alt="Plataforma de agendamento."
                    className="hero-image-landing"
                />

                <div className="buttons-container">
                    <Link to="/login" className="login">
                        <img src={loginIcon} alt="Login"/>
                        Login
                    </Link>

                    <Link to="/register" className="rocket">
                        <img src={rocketIcon} alt="Registre-se"/>
                        Registrar-se
                    </Link>

                </div>

                <span className="total-connections">
                    Todos os direitos <a target="_blank" rel="noopener noreferrer" href="https://univs.edu.br"> &copy; UniVS</a>
                </span>
            </div>
        </div>
    )
}

export default Landing;