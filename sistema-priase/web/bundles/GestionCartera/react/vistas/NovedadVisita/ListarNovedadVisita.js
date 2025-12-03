import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { textFilter } from 'react-bootstrap-table2-filter';
import { RVistaEdicionNovedadVisita } from '../index'
import nVisitaServicio from '../../store/servicios/NovedadVisitaServicios'
import { ACCION } from '../../store/actions/TiposAcciones';


/**
 * Vista Principal del componente para listar Novedad Visita
 */
class ListarNovedadVisita extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columnas: this.columnas
        }

    }
    columnas = [{
        dataField: 'nvis_codigointerno',
        text: 'Código',
        filter: textFilter({
            placeholder: 'Ingrese Código',
        }),
        sort: true
    }, {
        dataField: 'nvis_nombre',
        text: 'Nombre',
        sort: true
    }, {
        dataField: 'recursos',
        text: 'Recursos',
        sort: true
    }, {
        dataField: 'estadoNovedadVisita.uninombre',
        text: 'Estado',
        sort: true
    }, {
        dataField: 'df1',
        isDummyField: true,
        text: 'Acción',
        formatter: (cellContent, row) => {
            if (row.estadoNovedadVisita.uninombre == "Activo") {
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

    /**
   * Método encargado de obtener los datos generales para el formulario del listados de novedad visita
  */
    componentDidMount() {

    }

    seleccionarItem = (item, estado) => {
        this.props.selecionarItem(item);
        this.props.setShowFormEdicion("");
        this.props.setBotonGuardar(estado);

        nVisitaServicio.listarDatosNVisitaRecurso(item.nvis_idregistro).then((reponseDatonVisita) => {
            if (reponseDatonVisita.data.codigoRespuesta == 200) {
                this.props.setDataDetalle(reponseDatonVisita.data.data)
            }else{
                this.props.setDataDetalle([])
            }
        });
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
                <RVistaEdicionNovedadVisita ocultarVentana={this.ocultarVentana} />
                {!showFormEdicion && (<div>
                    <h1>Listado de Novedad Visita</h1>
                    <div className="customHr">.</div>
                    <br />
                    <Button variant="primary" onClick={this.props.NuevoItem}>Nuevo</Button>
                    <br />
                    <br />
                    <BootstrapTable bootstrap4 wrapperClasses="table-responsive" rowClasses="text-nowrap" striped bordered hover keyField='nvis_idregistro' data={data} columns={this.state.columnas} pagination={paginationFactory()} filter={filterFactory()} filterPosition="top" noDataIndication="No hay registros disponible" />
                </div>)}
            </Fragment>
        );
    }
}

ListarNovedadVisita.propTypes = {
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
            payload: "Listar items novedad visita"
        })

    }
});

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ListarNovedadVisita);
export { VistaRedux as RVistaListarNovedadVisita };