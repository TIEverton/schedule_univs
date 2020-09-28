import React from 'react';
import { Link } from 'react-router-dom';

import './styles.css';

import logoImg from '../../assets/images/logo.svg';
import landingImg from '../../assets/images/landing.svg';

import purpleHeartIcon from '../../assets/images/icons/purple-heart.svg';

function Login() {
    return (
        <div id="page-login">
            <div id="page-login-content" className="container">
                <div className="logo-container">
                    <img src={logoImg} alt="UniVS" />
                    <h2>Faça seu login</h2>
                    <div className="form-login">
                        <input placeholder="Digite sua matrícula" type="text"></input>
                        <input placeholder="Digite sua senha" type="password"></input>
                        <button>ENTRAR</button>
                    </div>
                </div>

                <img 
                    src={landingImg}
                    alt="Plataforma de agendamento."
                    className="hero-image"
                />

                <div className="buttons-container">

                </div>
                <span className="total-connections">
                    Feito com <img src={purpleHeartIcon} alt="coração roxo"/> por Everton e Paulo
                </span>
            </div>
        </div>
    )
}

export default Login;