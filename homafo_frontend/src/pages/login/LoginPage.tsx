import * as React from 'react';
import { Redirect } from "react-router-dom";

import AuthService from '../../api/common/AuthService';
import {  Form, Col, Button } from 'react-bootstrap';
import './GestionLogin.scss';
import { setToken } from '../../utils/Utils';

class LoginPage extends React.Component<any, any>{

    //private authService;
    constructor(props: any) {
        super(props);
        //this.authService =  new AuthService();
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeIdEmpresa = this.onChangeIdEmpresa.bind(this);

        this.state = {
            username: "",
            password: "",
            loading: false,
            message: "",
            empresas:[]
        };
    }
    componentDidMount(){
        AuthService.getEmpresasLogin().then(response => {
                this.setState({empresas:response.data});
        });

    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }
    onChangeIdEmpresa(e) {
        console.log(e.target.value);
        this.setState({
            idEmpresa: e.target.value
        });
    }

    handleLogin(e) {
        e.preventDefault();
        this.setState({
            message: "",
            loading: true
        });
        //const $this = this;
        // this.props.history.push("/home");
        AuthService.login(this.state.username, this.state.password, this.state.idEmpresa).then(
            (response) => {
                if (response.headers.authorization) {
                    console.log(response.headers);
                    setToken(response.headers.authorization);
                }
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                this.setState({
                    loading: false,
                    message: resMessage
                });
            }
        );
    }
    render() {
        const empresas = this.state.empresas;
        const empresasOptions = empresas.map((item) => <option key={item.empresaId as number} value={item.empresaId as number}>{item.empresaNombre}</option>);
        if (this.state.auth) {
            return (<Redirect to={this.state.redirect} />);
        } else
            return (
                <React.Fragment>
                    <h1 className='mt-5 login-title'>Ingresa tus datos para acceder a la cuenta</h1>
                    <div className="login-card">
                        <h1>Iniciar sesión</h1>
                        <Form onSubmit={this.handleLogin}>
                            <Form.Row className="align-items-center">
                                <Form.Group as={Col} controlId="codigo">
                                    <Form.Label>Username  {this.state.item?.genIderegistro ? '(editando)' : '(nuevo)'}</Form.Label>
                                    <Form.Control required onChange={this.onChangeUsername} name="username" value={this.state.username} />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="descripcion">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control required onChange={this.onChangePassword} name="password" value={this.state.password} />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="descripcion">
                                    <Form.Label>Empresa</Form.Label>
                                    <Form.Control as="select" required onChange={this.onChangeIdEmpresa} name="idEmpresa" value={this.state.idEmpresa}>
                                        {empresasOptions}
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row className="align-items-center">
                                <Col xs="auto" className="">
                                    <Button size="sm" className="" type="submit">Iniciar Session</Button>
                                </Col>
                            </Form.Row>
                        </Form>
                    </div>
                </React.Fragment>
            );
    }
}

export default LoginPage;