import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { textFilter } from 'react-bootstrap-table2-filter';
import { RVistaEdicionVariableGlobal } from '../index';
import { ACCION } from '../../store/actions/TiposAcciones';
/**
 * Vista Principal del componente de listar Variables globales
 */
class ListarVariableGlobal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columnas: this.columnas
        }
       
    }
    //columnas = []
    columnas = [{
        dataField: 'vglo_descripcion',
        text: 'Variable',
        filter: textFilter({
            placeholder: 'Ingrese Variable',
        })
    }, {
        dataField: 'uni_nombreMetodoCarga',
        text: 'Método Carga'
    }, {
        dataField: 'uni_nombreatrmaestrocartera',
        text: 'Atributo'
    }, {
        dataField: 'uni_nombretipometodo',
        text: 'Método'
    }, {
        dataField: 'fun_nombreorigen',
        text: 'Tipo Método'
    },  {
        dataField: 'vglo_valorconstante',
        text: 'Valor Constante'
    },{
        dataField: 'uni_nombretipodato',
        text: 'Tipo Dato'
    }, ,{
        dataField: 'uni_nombreUnidadEstado',
        text: 'Estado'
    },{
        dataField: 'df1',
        isDummyField: true,
        text: 'Acción',
        formatter: (cellContent, row) => {
            if (row.uni_nombreUnidadEstado == "Activo") {
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


    componentDidMount() {

    }
    seleccionarItem(item, estado) {
        this.props.selecionarItem(item);
        this.props.setShowFormEdicion("");
        this.props.setBotonGuardar(estado);
        if(item.uni_unimcarga ===3545){
            this.props.setShowAtributo(true);
            this.props.setShowConstante(false);
            this.props.setShowCalculado(false);
        }
        if(item.uni_unimcarga ===3546){
            this.props.setShowAtributo(false);
            this.props.setShowConstante(true);
            this.props.setShowCalculado(false);
        }
        if(item.uni_unimcarga ===3547){
            this.props.setShowAtributo(false);
            this.props.setShowConstante(false);
            this.props.setShowCalculado(true);
        }

    }

    nuevoItem = () => {
        this.props.setShowFormEdicion()
    }



    render() {
        const { data, showFormEdicion } = this.props.gestionCarteraState
        return (
            <Fragment>
                <RVistaEdicionVariableGlobal ocultarVentana={this.ocultarVentana} />
                <br />
                {!showFormEdicion && (<div>
                    <h1>Listado de Variables Globales</h1>
                    <div className="customHr">.</div>
                    <br />
                    <Button variant="primary" onClick={this.props.NuevoItem}>Nuevo</Button>
                    <br />
                    <br />
                    { <BootstrapTable wrapperClasses="table-responsive" rowClasses="text-nowrap" striped bordered hover keyField='vglo_idregistro' data={data} columns={this.state.columnas} pagination={paginationFactory()} filter={filterFactory()} filterPosition="top" noDataIndication="No hay registros disponible" />}
                </div>)}
            </Fragment>
        );
    }
}

ListarVariableGlobal.propTypes = {
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
    setShowAtributo(data) {
        dispatch({
            type: ACCION.SET_SHOW_ATRIBUTO,
            payload: data
        })
    },
    setShowConstante(data) {
        dispatch({
            type: ACCION.SET_SHOW_CONSTANTE,
            payload: data
        })
    },
    setShowCalculado(data) {
        dispatch({
            type: ACCION.SET_SHOW_CALCULADO,
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
            payload: "Listar items novedad visita"
        })

    }
});

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ListarVariableGlobal);
export { VistaRedux as RVistaListarVariableGlobal };