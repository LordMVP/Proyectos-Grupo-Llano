
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { RVistaBotones, RVistaFormCondicion, RVistaFormMetasGestion } from '../index';

/**
 * Vista Principal del componente de edición metas de gestión
 */
class EdicionMetasGestion extends Component {
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
                {showFormEdicion && (<h1>Registro Meta de Gestión</h1>)}
                    {showFormEdicion && (<div className="customHr">.</div>)}
                    <br />
                    {showFormEdicion && (<Form className="fuente-size">

                        <RVistaFormMetasGestion />
                        <RVistaFormCondicion />
                        <RVistaBotones />
                    </Form>)}
            </Fragment>
        );
    }
}
EdicionMetasGestion.propTypes = {
    history: PropTypes.object
};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        
    }, dispatch);
};
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(EdicionMetasGestion);
export { VistaRedux as RVistaEdicionMetasGestion };