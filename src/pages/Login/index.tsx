import React, { ChangeEvent, useCallback, useRef, useState } from "react";

import logoImg from '../../assets/images/logo.svg';
import landingImg from '../../assets/images/landing.svg';
import './styles.css';

import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import getValidationErrors from "../../utils/getValidationErrors";

import { useAuth } from "../../hooks/AuthContext";
import { useToast } from "../../hooks/ToastContext";

import Input from "../../components/Input";

interface FormAttributes {
  cpf: string;
  password: string;
}

const Login: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({cpf: ''})

  function handleInputChange(event:  ChangeEvent<HTMLInputElement>) {
    const { id, value} = event.target;
    setFormData({ ...formData, [id]: value });
    if( id === "cpf"){
      const mask = value.replace(/\D/g, '').replace(/^(\d{3})(\d{3})?(\d{3})?(\d{2})?/, "$1.$2.$3-$4");
      setFormData({ ...formData, [id]: mask });
    }
  } 

  const handleSubmit = useCallback(
    async (data: FormAttributes) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          cpf: Yup.string().required("CPF obrigatório"),
          password: Yup.string().required("Senha obrigatória"),
        });

        await schema.validate(data, {
          abortEarly: false, // mostra todos os erros vindos do Yup
        });

        await signIn({
          cpf: data.cpf,
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
          description: "CPF ou senha incorreto",
        });
      }
    }, [addToast, signIn]
  );

    return (
        <div id="page-login">
            <div id="page-login-content" className="container">
                <div className="logo-container">
                    <img src={logoImg} alt="UniVS" />
                    <h2>Faça seu login</h2>
                    <div className="form-login">
                        <Form onSubmit={handleSubmit} ref={formRef}>
                            <Input 
                              value={formData.cpf} 
                              name="cpf" 
                              id="cpf" 
                              maxLength={14} 
                              placeholder="Digite seu CPF" 
                              onChange={handleInputChange} 
                              type="text" 
                            />
                            <Input name="password" placeholder="Digite sua senha" type="password" />
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
                    Todos os direitos <a target="_blank" rel="noopener noreferrer" href="https://univs.edu.br"> &copy; UniVS</a>
                </span>
            </div>
        </div>
    )
}

export default Login;