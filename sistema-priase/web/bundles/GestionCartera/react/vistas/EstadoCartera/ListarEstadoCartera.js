import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { textFilter } from 'react-bootstrap-table2-filter';
import { RVistaEdicionEstadoCartera } from '../index';
import { ACCION } from '../../store/actions/TiposAcciones';


/**
 * Vista Principal del componente para listar Estado Cartera
 */
class ListarEstadoCartera extends Component {

    constructor(props) {
        super(props)
        this.state = {
             columnas: this.columnas
        }
        this.ocultarVentana = this.ocultarVentana.bind(this);
    }
    columnas = [{
        dataField: 'ecar_codigointerno',
        text: 'Código',
        filter: textFilter({
            placeholder: 'Ingrese Código',
        }),
        sort: true
    }, {
        dataField: 'ecar_nombre',
        text: 'Nombre',
        sort: true
    }, {
        dataField: 'ecar_descripcion',
        text: 'Descripción',
        sort: true
    }, {
        dataField: 'ecar_observacion',
        text: 'Observaciones',
        sort: true
    }, {
        dataField: 'estadoCartera.uninombre',
        text: 'Estado',
        sort: true
    }, {
        dataField: 'df1',
        isDummyField: true,
        text: 'Acción',
        formatter: (cellContent, row) => {
            if (row.estadoCartera.uninombre == "Activo") {
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
        this.setState({ showFormEstadoCartera: false })

    }


    componentDidMount() {

    }

    seleccionarItem = (item, estado) => {
        const formItem  = {};
        formItem.id = item.ecar_idregistro;
        formItem.codigoInterno = item.ecar_codigointerno;
        formItem.condicion = item.ecar_condicion;
        formItem.nombre = item.ecar_nombre;
        formItem.descripcion = item.ecar_descripcion;
        formItem.observacion = item.ecar_observacion;
        formItem.idEstado = item.uni_unidadestado
        this.props.selecionarItem(formItem);
        this.props.setShowFormEdicion(item.ecar_condicion);
        this.props.setBotonGuardar(estado);
    }

    componentDidUpdate(nextProps) {
       
    }

    nuevoItem = () => {
        this.props.setShowFormEdicion()
    }

    render() {
        const { data, showFormEdicion } = this.props.gestionCarteraState
        return (
            <Fragment>
                <RVistaEdicionEstadoCartera ocultarVentana={this.ocultarVentana}  />
                {!showFormEdicion && (<div>
                    <h1>Listado de Estado Cartera</h1>
                    <div className="customHr">.</div>
                    <br />
                    <Button variant="primary" onClick={this.props.NuevoItem}>Nuevo</Button>
                    <br />
                    <br />
                    <BootstrapTable bootstrap4 wrapperClasses="table-responsive" rowClasses="text-nowrap" striped bordered hover keyField='ecar_idregistro' data={data} columns={this.state.columnas} pagination={paginationFactory()} filter={filterFactory()} filterPosition="top" noDataIndication="No hay registros disponible" />
                </div>)}
            </Fragment>
        );
    }
}

ListarEstadoCartera.propTypes = {
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
            payload: "Listar items estado cartera"
        })

    }
});

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ListarEstadoCartera);
export { VistaRedux as RVistaListarEstadoCartera };