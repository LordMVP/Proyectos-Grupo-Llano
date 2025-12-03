import React, { Component, Fragment, useState } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes, { element } from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, Fecha, Tab } from 'appfuture-react';
import axios from 'axios';
import { formatearArray } from '../../../global/util_nominaciones';
import RUTAS_API from '../../../global/rutas_api';
import { mostrarAlerta } from '../../../store/actions/AplicacionAcciones';
import Switch from "react-switch";
import moment from 'moment';
import { Encabezado } from './components';

const RecalculoAprovechamiento = (props) => {
    return (
        <div>
            <div>RecalculoAprovechamiento</div>
            <Encabezado mostrarAlerta={props.mostrarAlerta} />
        </div>
    )
};


RecalculoAprovechamiento.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(RecalculoAprovechamiento);

export { VistaRedux as RRecalculoAprovechamiento };