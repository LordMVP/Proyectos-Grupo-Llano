
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { RVistaBotones, RVistaFormNovedadVisita } from '../index';

/**
 * Vista Principal del componente de edición novedad visita
 */
class EdicionNovedadVisita extends Component {
    constructor(props) {
        super(props)
        this.state = {
           
        }
       
    }

    
    render() {
        const { showFormEdicion } = this.props.gestionCarteraState
        return (
            <Fragment>
                {showFormEdicion && (<h1>Registro Novedad Visita</h1>)}
                    {showFormEdicion && (<div className="customHr">.</div>)}
                    <br />
                    {showFormEdicion && (<Form>
                        <RVistaFormNovedadVisita />
                        <RVistaBotones />
                    </Form>)}
            </Fragment>
        );
    }
}
EdicionNovedadVisita.propTypes = {
    history: PropTypes.object
};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        
    }, dispatch);
};
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(EdicionNovedadVisita);
export { VistaRedux as RVistaEdicionNovedadVisita };