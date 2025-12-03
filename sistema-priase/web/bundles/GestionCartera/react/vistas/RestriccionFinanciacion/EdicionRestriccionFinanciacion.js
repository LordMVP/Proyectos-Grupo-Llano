
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { RVistaBotones, RVistaFormRestriccionFinanciacion } from '../index';

/**
 * Vista Principal del componente de edición Restricción financiación condonación
 */
class EdicionRestriccionFinanciacion extends Component {
    constructor(props) {
        super(props)
        this.state = {
           
        }
       
    }

    componentDidUpdate(nextProps) {
       
    }

    render() {
        const { showFormEdicion } = this.props.gestionCarteraState
        return (
            <Fragment>
                {showFormEdicion && (<h1>Registro Restricción Financiación/Condonación</h1>)}
                    {showFormEdicion && (<div className="customHr">.</div>)}
                    <br />
                    {showFormEdicion && (<Form>
                        <RVistaFormRestriccionFinanciacion />
                        <RVistaBotones />
                    </Form>)}
            </Fragment>
        );
    }
}
EdicionRestriccionFinanciacion.propTypes = {
    history: PropTypes.object
};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        
    }, dispatch);
};
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(EdicionRestriccionFinanciacion);
export { VistaRedux as RVistaEdicionRestriccionFinanciacion };