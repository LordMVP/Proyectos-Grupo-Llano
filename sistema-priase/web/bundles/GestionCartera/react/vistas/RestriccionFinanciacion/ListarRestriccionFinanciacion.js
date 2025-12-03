import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { textFilter } from 'react-bootstrap-table2-filter';
import { RVistaEdicionRestriccionFinanciacion } from '../index';
import { ACCION } from '../../store/actions/TiposAcciones';


/**
 * Vista Principal del componente para listar Restricción financiación condonación
 */
class ListarRestriccionFinanciacion extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columnas: this.columnas
        }
        this.ocultarVentana = this.ocultarVentana.bind(this);
    }
    columnas = [{
        dataField: 'nombreusuario',
        text: 'Usuario',
        filter: textFilter({
            placeholder: 'Ingrese Usuario',
        }),
        sort: true
    },
    {
        dataField: 'nombreproceso',
        text: 'Proceso',
        sort: true
    },
    {
        dataField: 'df2',
        isDummyField: true,
        text: 'Tipo Restricción',
        formatter: (cellContent, row) => {

            if (row.luspu_tipo === "0") return (<span>Procentaje </span>)
            if (row.luspu_tipo === "1") return (<span>Monto </span>)
            if (row.luspu_tipo === "2") return (<span>Ambos </span>)
        }
    }, {
        dataField: 'luspu_limiteporcentaje',
        text: 'Porcentaje',
        sort: true
    }, {
        dataField: 'luspu_limitemonto',
        text: 'Monto',
        sort: true
    }, {
        dataField: 'df1',
        isDummyField: true,
        text: 'Acción',
        formatter: (cellContent, row) => {
            return (
                <Button onClick={() => this.seleccionarItem(row, "A")} variant="primary">Editar</Button>
            );

        }
    },];

    ocultarVentana = () => {
        this.setState({ showFormOrientacion: false })

    }


    /**
   * Método encargado de obtener los datos generales para el formulario del listados de Restricción financiación condonación
  */
    componentDidMount() {

    }

    seleccionarItem = (item, estado) => {
        this.props.selecionarItem(item);
        this.props.setBotonGuardar(estado);
        this.props.setShowFormEdicion();
    }

    nuevoItem = () => {
        this.props.setShowFormEdicion()
    }

    render() {
        const { data, showFormEdicion } = this.props.gestionCarteraState
        return (
            <Fragment>
                <RVistaEdicionRestriccionFinanciacion ocultarVentana={this.ocultarVentana} />
                {!showFormEdicion && (<div>
                    <h1>Listado de Financiación/Condonación</h1>
                    <div className="customHr">.</div>
                    <br />
                    <Button variant="primary" onClick={this.props.NuevoItem}>Nuevo</Button>
                    <br />
                    <br />
                    <BootstrapTable bootstrap4 wrapperClasses="table-responsive" rowClasses="text-nowrap" striped bordered hover keyField='luspu_ideregistro' data={data} columns={this.state.columnas} pagination={paginationFactory()} filter={filterFactory()} filterPosition="top" noDataIndication="No hay registros disponible" />
                </div>)}
            </Fragment>
        );
    }
}

ListarRestriccionFinanciacion.propTypes = {
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

    NuevoItem(item) {
        dispatch({
            type: ACCION.NUEVO_ITEM,
            payload: {}
        }),
            dispatch({
                type: ACCION.SET_FORM_EDICION,
                payload: ""
            }),
            dispatch({
                type: ACCION.SET_BUTTON_GUARDAR,
                payload: true
            })
    },

    setShowFormEdicion(condicion) {
        dispatch({
            type: ACCION.SET_FORM_EDICION,
            payload: condicion
        })
    },

    setBotonGuardar(estado) {
        var accion = true;
        if (estado == "I") accion = false
        dispatch({
            type: ACCION.SET_BUTTON_GUARDAR,
            payload: accion
        })
    },

    listarItem() {
        dispatch({
            type: ACCION.LISTAR_ITEM,
            payload: "Listar items Financiación Coandonación"
        })

    }
});

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ListarRestriccionFinanciacion);
export { VistaRedux as RVistaListarRestriccionFinanciacion };