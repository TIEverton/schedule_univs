import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import './styles.css';

import logoImg from '../../assets/images/logo.svg';
import landingImg from '../../assets/images/landing.svg';
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";
import getValidationErrors from "../../utils/getValidationErrors";

import { useAuth } from "../../hooks/AuthContext";
import { useToast } from "../../hooks/ToastContext";

import purpleHeartIcon from '../../assets/images/icons/purple-heart.svg';
import Input from "../../components/Input";

import api from '../../services/api';

interface ItemCategory {
    id: string;
    name: string;
}

interface FormAttributes {
    name: String;
    registration: string;
    password: string;
    course_id: number;
}

const Register: React.FC = () => {
    const { signIn } = useAuth();
    const { addToast } = useToast();
    const history = useHistory();
    const formRef = useRef<FormHandles>(null);
    const [selectCourses, setSelectCourses] = useState<number>(0);
    const [courses, setCourses] = useState<ItemCategory[]>([]);

    useEffect(() => {
        api.get('courses').then(response => {
          setCourses(response.data);
        });
    }, []);

    function handleCourses(event:  ChangeEvent<HTMLSelectElement>){
        const id = event.target.value;
        setSelectCourses(parseInt(id));
        console.log(selectCourses)
    }

    async function handleSubmit(data: FormAttributes){ 
        try {
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                name: Yup.string().required("É necessário um nome"),
                registration: Yup.string().required("É necessário uma matrícula"), 
                password: Yup.string().required("É necessário uma senha").min(6, "Mínimo 6 dígitos!"), 
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            const register = {
                name: data.name,
                password: data.password,
                password_confirmation: data.password,
                registration: data.registration,
                course_id: selectCourses
            }

            await api.post('register', register);

            await signIn({
                registration: data.registration,
                password: data.password,
            });
            
            history.push("/dashboard");
        } catch(err) {
            if (err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err);
                formRef.current?.setErrors(errors);
                return;
            }
            addToast({
                type: "error",
                title: "Erro no cadastro",
                description: "Ocorreu um error ao fazer cadastro, tente novamente.",
            });
        }
    }

    return (
        <div id="page-register">
            <div id="page-register-content" className="container">
                <div className="logo-container">
                    <img src={logoImg} alt="UniVS" />
                    <h2>Faça seu cadastro</h2>
                    <div className="form-register">
                        <Form onSubmit={handleSubmit} className="form" ref={formRef}>
                            <Input placeholder="Digite seu nome" type="text" id="name" name="name"></Input>
                            <Input placeholder="Digite sua matrícula" type="text" id="registration" name="registration"></Input>
                            <Input placeholder="Digite uma senha" type="password" id="password" name="password"></Input>
                            <select id="courses" onChange={ handleCourses } value={selectCourses} name="courses">
                                <option value={0}> Selecione um curso</option>
                                { courses.map(courses => (
                                    <option key={courses.id} value={courses.id}>{courses.name}</option>
                                )) }
                            </select>
                            <button type="submit">CADASTRAR</button>
                        </Form>
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
                    Feito com <img src={purpleHeartIcon} alt="coração roxo"/> por <a target="_blank" href="https://instagram.com/evertonti"> Everton</a> e <a target="_blank" href="https://instagram.com/xpaulocesarx"> Paulo</a>
                </span>
            </div>
        </div>
    )
}

export default Register;