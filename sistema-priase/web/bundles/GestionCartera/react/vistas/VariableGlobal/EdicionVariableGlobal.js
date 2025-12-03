import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col, ButtonGroup } from 'react-bootstrap';
import { RVistaBotones, RVistaFormVariableGlobal } from '../index';

/**
 * Vista Principal del componente de edición de Variables globales
 */
class EdicionVariableGlobal extends Component {
    constructor(props) {
        super(props)
        
    }

    render() {
        const { showFormEdicion } = this.props.gestionCarteraState
        return (
            <Fragment>
                {showFormEdicion && (<h1>Registro Variable Global</h1>)}
                    {showFormEdicion && (<div className="customHr">.</div>)}
                    <br />
                    {showFormEdicion && (<Form>
                        <RVistaFormVariableGlobal />
                        <RVistaBotones />
                    </Form>)}
            </Fragment>
        );
    }

}
EdicionVariableGlobal.propTypes = {
    history: PropTypes.object
};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        
    }, dispatch);
};
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(EdicionVariableGlobal);
export { VistaRedux as RVistaEdicionVariableGlobal };