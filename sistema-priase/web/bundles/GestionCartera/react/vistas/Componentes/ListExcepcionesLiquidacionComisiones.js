import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Button, Row, Col} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { textFilter } from 'react-bootstrap-table2-filter';
import { ACCION } from '../../store/actions/TiposAcciones';


/**
 * Lista Excepciones del componente liquidación de comisiones
 */
class ListExcepcionesLiquidacionComisiones extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columnas: this.columnas
           
        }

    }
    columnas = [ {
        dataField: 'eje_ejecutivo',
        text: 'Ejecutivo',
        sort: true
    }, {
        dataField: 'con_concepto',
        text: 'Concepto',
        sort: true
    }, {
        dataField: 'msn_excepcion',
        text: 'Mensaje Excepción',
        sort: true
    }, {
        dataField: 'mliq_fechaexcepcion',
        text: 'Fecha Excepción',
        sort: true
    }];

   

    /**
   * Método encargado de obtener los datos generales para el formulario del listados de novedad visita
  */
    componentDidMount() {

    }
   

    render() {
        const { data } = this.props.gestionCarteraState
        return (
            <Fragment>
                    <h1>Resultados de Excepciones </h1>
                    <div className="customHr">.</div>
                    <br />
                    <BootstrapTable bootstrap4 wrapperClasses="table-responsive" rowClasses="text-nowrap" striped bordered hover keyField='mliq_idregistro' data={data} columns={this.state.columnas}  pagination={paginationFactory()} filter={filterFactory()} filterPosition="top" noDataIndication="No hay registros disponible" />
               
            </Fragment>
        );
    }
}

ListExcepcionesLiquidacionComisiones.propTypes = {
    history: PropTypes.object
};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera
});

const mapDispatchToProps = dispatch => ({
    selecionarItem(item) {
        dispatch({
            type: ACCION.SELECCIONAR_ITEM,
            payload: item
        })
    },
    setShowFormEdicion(condicion) {
        dispatch({
            type: ACCION.SET_FORM_EDICION,
            payload: condicion
        })
    },
    setDataDetalle(data) {
        dispatch({
            type: ACCION.SET_DATA_DETALLE,
            payload: data
        })
    },
    
    listarItem() {
        dispatch({
            type: ACCION.LISTAR_ITEM,
            payload: "Listar "
        })

    }
});

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ListExcepcionesLiquidacionComisiones);
export { VistaRedux as RVistaListExcepcionesLiquidacionComisiones };