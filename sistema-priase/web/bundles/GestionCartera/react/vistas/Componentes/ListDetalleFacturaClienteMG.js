import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Button, Row, Col} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { textFilter } from 'react-bootstrap-table2-filter';
import { RVistaFormModalConceptosMG } from '../index';
import { ACCION } from '../../store/actions/TiposAcciones';


/**
 * Lista Vista Consolidada Cliente del componente Maestro de Gestión
 */
class ListDetalleFacturaClienteMG extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columnas: this.columnas,
            selectRow: this.selectRow
        }

    }
    columnas = [{
        dataField: 'df3',
        isDummyField: true,
        text: 'Conceptos',
        formatter: (cellContent, row) => {
            return (
                <Button onClick={() => this.seleccionarItem(row)} variant="primary">Detalle</Button>
            );
            
        }
    }, {
        dataField: 'fac_numero',
        text: 'Factura',
        sort: true
    }, {
        dataField: 'fac_fecvence',
        text: 'Fecha Vencimiento',
        sort: true
    }, {
        dataField: 'fac_vlrreal',
        text: 'Valor Real',
        sort: true
    }, {
        dataField: 'fac_sdroreal',
        text: 'Saldo Real',
        sort: true
    }, {
        dataField: 'dmge_tarifa',
        text: 'Tarifa',
        sort: true
    }, {
        dataField: 'dmge_capital',
        text: 'Capital',
        sort: true
    }, {
        dataField: 'dmge_interes',
        text: 'Interes',
        sort: true
    }, {
        dataField: 'dmge_pagos',
        text: 'Pagos',
        sort: true
    }, {
        dataField: 'dmge_fechaultimopago',
        text: 'Fecha Último Pago',
        sort: true
    }, {
        dataField: 'dmge_cambiovalor',
        text: 'Cambio de Valor',
        sort: true
    },{
        dataField: 'dmge_novedad',
        text: 'Novedad',
        sort: true
    }];

    /**
   * Método encargado de obtener los datos generales para el formulario del listados de novedad visita
  */
    componentDidMount() {

    }

    seleccionarItem = (item) => {
        let data=JSON.parse(item.dmge_detallefactura);
        this.props.setDataDetalle();
        this.props.setShowDataDetalle(data);
   }

   

    render() {
        const { dataDetalle } = this.props.gestionCarteraState
        return (
            <Fragment>
                <h1>Detalle facturas del cliente</h1>
                <div className="customHr">.</div>
                <br />
                <BootstrapTable bootstrap4 wrapperClasses="table-responsive" rowClasses="text-nowrap" striped bordered hover keyField='dmge_ideregistro' data={dataDetalle} columns={this.state.columnas} pagination={paginationFactory()} filter={filterFactory()} filterPosition="top" noDataIndication="No hay registros disponible" />
                <RVistaFormModalConceptosMG/>
            </Fragment>
        );
    }
}

ListDetalleFacturaClienteMG.propTypes = {
    history: PropTypes.object
};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
});

const mapDispatchToProps = dispatch => ({
    selecionarItem(item) {
        dispatch({
            type: ACCION.SELECCIONAR_ITEM,
            payload: item
        })
    },
   
    setDataDetalle() {
        dispatch({
            type: ACCION.SET_MODALCONCEPTO_MC
        })
    }
    ,
   
    setShowDataDetalle(data) {
        dispatch({
            type: ACCION.SET_DATAMODALCONCEPTO_MC,
            payload: data
        })
    }
});

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ListDetalleFacturaClienteMG);
export { VistaRedux as RVistaListDetalleFacturaClienteMG };