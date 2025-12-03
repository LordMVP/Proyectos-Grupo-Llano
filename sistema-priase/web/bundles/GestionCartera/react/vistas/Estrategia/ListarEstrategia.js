import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { textFilter } from 'react-bootstrap-table2-filter';
import { RVistaEdicionEstrategia } from '../index';
import { ACCION } from '../../store/actions/TiposAcciones';


/**
 * Vista Principal del componente para listar Estrategia
 */
class ListarEstrategia extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columnas: this.columnas
        }
        this.ocultarVentana = this.ocultarVentana.bind(this);
    }
    columnas = [{
        dataField: 'est_codigointerno',
        text: 'Código',
        filter: textFilter({
            placeholder: 'Ingrese Código',
        }),
        sort: true
    }, {
        dataField: 'est_nombre',
        text: 'Nombre',
        sort: true
    }, {
        dataField: 'est_descripcion',
        text: 'Descripción',
        sort: true
    }, {
        dataField: 'nombreClasificaciones',
        text: 'Asignación',
        sort: true
    },{
        dataField: 'est_observacion',
        text: 'Observaciones',
        sort: true
    }, {
        dataField: 'estadoEstrategia.uninombre',
        text: 'Estado',
        sort: true
    }, {
        dataField: 'df1',
        isDummyField: true,
        text: 'Acción',
        formatter: (cellContent, row) => {
            if (row.estadoEstrategia.uninombre == "Activo") {
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
        this.setState({ showFormOrientacion: false })

    }


    /**
   * Método encargado de obtener los datos generales para el formulario del listados de Estrategia
  */
    componentDidMount() {

    }

    seleccionarItem = (item, estado) => {
        const formItem = {};
        formItem.id = item.est_idregistro;
        formItem.codigoInterno = item.est_codigointerno;
        formItem.condicion = item.est_condicion;
        formItem.nombre = item.est_nombre;
        formItem.descripcion = item.est_descripcion;
        formItem.observacion = item.est_observacion;
        formItem.idEstado = item.uni_unidadestado;
        formItem.clasificaciones = item.clasificaciones;
        this.props.selecionarItem(formItem);
        this.props.setShowFormEdicion(item.est_condicion);
        this.props.setFormAsginacion(item.clasificaciones);
        this.props.setBotonGuardar(estado);
    }

    nuevoItem = () => {
        this.props.setShowFormEdicion()
    }

    render() {
        const { data, showFormEdicion } = this.props.gestionCarteraState
        return (
            <Fragment>
                <RVistaEdicionEstrategia ocultarVentana={this.ocultarVentana} />
                {!showFormEdicion && (<div>
                    <h1>Listado de Estrategias</h1>
                    <div className="customHr">.</div>
                    <br />
                    <Button variant="primary" onClick={this.props.NuevoItem}>Nuevo</Button>
                    <br />
                    <br />
                    <BootstrapTable bootstrap4 wrapperClasses="table-responsive" rowClasses="text-nowrap" striped bordered hover keyField='est_idregistro' data={data} columns={this.state.columnas} pagination={paginationFactory()} filter={filterFactory()} filterPosition="top" noDataIndication="No hay registros disponible" />
                </div>)}
            </Fragment>
        );
    }
}

ListarEstrategia.propTypes = {
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
                type: ACCION.SET_FORM_ASIGNACION,
                payload: []
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

    setFormAsginacion(value) {

        dispatch({
            type: ACCION.SET_FORM_ASIGNACION,
            payload: value
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ListarEstrategia);
export { VistaRedux as RVistaListarEstrategia };