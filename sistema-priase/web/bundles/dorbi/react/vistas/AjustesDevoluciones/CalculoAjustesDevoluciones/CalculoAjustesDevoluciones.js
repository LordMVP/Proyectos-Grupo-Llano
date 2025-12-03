import React from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes, { element } from 'prop-types';
import { mostrarAlerta } from '../../../store/actions/AplicacionAcciones';
import { Encabezado } from './components';



const CalculoAjustesDevoluciones = (props) => {
    return (
        <div>
            <div>Calculo Ajustes</div>
            <Encabezado mostrarAlerta={props.mostrarAlerta} />
        </div>
    )
};


CalculoAjustesDevoluciones.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(CalculoAjustesDevoluciones);

export { VistaRedux as RCalculoAjustesDevoluciones };