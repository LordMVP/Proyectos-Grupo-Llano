import React from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes, { element } from 'prop-types';
import { mostrarAlerta } from '../../../store/actions/AplicacionAcciones';
import { Encabezado } from './components';

const IngresoVariablesBase = (props) => {
    return (
        <div>
            <Encabezado mostrarAlerta={props.mostrarAlerta} />
        </div>
    )
};

IngresoVariablesBase.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(IngresoVariablesBase);

export { VistaRedux as RIngresoVariablesBase };