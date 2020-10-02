import React, { useCallback, useRef } from "react";
import { Link } from "react-router-dom";

import logoImg from '../../assets/images/logo.svg';
import landingImg from '../../assets/images/landing.svg';
import './styles.css';
import purpleHeartIcon from '../../assets/images/icons/purple-heart.svg';

import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import getValidationErrors from "../../utils/getValidationErrors";

import { useAuth } from "../../hooks/AuthContext";
import { useToast } from "../../hooks/ToastContext";

import Input from "../../components/Input";

import api from '../../services/api';

interface FormAttributes {
  registration: string;
  password: string;
}

const Login: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: FormAttributes) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          registration: Yup.string()
            .required("registration obrigatório"),
          password: Yup.string().required("Senha obrigatória"),
        });

        await schema.validate(data, {
          abortEarly: false, // mostra todos os erros vindos do Yup
        });

        await signIn({
          registration: data.registration,
          password: data.password,
        });

      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          
          return;
        }
        addToast({
          type: "error",
          title: "Erro na autenticação",
          description: "Matrícula ou senha incorreta!",
        });
      }
    }, [addToast]
  );

    return (
        <div id="page-login">
            <div id="page-login-content" className="container">
                <div className="logo-container">
                    <img src={logoImg} alt="UniVS" />
                    <h2>Faça seu login</h2>
                    <div className="form-login">
                        <Form onSubmit={handleSubmit} ref={formRef}>
                            <Input name="registration" placeholder="Digite sua matrícula" type="text"></Input>
                            <Input name="password" placeholder="Digite sua senha" type="password"></Input>
                            <button type="submit"> ENTRAR</button>
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

export default Login;