import React, { useEffect, useState } from 'react';
import { MenuLayout } from '../components/MenuLayout';
import RUTAS_VISTA from '../data/rutasVistas';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SesionApi from '../api/common/SesionApi';
//import LoginPage from '../pages/login/LoginPage';
import LoginPage from '../pages/login/LoginPage';
import NewLoader from '../components/loader/NewLoader';


function AppNew() {
    const sesionApi = new SesionApi();
    const [opciones, setOpciones] = useState([]);
    const [sesion, setSesion] = useState(undefined);
    const [loading, setLoading] = useState(true);
    //const [state] = useReducer(testReducer, initialState);
    const fetchMenu = async (): Promise<void> => {
        setLoading(true);
        sesionApi.getMenu().then(response => {
            setOpciones(response.data);
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
        });
        //const response = await sesionApi.getMenu();

        //setLoading(false);
    }

    const validarSesion = async () => {
        //setLoading(true);
        /*sesionApi.getSesion().then(response => {
            setSesion(response.data);
            fetchMenu();
            setLoading(false);
        });*/
        const response = await sesionApi.getSesion(); 
        setSesion(response.data);        
        //setLoading(false);
    }
    useEffect(() => {
        fetchMenu();
        validarSesion();
    }, []);

    const renderPage = !sesion ? (<LoginPage />) : (
        <div>
            <ToastContainer
                position="top-right"
                autoClose={4500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                draggable
                pauseOnHover
            />
            <MenuLayout rutasVista={RUTAS_VISTA} opcionesMenu={opciones} sesion={sesion}>
            </MenuLayout>

        </div>
    );
    //const renderLogin = loading ? <Loader/> : <LoginPage />;    
    if (loading) {
        return <NewLoader/>;
    } else {
        return renderPage;
    }
}

export default AppNew;
