
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { RVistaBotones, RVistaFormEjecutivo } from '../index';


/**
 * Vista Principal del componente de edición Ejecutivo
 */
class EdicionEjecutivo extends Component {
    constructor(props) {
        super(props)
        this.state = {
           
        }
        
    }

    

    render() {
        const { showFormEdicion } = this.props.gestionCarteraState
        return (
            <div>
                <Fragment>
                {showFormEdicion && (<h1>Registro Ejecutivo</h1>)}
                    {showFormEdicion && (<div className="customHr">.</div>)}
                    <br />
                    {showFormEdicion && (<Form>
                        <RVistaFormEjecutivo />
                        <RVistaBotones />
                    </Form>)}
            </Fragment>
            </div>
        );
    }
}
EdicionEjecutivo.propTypes = {
    history: PropTypes.object
};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        
    }, dispatch);
};
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(EdicionEjecutivo);
export { VistaRedux as RVistaEdicionEjecutivo };