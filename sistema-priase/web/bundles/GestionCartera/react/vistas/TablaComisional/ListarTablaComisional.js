import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { textFilter } from 'react-bootstrap-table2-filter';
import { RVistaEdicionTablaComisional } from '../index';
import tComisionalServicio from '../../store/servicios/TablaComisionalServicios';
import { ACCION } from '../../store/actions/TiposAcciones';


/**
 * Vista Principal del componente para listar tabla comisional
 */
class ListarTablaComisional extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columnas: this.columnas
        }
        this.ocultarVentana = this.ocultarVentana.bind(this);
    }
    columnas = [{
        dataField: 'tcom_codigointerno',
        text: 'Código',
        filter: textFilter({
            placeholder: 'Ingrese Código',
        }),
        sort: true
    }, {
        dataField: 'tcom_descripcion',
        text: 'Descripción',
        sort: true
    },{
        dataField: 'unidadComision.uninombre',
        text: 'Concepto',
        sort: true
    },{
        dataField: 'funcionBase.fun_descripcion',
        text: 'Método Base',
        sort: true
    },{
        dataField: 'funcionComision.fun_descripcion',
        text: 'Método Cálculo',
        sort: true
    },{
        dataField: 'estadoTablaComisional.uninombre',
        text: 'Estado',
        sort: true
    }, {
        dataField: 'df1',
        isDummyField: true,
        text: 'Acción',
        formatter: (cellContent, row) => {
            if (row.estadoTablaComisional.uninombre == "Activo") {
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
       
    }


    /**
   * Método encargado de obtener los datos generales para el formulario del listados de tabla comisional
  */
    componentDidMount() {

    }

    seleccionarItem = (item, estado) => {
        this.props.selecionarItem(item);
        this.props.setShowFormEdicion(item.tcom_condicion);
        this.props.setBotonGuardar(estado);
        tComisionalServicio.listarDatosTComisionalDetalle(item.tcom_idregistro,item.fun_funcionmcomision).then((reponseDatotComisional) => {
            if (reponseDatotComisional.data.codigoRespuesta == 200) {
                this.props.setDataDetalle(reponseDatotComisional.data.data)
            }else{
                this.props.setDataDetalle([])
            }
        });
    }

    nuevoItem = () => {
        this.props.setShowFormEdicion()
    }

    render() {
        const { data, showFormEdicion } = this.props.gestionCarteraState
        return (
            <Fragment>
                <RVistaEdicionTablaComisional ocultarVentana={this.ocultarVentana} />
                {!showFormEdicion && (<div>
                    <h1>Listado de Tabla Comisional</h1>
                    <div className="customHr">.</div>
                    <br />
                    <Button variant="primary" onClick={this.props.NuevoItem}>Nuevo</Button>
                    <br />
                    <br />
                    <BootstrapTable bootstrap4 wrapperClasses="table-responsive" rowClasses="text-nowrap" striped bordered hover keyField='tcom_idregistro' data={data} columns={this.state.columnas} pagination={paginationFactory()} filter={filterFactory()} filterPosition="top" noDataIndication="No hay registros disponible" />
                </div>)}
            </Fragment>
        );
    }
}

ListarTablaComisional.propTypes = {
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
            payload: "Listar items tabla comisional"
        })

    }
});

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ListarTablaComisional);
export { VistaRedux as RVistaListarTablaComisional };