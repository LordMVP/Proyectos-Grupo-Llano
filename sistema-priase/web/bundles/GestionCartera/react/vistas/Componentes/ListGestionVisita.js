import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Button, Form, Row, Col} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { dateFilter, textFilter } from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { RVistaFormModalConceptosMG } from '../index';
import { ACCION } from '../../store/actions/TiposAcciones';


/**
 * Lista de Gestión Visita para maestro de gestión
 */
class ListGestionVisita extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columnas: this.columnas,
            selectRow: this.selectRow
        }

    }
    columnas = [ {
        dataField: 'fecha',
        text: 'Fecha',
        filter: dateFilter(),
        sort: true
    }, {
        dataField: 'novedadVisita',
        text: 'Novedad Visita',
        filter: textFilter({
            placeholder: 'Ingrese Novedad',
        }),
        sort: true
    }, {
        dataField: 'colaborador',
        text: 'Colaborador',
        sort: true
    }, {
        dataField: 'actaNro',
        text: 'Acta No.',
        filter: textFilter({
            placeholder: 'Ingrese Acta',
        }),
        sort: true
    }, {
        dataField: 'cantidadAdjunto',
        text: 'Cantidad Adjuntos',
        style:{'width' : '90px'},
        sort: true
    }, {
        dataField: 'tipoAdjunto',
        text: 'Tipos de Adjuntos',
        style:{'white-space': 'pre-line'},
        sort: true
    },{
        dataField: 'observacion',
        text: 'Observación',
        sort: true
    },{
        dataField: 'df4',
        isDummyField: true,
        text: 'Acción',
        formatter: (cellContent, row) => {
            return (
                <Button onClick={() => this.seleccionarItem(row)} variant="primary">Consultar</Button>
            );
            
        }
    }];

    /**
   * Método encargado de obtener los datos del listados de gestión visita
  */
    componentDidMount() {

    }

    seleccionarItem = (item) => {
        const formItem = {};
        this.props.setShowDataDetalleRecurso([]);
        formItem.nvis_novedad = item.novedadVisita;
        formItem.gvis_fechavisita = item.fecha;
        formItem.eje_nombre = item.colaborador;
        formItem.gvis_observacion = item.observacion;
        formItem.gvis_numeroradicado = item.actaNro;
        this.props.selecionarItem(formItem);
        this.props.setShowDataDetalleRecurso(item.listnovedadVistaRecurso);
        this.props.setShowListaGestionVisita();
        this.props.setShowFormConsultaGestionVisita();
   }

   RegistrarVisita = () => {
        this.props.setShowListaGestionVisita();
        this.props.setShowFormGNVisita();
        //this.props.setShowFormConsultaGestionVisita();
    }

    render() {
        const { dataGV, showButtonsAsinacionMG,showButtonGuardarR } = this.props.gestionCarteraState
        var NombreButton="Registrar Visita";
        
        if(!showButtonsAsinacionMG) NombreButton="Volver";
        if(!showButtonGuardarR) NombreButton="Volver";

        return (
            <Fragment>
                <h1>Lista Gestión Visitas</h1>
                <div className="customHr">.</div>
                <br />
                <Row>
                    <Col xs={12}>
                        <Form.Group >
                            <Button  variant="primary" onClick={this.RegistrarVisita} >{NombreButton}</Button>{' '}
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <BootstrapTable bootstrap4 wrapperClasses="table-responsive" rowClasses="text-nowrap" striped bordered hover keyField='id' data={dataGV} columns={this.state.columnas} pagination={paginationFactory()} filter={filterFactory()} filterPosition="top" noDataIndication="No hay registros disponible" />
                <RVistaFormModalConceptosMG/>
            </Fragment>
        );
    }
}

ListGestionVisita.propTypes = {
    history: PropTypes.object
};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
});

const mapDispatchToProps = dispatch => ({
    selecionarItem(item) {
        dispatch({
            type: ACCION.SELECCIONAR_ITEM_IGVMG,
            payload: item
        })
    },
    setShowDataDetalleRecurso(data) {
        dispatch({
            type: ACCION.SET_DATA_RECURSOGV,
            payload: data
        })
    },
    setShowListaGestionVisita() {
        dispatch({
            type: ACCION.SET_SHOW_LISTAGNVISITA
        })
    },
    setShowFormConsultaGestionVisita() {
        dispatch({
            type: ACCION.SET_SHOW_FORMCONSULTAGNVISITA
        })
    },
    setShowFormGNVisita() {
        dispatch({
            type: ACCION.SET_SHOW_FORMGNVISITA
        })
    },
});

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ListGestionVisita);
export { VistaRedux as RVistaListGestionVisita};