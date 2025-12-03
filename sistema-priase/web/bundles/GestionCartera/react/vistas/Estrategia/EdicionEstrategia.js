
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { RVistaBotones, RVistaFormEdicion, RVistaFormCondicion, RVistaFormAsignacion } from '../index';

/**
 * Vista Principal del componente de edición Estrategia
 */
class EdicionEstrategia extends Component {
    constructor(props) {
        super(props)
        this.state = {
           
        }
       
    }

    componentDidUpdate(nextProps) {
       //const { showFormOrientacion } = this.props
      
    }

   
    render() {
        const { showFormEdicion } = this.props.gestionCarteraState
        return (
            <Fragment>
                {showFormEdicion && (<h1>Registro Estrategia</h1>)}
                    {showFormEdicion && (<div className="customHr">.</div>)}
                    <br />
                    {showFormEdicion && (<Form>
                        <RVistaFormEdicion />
                        <RVistaFormAsignacion />
                        <RVistaFormCondicion />
                        <RVistaBotones />
                    </Form>)}
            </Fragment>
        );
    }
}
EdicionEstrategia.propTypes = {
    history: PropTypes.object
};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        
    }, dispatch);
};
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(EdicionEstrategia);
export { VistaRedux as RVistaEdicionEstrategia };