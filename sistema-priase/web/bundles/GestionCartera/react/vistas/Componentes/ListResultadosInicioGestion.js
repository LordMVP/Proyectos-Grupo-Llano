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
 * Lista resultados totalizados del componente Inicializar Gestión
 */
class ListResultadosInicioGestion extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columnas: this.columnas
           
        }

    }
    columnas = [ {
        dataField: 'totalCarteraGestionar',
        text: 'Total Cartera a Gestionar',
        sort: true
    }, {
        dataField: 'cantidadFactura',
        text: 'Cantidad Facturas',
        sort: true
    }, {
        dataField: 'cantidadSuscriptor',
        text: 'Cantidad Suscripciones',
        sort: true
    }, {
        dataField: 'inicioProceso',
        text: 'Inicio Proceso',
        sort: true
    }, {
        dataField: 'finProceso',
        text: 'Fin Proceso',
        sort: true
    }, {
        dataField: 'usuarioInicioProceso',
        text: 'Usuario Incio Proceso',
        sort: true
    }];

   

    /**
   * Método encargado de obtener los datos del listados de Incializar gestión
  */
    componentDidMount() {

    }

    render() {
        const { data } = this.props.gestionCarteraState
        return (
            <Fragment>
                    <h1>Resultados Totalizados del Periodo</h1>
                    <div className="customHr">.</div>
                    <br />
                    <BootstrapTable bootstrap4 wrapperClasses="table-responsive" rowClasses="text-nowrap" striped bordered hover keyField='totalCarteraGestionar' data={data} columns={this.state.columnas}  pagination={paginationFactory()} filter={filterFactory()} filterPosition="top" noDataIndication="No hay registros disponible" />
               
            </Fragment>
        );
    }
}

ListResultadosInicioGestion.propTypes = {
    history: PropTypes.object
};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera
});

const mapDispatchToProps = dispatch => ({
    listarItem() {
        dispatch({
            type: ACCION.LISTAR_ITEM,
            payload: "Listar "
        })

    }
});

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ListResultadosInicioGestion);
export { VistaRedux as RVistaListResultadosInicioGestion };