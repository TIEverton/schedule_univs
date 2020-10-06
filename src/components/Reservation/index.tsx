import React, { ChangeEvent, useEffect, useState } from 'react';
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

interface ItemLaboratory {
    id: string;
    name: string;
}

interface ItemDay {
    id: number;
    name: string;
}

interface ItemSchedule {
    id: number;
    laboratory_id: string,
    ranger_time: string, 
    vacancies: number,
    users: Object[]
}

const Reservation: React.FC = () => {
    const { signOut, user } = useAuth();
    const { addToast } = useToast();
    var data = new Date();
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const [semana, setSemana] = useState<ItemDay[]>([]);
    const [selectDay, setSelectDay] = useState<number>(0);

    const [selectLaboratories, setSelectLaboratories] = useState<number>(0);
    const [laboratories, setLaboratories] = useState<ItemLaboratory[]>([]);

    const [schedules, setSchedules] = useState<ItemSchedule[]>([]);
    const [selectSchedules, setSelectSchedules] = useState<ItemSchedule>();

    useEffect(() => {
        async function loadLaboratories() {
            const response = await api.get('laboratories');
            setLaboratories(response.data);
        }

        loadLaboratories();
    }, []);

    useEffect(() => {
        async function loadSchedule() {
            const response = await api.get(`reservations/${selectLaboratories}/${selectDay}`);
            setSchedules(response.data);
        }

        loadSchedule();
    }, [selectLaboratories, selectDay]);

    function handleLaboratory(event:  ChangeEvent<HTMLSelectElement>){
        const id = event.target.value;
        setSelectLaboratories(parseInt(id));
    }

    function handleDay(event:  ChangeEvent<HTMLSelectElement>){
        const id = event.target.value;
        setSelectDay(parseInt(id));
    }

    function handleClickOpen(id: number) {
        schedules.map(schedule => {
            if (schedule.id === id) {
                setSelectSchedules(schedule);
            }
        })
        setOpen(true);
    };

    function handleClickDelete(id: number) {
        schedules.map(schedule => {
            if (schedule.id === id) {
                setSelectSchedules(schedule);
            }
        })
        setOpenDelete(true);
    }
  
    function handleClose() {
      setOpen(false);
      setOpenDelete(false);
    };

    async function handleConfirm() {
        try {
            await api.post('reservations', { 
                schedule_id: selectSchedules?.id,
                day_id: selectDay
            });
            const resp = await api.get(`reservations/${selectSchedules?.laboratory_id}/${selectDay}`);
            setSchedules(resp.data);
            setOpen(false);

            addToast({
                type: "success",
                title: "Reserva feita",
                description: "Sua reserva foi confirmada com sucesso.",
            });
        } catch (err) {
            addToast({
                type: "error",
                title: "Erro ao reservar",
                description: "Esse horário não tem mais vagas.",
            });
        }
    };

    async function handleConfirmDelete() {
        try {
            const deleteMessage = await api.delete(`reservations/${selectSchedules?.id}`);
            const resp = await api.get(`reservations/${selectSchedules?.laboratory_id}/${selectDay}`);
            setSchedules(resp.data);
            setOpenDelete(false);
            addToast({
                type: "error",
                title: "Horário excluído",
                description: deleteMessage.data.message,
            });
        } catch (err) {
            addToast({
                type: "error",
                title: "Erro ao excluir",
            });
        }
    }
    
    useEffect(() => {
        const semana = new Array<ItemDay>(
            {id: 1, name: 'Segunda-feira'},
            {id: 2, name: 'Terça-feira'},
            {id: 3, name: 'Quarta-feira'},
            {id: 4, name: 'Quinta-feira'},
            {id: 5, name: 'Sexta-feira'},
        );

        const day_id = data.getDay();
        const hora = data.getHours();

        var semanaFilter = new Array<ItemDay>()
        var i = 0;

        semana.map(day => {
            if(hora < 17){
                if (day.id >= day_id) {
                    semanaFilter[i] = day;
                    i++;
                }
            }else{
                if (day.id > day_id) {
                    semanaFilter[i] = day;
                    i++;
                }
            }
        });

        setSemana(semanaFilter);
    }, []);
    
    //var nomeSemana = dias[data.getDay()]

    // useEffect( () => {
    //     setNameSemana(nomeSemana);
    // }, []);

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
                    <select onChange={ handleDay } value={selectDay}>
                        <option value={0}> Selecione aqui o dia</option>
                            { semana.map(day => (
                                <option key={day.id} value={day.id}>{day.name}</option>
                            ))}
                    </select>

                    <select onChange={ handleLaboratory } value={selectLaboratories}>
                        <option value={0}> Selecione aqui o laborátorio</option>
                            { laboratories.map(laboratory => (
                                <option key={laboratory.id} value={laboratory.id}>{laboratory.name}</option>
                        )) }
                    </select>
                </div>
                {
                    selectLaboratories !== 0 && selectDay !== 0 ? (
                        <ul className="main-content-reservation">
                            { schedules.map(schedule => (
                                schedule.users.length > 0 ? (
                                    <li  className="caixa reservation-color"  onClick={() => handleClickDelete(schedule.id)}>
                                        <p><b>{schedule.ranger_time}</b></p>
                                        <p>{schedule.vacancies} vagas</p>
                                    </li> 
                                ) 
                                : 
                                (
                                    schedule.vacancies > 0 ? 
                                    ( 

                                        <li  className="caixa" onClick={() => handleClickOpen(schedule.id)}>
                                            <p><b>{schedule.ranger_time}</b></p>
                                            <p>{schedule.vacancies} vagas</p>
                                        </li> 
                                    ) :
                                    (   
                                        <li  className="caixa unavailable">
                                            <p><b>{schedule.ranger_time}</b></p>
                                            <p>{schedule.vacancies} vagas</p>
                                        </li> 
                                    ) 
                                )
                            )) }
                        </ul>
                    ) : (
                        <p id="description-laboratories">Selecione um horário e um laborátorio.</p>
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
                        <p>Confirme sua vaga</p>
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText  id="alert-dialog-description">
                        <p>Deseja confirmar sua vaga para o horário <b>{selectSchedules?.ranger_time}</b>?</p>
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

                <Dialog
                    open={openDelete}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        <p>Cancelar a reserva</p>
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText  id="alert-dialog-description">
                        <p>Deseja confirmar a exclução da vaga para o horário <b>{selectSchedules?.ranger_time}</b>?</p>
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} id="btn-exit-modal" color="secondary">
                        Sair
                    </Button>
                    <Button onClick={handleConfirmDelete} id="btn-confirm-modal">
                        Confirmar
                    </Button>
                    </DialogActions>
                </Dialog>
                </div>
        </div>
    )
}

export default Reservation;