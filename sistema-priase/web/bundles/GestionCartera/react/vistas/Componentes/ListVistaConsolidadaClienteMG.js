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
import { RVistaListDetalleFacturaClienteMG } from '../index';
import validaFormulario from '../Utils/ValidacionHelper';
import maestroGestionServicio from '../../store/servicios/MaestroGestionServicios';
import { ACCION } from '../../store/actions/TiposAcciones';
const { ToggleList } = ColumnToggle;
const { ExportCSVButton } = CSVExport;

/**
 * Lista Vista Consolidada Cliente del componente Maestro de Gestión
 */
class ListVistaConsolidadaClienteMG extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columnas: this.columnas,
            selectRow: this.selectRow,
            seleccionadosMG: this.props.gestionCarteraState.seleccionadosMG,
            showbutton: this.props.gestionCarteraState.showButtonsAsinacionMG
        }
        
    }
    ToggleList= ColumnToggle;
    columnas = [{
        dataField: 'df1',
        isDummyField: true,
        text: 'Detalle',
        csvExport: false,
        formatter: (cellContent, row) => {
            return (
                <Button onClick={() => this.seleccionarItem(row)} variant="primary">Ver Detalle</Button>
            );
            
        }
    },
    {
        dataField: 'df2',
        isDummyField: true,
        text: 'Gestión Visita',
        sort: true,
        csvExport: false,
        formatter: (cellContent, row) => {
            
            if(this.state.showbutton){
                
                if(row.megf_estadoregistro==="A"){
                    return (
                        <Button onClick={() => this.seleccionarItemGestion(row)} variant="primary">Registrar Gestión</Button>
                    );
                }else{
                    return (
                        <Button onClick={() => this.seleccionarItemGestion(row)} variant="primary">Consultar Gestión</Button>
                    ); 
                }
                
            }else{
                return (
                    <Button onClick={() => this.seleccionarItemGestion(row)} variant="primary">Consultar Gestión</Button>
                );
            }
            
        }
    }, {
        dataField: 'megf_estadoregistro',
        text: 'Estado Maestro',
        filter: textFilter({
            placeholder: 'Ingrese Estado',
        }),
        sort: true
    },{
        dataField: 'dsus_pcodigo',
        text: 'Código',
        filter: textFilter({
            placeholder: 'Ingrese Código',
        }),
        sort: true
    }, {
        dataField: 'mgef_nombre',
        text: 'Nombre',
        filter: textFilter({
            placeholder: 'Ingrese Nombre',
        }),
        sort: true
    },{
        dataField: 'mgef_direccion',
        text: 'Dirección',
        sort: true
    }, {
        dataField: 'mgef_barrio',
        text: 'Barrio',
        sort: true
    }, {
        dataField: 'mgef_comuna',
        text: 'Comuna',
        sort: true
    }, {
        dataField: 'mgef_altoriesgo',
        text: 'Alto Riesgo',
        formatter: (cellContent, row) => {
            if(cellContent) return 'SI';
            else return 'NO';
        },
        sort: true
    }, {
        dataField: 'mgef_tipouso',
        text: 'Uso',
        sort: true
    }, {
        dataField: 'mgef_estrato',
        text: 'EST/CAT',
        sort: true
    }, {
        dataField: 'mgef_fv',
        text: 'F.V.',
        sort: true
    }, {
        dataField: 'dmge_tarifa',
        text: 'Tarifa',
        sort: true
    }, {
        dataField: 'dmge_capital',
        text: 'Capital',
        sort: true
    }, {
        dataField: 'dmge_interes',
        text: 'Interés',
        sort: true
    }, {
        dataField: 'fac_vlrreal',
        text: 'Total Deuda',
        sort: true
    }, {
        dataField: 'dmge_pagos',
        text: 'Pagos',
        sort: true
    }, {
        dataField: 'fac_fecvence',
        text: 'Fecha Vence',
        sort: true
    },{
        dataField: 'mgef_segmento',
        text: 'Segmento',
        sort: true
    },{
        dataField: 'mgef_estadocartera',
        text: 'Estado',
        sort: true
    },{
        dataField: 'mgef_ingreso',
        text: 'Ingreso',
        sort: true
    },{
        dataField: 'dmge_cambiovalor',
        text: 'Cambio de Valor',
        sort: true
    },{
        dataField: 'dmge_novedad',
        text: 'Novedad',
        sort: true
    },{
        dataField: 'mgef_catastral',
        text: 'Catastral',
        sort: true
    },{
        dataField: 'mgef_codigoalt',
        text: 'Código ALT',
        sort: true
    },{
        dataField: 'mgef_juridico',
        text: 'Jurídico',
        formatter: (cellContent, row) => {
            if(cellContent) return 'SI';
            else return 'NO';
        },
        sort: true
    },{
        dataField: 'mgef_rangoedad',
        text: 'Rango de Edad',
        sort: true
    },{
        dataField: 'mgef_financiado',
        text: 'Financiado',
        formatter: (cellContent, row) => {
            if(cellContent) return 'SI';
            else return 'NO';
        },
        sort: true
    },{
        dataField: 'mgef_orientacion',
        text: 'Orientación',
        sort: true
    },{
        dataField: 'mgef_focalizacion',
        text: 'Focalización',
        sort: true
    },{
        dataField: 'mgef_estrategia',
        text: 'Estrategia',
        sort: true
    },{
        dataField: 'mdeg_nombreejecutivo',
        text: 'Asignación',
        sort: true
    }];

   selectRow = {
            mode: 'checkbox',
            clickToSelect: true,
            onSelect:  (row, isSelect, rowIndex, e) => {
                
                if (isSelect) {
                    this.props.selecionarItem(row.mgef_ideregistro);
                    this.props.verificarAsignadosItem(row.mdeg_nombreejecutivo);
                    this.props.verificarConfirmadosItem(row.megf_estadoregistro);
                  
                } else {
                    var array =  this.props.gestionCarteraState.seleccionadosMG; // make a separate copy of the array
                    var index = array.indexOf(row.mgef_ideregistro)
                    console.log('inx:', index);
                    if (index !== -1) {
                        array.splice(index, 1);
                        console.log('array:', array);
                        this.props.setNuevosSeleccionadosItem(array);
                    }
                    var arrayasignados =  this.props.gestionCarteraState.contarAsignadosMG; // make a separate copy of the array
                    var indexasignado = arrayasignados.indexOf(row.mdeg_nombreejecutivo)
                    console.log('inx:', indexasignado);
                    if (indexasignado !== -1) {
                        arrayasignados.splice(indexasignado, 1);
                        console.log('arrayasignados:', arrayasignados);
                        this.props.verificarNuevosAsignadosItem(arrayasignados);
                    }
                    var arrayestConfirmado =  this.props.gestionCarteraState.contarEstadoRegConfirmMG; // make a separate copy of the array
                    var indexconfirmado = arrayestConfirmado.indexOf(row.megf_estadoregistro)
                    console.log('inx:', indexconfirmado);
                    if (indexconfirmado !== -1) {
                        arrayestConfirmado.splice(indexconfirmado, 1);
                        console.log('indexconfirmado:', indexconfirmado);
                        this.props.verificarNuevosConfirmadosItem(arrayestConfirmado);
                    }
                }
            },
            onSelectAll:  (isSelect, rows) => {
              const ids = rows.map(r => r.mgef_ideregistro);
              const asignados = rows.map(r => r.mdeg_nombreejecutivo);
              const estadoMaestro = rows.map(r => r.megf_estadoregistro);
              if (isSelect) {
                this.props.setNuevosSeleccionadosItem(ids);
                this.props.verificarNuevosAsignadosItem(asignados);
                this.props.verificarNuevosConfirmadosItem(estadoMaestro);
              } else {
                  this.props.setNuevosSeleccionadosItem([]);
                  this.props.verificarNuevosAsignadosItem([]);
                  this.props.verificarNuevosConfirmadosItem([]);
              }
            }
        };

    /**
   * Método encargado de obtener los datos generales para el formulario del listados de novedad visita
  */
    componentDidMount() {

    }

    seleccionarItem = (item) => {
        maestroGestionServicio.verDetalleCliente(item.mgef_ideregistro).then((reponseDatoDetalle) => {
            if (reponseDatoDetalle.data.codigoRespuesta == 200) {
                this.props.setDataDetalle(reponseDatoDetalle.data.data.listMestroFacturaDetalle)
                this.props.setShowDetalle()  
            }else{
                this.props.setDataDetalle([])
            }
        });
    }

    seleccionarItemGestion = (item) => {
        const formItem = {};
        
        if(item.megf_estadoregistro==='A'){
            this.props.setOcultarButtonGuardarRecurso(true)
        }else{
            this.props.setOcultarButtonGuardarRecurso(false)
        }
       
        formItem.mgef_ideregistro = item.mgef_ideregistro;
        //if(item.mdeg_nombreejecutivo!="" && item.mdeg_nombreejecutivo!=null && (item.mgef_estadoasignacion=="A" || item.mgef_estadoasignacion=="C") && item.megf_estadoregistro=="A"){
            if(item.mdeg_nombreejecutivo!="" && item.mdeg_nombreejecutivo!=null){
            this.props.selecionarRegistroItem(formItem);
            this.props.setShowFormGestionVisita();
            this.props.setShowFormFiltros();
        }else{
            this.props.appState.alerta = { "titulo": "Información", "texto": "El registro no tiene ejecutivo asignado" }
            this.props.mostrarAlerta();
            return false;
        }
        
    }

    handleExcel = () => {
        
        const {formEdicionMG, formEdicionFooterMG } = this.props.gestionCarteraState
        
        const validacion = validaFormulario.validaEjecutarFiltro(formEdicionMG, formEdicionFooterMG);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {
            maestroGestionServicio.generarExcel(formEdicionMG.mges_idregistro, formEdicionFooterMG.mges_vista).then((reponseDatoMG) => {
                
                if (reponseDatoMG.status== 200) {
                    const type = reponseDatoMG.headers['content-type'];
                    //const url = reponseDatoMG.headers['urlCarta']
                    const blob = new Blob([reponseDatoMG.data], { type: type, encoding: 'UTF-8' })
                    const link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = 'Lista_Vista_Consolidada_Cliente.xlsx'
                    link.click();

                }
            });
    
        }//fin validate

    }

    render() {
        const { data, showDetalleMG } = this.props.gestionCarteraState;
        const   MyExportCSV = (props) => {
            const handleClick = () => {
              props.onExport();
            };
            return (
              <div>
                <button className="btn btn-success" onClick={ handleClick }>Exportar CSV</button>
                <button className="btn btn-success" onClick={ this.handleExcel }>Exportar XLSX</button>
              </div>
            );
          };
        return (
            <Fragment>
                    {!showDetalleMG &&(
                    <div>
                        <h1>Vista Consolidada Cliente</h1>
                        <div className="customHr">.</div>
                        <br />
                        <ToolkitProvider
                            keyField='mgef_ideregistro' 
                            data={data} 
                            columns={this.state.columnas} 
                            columnToggle
                            exportCSV={ 
                                {
                                    fileName: 'Lista_Vista_Consolidada_Cliente.csv',
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
                                
                                    <ToggleList { ...props.columnToggleProps } />
                                    <hr />
                                    <MyExportCSV { ...props.csvProps } />
                                    <hr />
                                    <BootstrapTable bootstrap4 wrapperClasses="table-responsive" 
                                        rowClasses="text-nowrap" striped bordered hover 
                                        { ...props.baseProps }
                                        selectRow={this.state.selectRow} pagination={paginationFactory()} 
                                        filter={filterFactory()} filterPosition="top"
                                        noDataIndication="No hay registros disponible"/>
                                </div>
                            )
                        }
                        </ToolkitProvider>
                            
                        </div>)}
                    {showDetalleMG &&(<RVistaListDetalleFacturaClienteMG/>)}
                    
            </Fragment>
        );
    }
}

