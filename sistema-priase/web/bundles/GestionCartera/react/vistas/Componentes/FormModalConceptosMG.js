import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Button, Row, Modal } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { textFilter } from 'react-bootstrap-table2-filter';
import { ACCION } from '../../store/actions/TiposAcciones';

/**
 *componente para modal con los conceptos de detalle de maestro gestión
 */
class FormModalConceptosMG extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columnas: this.columnas,
            hideModal:false,
        }
    }
    columnas = [{
        dataField: 'uni_concepto',
        text: 'Concepto',
        sort: true
    }, {
        dataField: 'con_nombre',
        text: 'Nombre Concepto',
        sort: true
    }, {
        dataField: 'dfac_vlreal',
        text: 'Valor Real',
        sort: true
    }, {
        dataField: 'dfac_slreal',
        text: 'Saldo Real',
        sort: true
    }];

    /*componentDidUpdate(prevProps) { 
        // Uso tipico (no olvides de comparar las props): 
        if (this.props.gestionCarteraState.showModalConceptoMG !== prevProps.gestionCarteraState.showModalConceptoMG) { 
            this.setState({
                formEdicionInfoBasicaMG:this.props.gestionCarteraState.showModalConceptoMG
            });
        } 
    }*/

    handleClose = () => {
        this.props.setDataDetalle();
        
    };
    
    handlehidde = () => {
        this.props.setDataDetalle();
    };
    
    render() {
        const { dataConcepto, showModalConceptoMG } = this.props.gestionCarteraState
        
        return (
            <div>
                <Fragment>
                    <Modal show={showModalConceptoMG} onHide={this.handlehidde }
                     size="lg"
                     aria-labelledby="contained-modal-title-vcenter"
                     centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Conceptos</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <BootstrapTable bootstrap4 wrapperClasses="table-responsive" rowClasses="text-nowrap" striped bordered hover keyField='id' data={dataConcepto} columns={this.state.columnas} pagination={paginationFactory()} filter={filterFactory()} filterPosition="top" noDataIndication="No hay registros disponible" />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>Cerrar</Button>
                        </Modal.Footer>
                    </Modal>
                </Fragment>
            </div>
        );
    }
}
FormModalConceptosMG.propTypes = {
    history: PropTypes.object

};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
});
const mapDispatchToProps = dispatch => ({
    setDataDetalle() {
        dispatch({
            type: ACCION.SET_MODALCONCEPTO_MC
        })
    }
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormModalConceptosMG);
export { VistaRedux as RVistaFormModalConceptosMG };