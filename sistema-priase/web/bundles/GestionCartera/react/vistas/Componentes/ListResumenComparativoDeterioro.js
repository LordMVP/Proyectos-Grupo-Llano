import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Button, Form, Row, Col} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { dateFilter, textFilter } from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { ACCION } from '../../store/actions/TiposAcciones';

/**
 * Lista de resultados del proceso de inicializar Deterioro NIFF
 */
class ListResumenComparativoDeterioro extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columnas: this.columnas
            
        }
        
    }
    
    columnas = [
    {
        dataField: 'resumen_proceso',
        text: 'Periodo',
    },{
        dataField: 'valorDeterioA100',
        text: 'Deterioro 100%',
    },{
        dataField: 'valorDeterioMenorA360',
        text: 'Deterioro < 360',
    }];
 
   
    /**
   * Método encargado de obtener los datos generales para el formulario del listados de novedad visita
  */
    componentDidMount() {

    }


    render() {
        const { dataResumenDN } = this.props.gestionCarteraState;
       
        return (
            <Fragment>
            <h1>Resumen del Proceso</h1>
            <div className="customHr">.</div>
            <br />
            <div className="child-parent">
                <BootstrapTable bootstrap4 wrapperClasses="table-responsive" rowClasses="text-nowrap" striped bordered hover keyField='id' data={dataResumenDN} columns={this.state.columnas}  noDataIndication="No hay registros disponibles" />
                <br/>
            </div>
    
        </Fragment>
        );
    }
}

ListResumenComparativoDeterioro.propTypes = {
    history: PropTypes.object
};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
});

const mapDispatchToProps = dispatch => ({
    mostrarAlerta() {
        dispatch({
            type: ACCION.MOSTRAR_ALERTA,
            payload: {}
        })
    },
 
});

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ListResumenComparativoDeterioro);
export { VistaRedux as RVistaListResumenComparativoDeterioro };