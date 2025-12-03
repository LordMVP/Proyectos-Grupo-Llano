import React, { useState, useEffect } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes, { element } from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, Fecha } from 'appfuture-react';
import axios from 'axios';
import { mostrarAlerta } from '../../../store/actions/AplicacionAcciones';
import { Encabezado, Detalle } from './components';

const IngresoToneladas = (props) => {
    const [banderaLDetalle, setBanderaLDetalle] = useState(false);
    const [comboSeleccionado, setComboSeleccionado] = useState(false);

    const [mensaje, setMensaje] = useState({});

    useEffect(() => {
        if (Object.keys(mensaje).length > 0) {
            props.mostrarAlerta(mensaje.tipo, mensaje.mensaje);
            setMensaje({});
        };
    }, [mensaje]);


    const limpiarDetalle = () => {
        setBanderaLDetalle(true);
    }
    const habilitarDetalle = (valor) => {
        setComboSeleccionado(valor);
    }


    return (
        <div>
            <Encabezado limpiarDetalle={limpiarDetalle} habilitarDetalle={habilitarDetalle} setMensaje={setMensaje} />
            {/* <Detalle limpiarDetalle={banderaLDetalle} setBanderaLDetalle={setBanderaLDetalle} comboSeleccionado={comboSeleccionado} /> */}
        </div>
    )
};

IngresoToneladas.propTypes = {
    mostrarAlerta: PropTypes.func
};

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        mostrarAlerta,
    }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(IngresoToneladas);

export { VistaRedux as RIngresoToneladas };