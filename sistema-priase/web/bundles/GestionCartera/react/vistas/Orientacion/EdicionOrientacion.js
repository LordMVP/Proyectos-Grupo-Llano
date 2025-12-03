
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { RVistaBotones, RVistaFormEdicion, RVistaFormCondicion } from '../index';

/**
 * Vista Principal del componente de edición Orientación
 */
class EdicionOrientacion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //showFormOrientacion: this.props.showFormOrientacion
        }
       
    }

    componentDidUpdate(nextProps) {
       //const { showFormOrientacion } = this.props
      
    }

   


    render() {
        const { showFormEdicion } = this.props.gestionCarteraState
        return (
            <Fragment>
                {showFormEdicion && (<h1>Registro Orientación</h1>)}
                    {showFormEdicion && (<div className="customHr">.</div>)}
                    <br />
                    {showFormEdicion && (<Form>
                        <RVistaFormEdicion />
                        <RVistaFormCondicion />
                        <RVistaBotones />
                    </Form>)}
            </Fragment>
        );
    }
}
EdicionOrientacion.propTypes = {
    history: PropTypes.object
};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        
    }, dispatch);
};
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(EdicionOrientacion);
export { VistaRedux as RVistaEdicionOrientacion };