ListVistaConsolidadaClienteMG.propTypes = {
    history: PropTypes.object
};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
});

const mapDispatchToProps = dispatch => ({
    setDataDetalle(data) {
        dispatch({
            type: ACCION.SET_DATA_DETALLE,
            payload: data
        })
    },
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
    verificarAsignadosItem(item) {
        dispatch({
            type: ACCION.CONTAR_ASIGNADOSLISTA_MG,
            payload: item
        })
    },
    verificarNuevosAsignadosItem(item) {
        dispatch({
            type: ACCION.CONTAR_NEWASIGNADOSLISTA_MG,
            payload: item
        })
    },
    selecionarRegistroItem(item) {
        dispatch({
            type: ACCION.SET_SELECCIONADO_ROWGV,
            payload: item
        })
    },
    setShowDetalle() {
        dispatch({
            type: ACCION.SET_DETALLE_MC
        })
    },
    setOcultarButtonGuardarRecurso(item) {
        dispatch({
            type: ACCION.SET_OCULTARBUTTON_GR,
            payload: item
        })
      },
    setShowFormGestionVisita() {
        dispatch({
            type: ACCION.SET_SHOW_GESTIONVISITA
        })
    },
    setShowFormFiltros() {
        dispatch({
            type: ACCION.SET_SHOW_MAESTROGESTION
        })
    },
    mostrarAlerta() {
        dispatch({
            type: ACCION.MOSTRAR_ALERTA,
            payload: {}
        })
    },
    verificarConfirmadosItem(item) {
        dispatch({
            type: ACCION.CONTAR_REGISTROCONFIRMADO_MG,
            payload: item
        })
    },
    verificarNuevosConfirmadosItem(item) {
        dispatch({
            type: ACCION.CONTAR_NEWREGISTROCONFIRMADO_MG,
            payload: item
        })
    },
});

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ListVistaConsolidadaClienteMG);
export { VistaRedux as RVistaListVistaConsolidadaClienteMG };