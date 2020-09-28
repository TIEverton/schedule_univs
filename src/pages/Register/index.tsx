import React from 'react';
import { Link } from 'react-router-dom';

import './styles.css';

import logoImg from '../../assets/images/logo.svg';
import landingImg from '../../assets/images/landing.svg';

import purpleHeartIcon from '../../assets/images/icons/purple-heart.svg';

function Register() {
    return (
        <div id="page-register">
            <div id="page-register-content" className="container">
                <div className="logo-container">
                    <img src={logoImg} alt="UniVS" />
                    <h2>Faça seu cadastro</h2>
                    <div className="form-register">
                        <input placeholder="Digite seu nome" type="text"></input>
                        <input placeholder="Digite sua matrícula" type="text"></input>
                        <input placeholder="Digite uma senha" type="password"></input>
                        <select>
                            <option>Enfermagem</option>
                            <option>Direito</option>
                            <option>Administração</option>
                        </select>
                        <button>CADASTRAR</button>
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

export default Register;