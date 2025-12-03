import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { textFilter } from 'react-bootstrap-table2-filter';
import { RVistaEdicionEjecutivo } from '../index';
import { ACCION } from '../../store/actions/TiposAcciones';

/**
 * Vista Principal del componente para listar Ejecutivos
 */
class ListarEjecutivo extends Component {

    constructor(props) {
        super(props)
        this.state = {
           columnas: this.columnas
        }
        
    }
    columnas = [{
        dataField: 'tercero.nomcompleto',
        text: 'Tercero',
        filter: textFilter({
            placeholder: 'Ingrese Nombre',
        }),
        sort:true
    }, {
        dataField: 'estadoEjecutivo.uninombre',
        text: 'Estado',
        sort: true
    }, {
        dataField: 'estadoTipoEjecutivo.uninombre',
        text: 'Clasificación',
        sort: true
    }, {
        dataField: 'sectoresnombres',
        text: 'Sector Comuna',
        sort: true
    }, {
        dataField: 'estadoEtapaGestion.uninombre',
        text: 'Tipo Gestión',
        sort: true
    }, {
        dataField: 'eje_fechaingreso',
        text: 'Fecha Ingreso',
        sort: true
    }, {
        dataField: 'eje_fechavencimiento',
        text: 'Fecha Vencimiento',
        sort: true
    }, {
        dataField: 'nombretablacomisional',
        text: 'Tabla Comisional',
        sort: true
    }, {
        dataField: 'nombremetagestion',
        text: 'Tabla Metas',
        sort: true
    },{
        dataField: 'df1',
        isDummyField: true,
        text: 'Acción',
        formatter: (cellContent, row) => {
            if (row.estadoEjecutivo.uninombre == "Activo") {
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

    
    seleccionarItem(item, estado) {


        const formItem = {};
        formItem.eje_idregistro = item.eje_idregistro;
        formItem.nomcompleto = item.tercero.nomcompleto;
        formItem.ter_idregistro = item.ter_idregistro
        formItem.documento = item.tercero.documento;
        formItem.eje_fechaingreso = item.eje_fechaingreso;
        formItem.eje_fechavencimiento = item.eje_fechavencimiento;
        //formItem.mges_idregistro = item.mges_idregistro;
        //formItem.tcom_idregistro = item.tcom_idregistro;
        formItem.mges_idregistroArray = item.mges_idregistroArray;
        formItem.tcom_idregistroArray = item.tcom_idregistroArray;
        formItem.uni_unidadestado = item.uni_unidadestado;
        formItem.uni_unidadestadotgestion = item.uni_unidadestadotgestion;
        formItem.uni_unidadclasificacion = item.uni_unidadclasificacion;
        formItem.sectores = item.sectores;
        this.props.selecionarItem(formItem);
        this.props.setShowFormEdicion("");
        this.props.setBotonGuardar(estado);
       
    }

    nuevoItem = () => {
        this.props.setShowFormEdicion()
    }

    render() {
        const { data, showFormEdicion } = this.props.gestionCarteraState
        return (
            <Fragment>
                <RVistaEdicionEjecutivo ocultarVentana={this.ocultarVentana} />
                {!showFormEdicion && (<div>
                    <h1>Listado de Ejecutivos</h1>
                    <div className="customHr">.</div>
                    <br />
                    <Button variant="primary" onClick={this.props.NuevoItem}>Nuevo</Button>
                    <br />
                    <br />
                    <BootstrapTable bootstrap4 wrapperClasses="table-responsive" rowClasses="text-nowrap" striped bordered hover keyField='eje_idregistro' data={data} columns={this.state.columnas} pagination={paginationFactory()} filter={filterFactory()} filterPosition="top" noDataIndication="No hay registros disponible" />
                </div>)}
            </Fragment>
        );
    }
}

ListarEjecutivo.propTypes = {
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
    
    setDataDetalle(data) {
        dispatch({
            type: ACCION.SET_DATA_DETALLE,
            payload: data
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
            payload: "Listar items ejecutivo"
        })

    }
});

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ListarEjecutivo);
export { VistaRedux as RVistaListarEjecutivo };