import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { textFilter } from 'react-bootstrap-table2-filter';
import { RVistaEdicionEdadCartera } from '../index';
import { ACCION } from '../../store/actions/TiposAcciones';


/**
 * Vista Principal del componente para listar Edad Cartera
 */
class ListarEdadCartera extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columnas: this.columnas
        }
        this.ocultarVentana = this.ocultarVentana.bind(this);
    }
    columnas = [{
        dataField: 'edcar_idregistro',
        text: 'Código',
        filter: textFilter(),
        sort: true
    },
    {
        dataField: 'unidadTiempoEdadCartera.uninombre',
        text: 'Unidad de Tiempo',
        sort: true
    },
    {
        dataField: 'df2',
        isDummyField: true,
        text: 'Rango',
        formatter: (cellContent, row) => {
            return (
                <span> {row.edcar_rangodesde} A {row.edcar_rangohasta} </span>
            );
        }
    },
    {
        dataField: 'edcar_descripcion',
        text: 'Descripción',
        sort: true
    }, {
        dataField: 'estadoEdadCartera.uninombre',
        text: 'Estado',
        sort: true
    }, {
        dataField: 'df1',
        isDummyField: true,
        text: 'Acción',
        formatter: (cellContent, row) => {
            if (row.estadoEdadCartera.uninombre == "Activo") {
                return (
                    <Button onClick={() => this.seleccionarItem(row, "A")} variant="primary">Editar</Button>
                );
            }
            else {
                return (
                    <Button onClick={() => this.seleccionarItem(row, "I")} variant="primary">Consultar</Button>
                );
            }
        }
    },];

    ocultarVentana = () => {
       // this.setState({ showFormOrientacion: false })

    }


    /**
   * Método encargado de obtener los datos generales para el formulario del listados de Edad Cartera
  */
    componentDidMount() {

    }

    seleccionarItem = (item, estado) => {
        const formItem = item;
        this.props.selecionarItem(formItem);
        this.props.setShowFormEdicion();
        this.props.setBotonGuardar(estado);
    }

    nuevoItem = () => {
        this.props.setShowFormEdicion()
    }

    render() {
        const { data, showFormEdicion, formEdicion } = this.props.gestionCarteraState
        return (
            <Fragment>
                <RVistaEdicionEdadCartera />
                {!showFormEdicion && (<div>
                    <h1>Listado de Edad Cartera</h1>
                    <div className="customHr">.</div>
                    <br />
                    <Button variant="primary" onClick={this.props.NuevoItem}>Nuevo</Button>
                    <br />
                    <br />
                    <BootstrapTable bootstrap4 wrapperClasses="table-responsive" rowClasses="text-nowrap" striped bordered hover keyField='edcar_idregistro' data={data} columns={this.state.columnas} pagination={paginationFactory()} filter={filterFactory()} filterPosition="top" noDataIndication="No hay registros disponible" />
                </div>)}
            </Fragment>
        );
    }
}

ListarEdadCartera.propTypes = {
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
            payload: "Listar items edad cartera"
        })

    }
});

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ListarEdadCartera);
export { VistaRedux as RVistaListarEdadCartera };