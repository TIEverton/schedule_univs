import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './styles.css';

import { useAuth } from "../../hooks/AuthContext";

import { useToast } from "../../hooks/ToastContext";

import api from '../../services/api';

import logoImg from '../../assets/images/logo.svg';
import logoutIcon from '../../assets/images/icons/log-out.svg'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Delete from '@material-ui/icons/Delete';

interface ItemLaboratory {
    id: string;
    name: string;
}

interface ItemSchedule {
    id: number;
    ranger_time: string, 
    vacancies: number,
}

interface ItemUser {
    id: number;
    name: string;
    registration: string;
}

const Dash: React.FC = () => {
    const { signOut, user } = useAuth();
    const { addToast } = useToast();
    const [open, setOpen] = useState(false);
    const [selectedHours, setSelectedHours] = useState(false);
    const [nameSemana, setNameSemana] = useState('');

    const [selectLaboratories, setSelectLaboratories] = useState<number>(1);
    const [laboratories, setLaboratories] = useState<ItemLaboratory[]>([]);

    const [schedules, setSchedules] = useState<ItemSchedule[]>([]);
    const [selectSchedule, setSelectSchedule] = useState<ItemSchedule>();

    const [users, setUsers] = useState<ItemUser[]>([]);

    useEffect(() => {
        async function loadLaboratories() {
            const response = await api.get('laboratories');
            setLaboratories(response.data);
        }

        loadLaboratories();
    }, []);

    useEffect(() => {
        async function loadSchedule() {
            const response = await api.get(`laboratories/${selectLaboratories}`);
            setSchedules(response.data)
        }

        loadSchedule();
    }, [selectLaboratories]);

    function handleLaboratory(event:  ChangeEvent<HTMLSelectElement>){
        const id = event.target.value;
        setSelectLaboratories(parseInt(id));
    }

    async function handleClickOpen(id: number) {
        schedules.map(schedule => {
            if (schedule.id === id) {
                setSelectSchedule(schedule);
            }
        });

        const response = await api.get(`schedules/${id}`);

        setUsers(response.data[0].users);

        setOpen(true);
    };

    async function handleCancelReservation(id: number) {
        try {
            await api.delete(`reservationsAdmin/${selectSchedule?.id}/${id}`); 
            const response = await api.get(`schedules/${selectSchedule?.id}`);

            setUsers(response.data[0].users);
            addToast({
                type: "success",
                title: "Horário excluído",
                description: "O horário foi excluído com sucesso!",
            });
        } catch (error) {
            addToast({
                type: "error",
                title: "Erro ao excluir",
                description: "Algo ocorreu, tente novamente.",
            });
        }
    }
  
    function handleClose() {
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
                <div className="header-logo-logout">
                    <img src={logoImg} alt="UniVS" />
                    <Link to="#" className="logout-mobile" onClick={signOut}>
                            <img src={logoutIcon} alt="Logout" title="Sair"/>
                    </Link> 
                </div>
                <p id="name-user">
                    <p>Olá, <strong>{user.name}</strong></p>             
                    <Link to="#" className="logout-desktop" onClick={signOut}>
                        <img src={logoutIcon} alt="Logout" title="Sair"/>
                    </Link> 
                </p>   
            </header>
            <main>
                <div className="main-item-menu">
                    <p id="name-week">Hoje é <b> {nameSemana}</b></p>
                    <select onChange={ handleLaboratory } value={selectLaboratories}>
                        { laboratories.map(laboratory => (
                            <option key={laboratory.id} value={laboratory.id}>{laboratory.name}</option>
                        )) }
                    </select>
                </div>
                {
                selectLaboratories !== 0 ? (
                    <ul className="main-content-reservation">
                        { schedules.map(schedule => (
                            <li key={schedule.id} className="caixa" id="caixa1" onClick={() => handleClickOpen(schedule.id)}>
                                <p><b>{schedule.ranger_time}</b></p>
                                <p>{schedule.vacancies} vagas</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p id="description-laboratories">Selecione um laborátorio.</p>
                )
                }
            </main>
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        <p>Reservas do horário: <b>{selectSchedule?.ranger_time}</b></p>
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText  id="alert-dialog-description-dashboard">
                        {
                            users.length > 0 ? 
                                users.map(user => (
                                    <div className="container-user-list" key={user.id}>
                                        <div>
                                            <p><b>Nome:</b> {user.name}</p>
                                            <p><b>Matrícula:</b> {user.registration}</p>
                                        </div>
                                        <div className="button-container-list">
                                            <Button onClick={() => handleCancelReservation(user.id)} variant="contained" color="secondary">
                                                <Delete />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            :
                            <div>
                                <p><b>Nenhuma reserva para esse horário.</b></p>
                            </div>
                        }
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} id="btn-exit-modal" color="secondary">
                        Sair
                    </Button>
                    </DialogActions>
                </Dialog>
                </div>
        </div>
    )
}

export default Dash;