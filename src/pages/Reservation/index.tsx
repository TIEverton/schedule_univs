import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './styles.css';

import logoImg from '../../assets/images/logo.svg';
import logoutIcon from '../../assets/images/icons/log-out.svg'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const Reservation: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [selectedHours, setSelectedHours] = useState(false);
    const [nameSemana, setNameSemana] = useState('');

    function handleClickOpen() {
      setOpen(true);
    };
  
    function handleClose() {
      setOpen(false);
    };

    function handleConfirm() {
        setSelectedHours(true);
        setOpen(false);
    };

    var data = new Date();
    var dias = new Array(
     'Domingo', 'Segunda', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
    );
    
    var nomeSemana = dias[data.getDay()]

    useEffect( () => {
        setNameSemana(nomeSemana);
    }, []);

    return (
        
        <div id="page-reservation" className="container">
            <header className="page-header">
                <img src={logoImg} alt="UniVS" />
                <Link to="#">
                    <img src={logoutIcon} alt="Logout" /> Sair
                </Link>
            </header>
            <main>
                <div className="main-item-menu">
                    <p id="name-week">Hoje é <b> {nameSemana}</b></p>
                    <select>
                        <option>Laborátorio 1</option>
                        <option>Laborátorio 2</option>
                        <option>Laborátorio 3</option>
                    </select>
                </div>
                <ul className="main-content-reservation">
                    <li  className={selectedHours ? "caixa teste" : "caixa"} id="caixa1" onClick={handleClickOpen}>
                        <p><b>07:00 - 08:00</b></p>
                        <p>15 vagas</p>
                    </li>
                </ul>
            </main>
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        <p>Confirme sua vaga</p>
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText  id="alert-dialog-description">
                        <p>Deseja confirmar sua vaga para o horário <b>07:00 - 08:00</b>?</p>
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} id="btn-exit-modal" color="secondary">
                        Sair
                    </Button>
                    <Button onClick={handleConfirm} id="btn-confirm-modal">
                        Confirmar
                    </Button>
                    </DialogActions>
                </Dialog>
                </div>
        </div>
    )
}

export default Reservation;