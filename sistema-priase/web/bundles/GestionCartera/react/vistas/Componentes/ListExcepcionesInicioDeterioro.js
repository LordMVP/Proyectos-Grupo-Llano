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
 * Lista Excepciones del componente Inicializar Deterioro NIFF
 */
class ListExcepcionesInicioDeterioro extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columnas: this.columnas
           
        }

    }
    columnas = [ {
        dataField: 'dsus_ideregistr',
        text: 'Id Suscripción',
        sort: true
    }, {
        dataField: 'msn_excepcion',
        text: 'Mensaje Excepción',
        sort: true
    }, {
        dataField: 'mgef_fechaexcepcion',
        text: 'Fecha Excepción',
        sort: true
    }];

   

    /**
   * Método encargado de obtener los datos generales 
  */
    componentDidMount() {

    }

 
    render() {
        const { data } = this.props.gestionCarteraState
        return (
            <Fragment>
                <br />
                <h1>Resultados de Excepciones </h1>
                <div className="customHr">.</div>
                <br />
                <BootstrapTable bootstrap4 wrapperClasses="table-responsive" rowClasses="text-nowrap" striped bordered hover keyField='niff_idregistro' data={data} columns={this.state.columnas}  pagination={paginationFactory()} filter={filterFactory()} filterPosition="top" noDataIndication="No hay registros disponible" />
            </Fragment>
        );
    }
}

ListExcepcionesInicioDeterioro.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ListExcepcionesInicioDeterioro);
export { VistaRedux as RVistaListExcepcionesInicioDeterioro };