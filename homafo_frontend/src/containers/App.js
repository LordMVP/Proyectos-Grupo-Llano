
import React, { Component, Fragment } from 'react';
import LoadingBar from 'react-redux-loading-bar'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Notifications from 'react-notification-system-redux'
import menuOptions from '../data/menuOptions';
import RUTAS_VISTA from '../data/rutasVistas';
import session from '../data/session';
import axios from 'axios';
import Loader from '../components/loader/Init'
import AppBar from '../components/appBar/Index';
import Menu from '../components/navbar/Menu'
import Main from './Main'
import { MenuLayout } from 'components/MenuLayout';
// import styles from '../styles/modules/navigation.css'


class AppContainer extends Component {
    
    state = {
        opcionesMenu: [],
        sesion: null,
        listaEmpresas: [],
      };

    constructor(props) {
        super(props);        
    }
    
    
    componentDidMount() {
        this.setState({ loading: false })
        this.loadMenu();
        this.setState({ opcionesMenu: [] });

    }

    loadMenu() {
         this.setState({ opcionesMenu: menuOptions });                
        console.log(menuOptions);
        axios.interceptors.request.use(function (config) {
            const token = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNjAwMDk0MjQ5NzgyIiwianRpIjoiNTA1Mzg0IiwiaWF0IjoxNjAwMDk0MjQ5LCJleHAiOjE2MzYwOTQyNDksImlkRW1wcmVzYSI6MzE3LCJpZEFjY2VzbyI6IjUwNTM4NCIsImlkVXN1YXJpbyI6MTUxOCwiaW5mbyI6eyJpZFBlcmZpbCI6IjIxIiwibm9tYnJlRW1wcmVzYSI6IkJpb2Fncmljb2xhIGRlbCBMbGFubyBTLkEuIEUuUy5QIn19.jdzj-jNu50RBRQxooubE_uvX8imIW1vJdD_bAjE5qG8";
            config.headers.Authorization = token;      
            return config;
         });
        // axios("http://localhost:8080/api/global/menu", null)
        axios("http://190.14.232.146:8081/homafo/api/global/menu", null)
            .then(respuesta => {                
                    console.log(respuesta);
                    const datos = respuesta.data;
                    this.setState({ opcionesMenu: datos });                
            });
        return;
    }
    // shouldComponentUpdate(nextProps, nextState) {     
    //     return nextProps.notifications.length < 3;
    // }
    app = () => {
        const { notifications, authenticated } = this.props;
        const {opcionesMenu} = this.state;
        return (
            <div>                
                <MenuLayout rutasVista={RUTAS_VISTA} opcionesMenu={menuOptions} sesion={session}>
                {/* <MenuLayout rutasVista={RUTAS_VISTA} opcionesMenu={opcionesMenu} sesion={session}> */}
                </MenuLayout>
            </div >
        )
    }
    render() {
        const { loading } = this.state
        return (
            <Fragment>
                {loading ? <Loader /> : this.app()}
            </Fragment>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        authenticated: state.user.authenticated,
        notifications: state.notifications,

    }
}

export default withRouter(connect(mapStateToProps)(AppContainer))

