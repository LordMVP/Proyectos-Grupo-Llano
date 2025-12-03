import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Button, Row, Col} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import ToolkitProvider, { ColumnToggle, CSVExport } from 'react-bootstrap-table2-toolkit';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { textFilter } from 'react-bootstrap-table2-filter';
import { RVistaEdicionNovedadVisita } from '../index'
//import nVisitaServicio from '../../store/servicios/NovedadVisitaServicios'
import { ACCION } from '../../store/actions/TiposAcciones';
const { ExportCSVButton } = CSVExport;

/**
 * Lista detalle liquidacion de comisiones por gestion visita
 */
class ListDetalleLiquidacionComisionGV extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columnas: this.columnas
        }

    }
    
    columnas = [{
        dataField: 'ter_nomcompleto',
        text: 'Ejecutivo',
        sort: true
    }, {
        dataField: 'mliq_concepto',
        text: 'Concepto',
        sort: true
    },  {
        dataField: 'valor_unitario',
        text: 'Valor Unitario',
        sort: true
    }, {
        dataField: 'tcom_idregistro',
        text: 'Tabla comisión id',
        sort: true
    }, {
        dataField: 'tcom_descripcion',
        text: 'Descripción Comisión',
        sort: true
    } ];

       
        
       
    /**
   * Método encargado de obtener los datos generales para el formulario del listados de novedad visita
  */
    componentDidMount() {

    }

    render() {
        const { dataDetalleLCGV } = this.props.gestionCarteraState;
        const   MyExportCSV = (props) => {
            const handleClick = () => {
              props.onExport();
            };
            return (
              <div>
                <button className="btn btn-success" onClick={ handleClick }>Exportar CSV</button>
              </div>
            );
          };
        return (
            <Fragment>
                <RVistaEdicionNovedadVisita ocultarVentana={this.ocultarVentana} />
               
                    <h1>Lista Detalle Comisión por Gestión Visita</h1>
                    <div className="customHr">.</div>
                    <br />
                 
                <ToolkitProvider
                    keyField='dmliq_idregistro' 
                    data={dataDetalleLCGV} 
                    columns={this.state.columnas} 
                    exportCSV={ 
                        {
                            fileName: 'Lista_Detalle_Liquidacion_Gestion.csv',
                            noAutoBOM: false,
                            onlyExportFiltered: true, 
                            exportAll: false,
                            blobType: 'text/csv;charset=utf-8'
                        } 
                    }
                >
                    {
                        props => (
                            <div>
                                <hr />
                                <MyExportCSV { ...props.csvProps } />
                                <hr />
                                <BootstrapTable bootstrap4 wrapperClasses="table-responsive" 
                                    rowClasses="text-nowrap" striped bordered hover 
                                    { ...props.baseProps }
                                    pagination={paginationFactory()} 
                                    filter={filterFactory()} filterPosition="top"
                                    noDataIndication="No hay registros disponible"/>
                            </div>
                        )
                    }
                </ToolkitProvider>
              
            </Fragment>
        );
    }
}

ListDetalleLiquidacionComisionGV.propTypes = {
    history: PropTypes.object
};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera
});

const mapDispatchToProps = dispatch => ({
    selecionarItem(item) {
        dispatch({
            type: ACCION.SET_SELECCIONADOSLISTA_MG,
            payload: item
        })
    },
    setNuevosSeleccionadosItem(item) {
        dispatch({
            type: ACCION.SET_NEWSELECCIONADOSLISTA_MG,
            payload: item
        })
    },
    setShowFormEdicion(condicion) {
        dispatch({
            type: ACCION.SET_FORM_EDICION,
            payload: condicion
        })
    },
    setDataDetalle(data) {
        dispatch({
            type: ACCION.SET_DATA_DETALLE,
            payload: data
        })
    },
    
    listarItem() {
        dispatch({
            type: ACCION.LISTAR_ITEM,
            payload: "Listar "
        })

    }
});

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ListDetalleLiquidacionComisionGV);
export { VistaRedux as RVistaListDetalleLiquidacionComisionGV };