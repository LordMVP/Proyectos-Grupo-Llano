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
import { RVistaEdicionNovedadVisita } from '../index';
import validaFormulario from '../Utils/ValidacionHelper';
import maestroGestionServicio from '../../store/servicios/MaestroGestionServicios';
import { ACCION, CONSULTAR_CONFIGURACIONES } from '../../store/actions/TiposAcciones';
const { ToggleList } = ColumnToggle;
const { ExportCSVButton } = CSVExport;
/**
 * Lista Vista Completa del componente Maestro de Gestión
 */
class ListVistaCompletaMG extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columnas: this.columnas,
            selectRow: this.selectRow,
            seleccionadosMG: this.props.gestionCarteraState.seleccionadosMG
        }

    }
    ToggleList= ColumnToggle;
    columnas = [{
        dataField: 'megf_estadoregistro',
        text: 'Estado Maestro',
        filter: textFilter({
            placeholder: 'Ingrese Estado',
        }),
        sort: true
    },{
        dataField: 'fac_numero',
        text: 'Factura',
        filter: textFilter({
            placeholder: 'Ingrese Factura',
        }),
        sort: true,
        csvType: Text
    }, {
        dataField: 'dsus_pcodigo',
        text: 'Código',
        filter: textFilter({
            placeholder: 'Ingrese Código',
        }),
        sort: true,
        csvType: Text
    }, {
        dataField: 'mgef_nombre',
        text: 'Nombre',
        filter: textFilter({
            placeholder: 'Ingrese Nombre',
        }),
        sort: true
    }, {
        dataField: 'mgef_departamento',
        text: 'Departamento',
        sort: true
    }, {
        dataField: 'mgef_municipio',
        text: 'Ciudad',
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
        dataField: 'mgef_ubicacion',
        text: 'Ubicación',
        sort: true
    },{
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
    },{
        dataField: 'fac_fecvence',
        text: 'Factura Fecha Vencimineto',
        sort: true
    },{
        dataField: 'fac_vlrreal',
        text: 'Valor Real',
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
        dataField: 'fac_sdroreal',
        text: 'Total Deuda',
        sort: true
    }, {
        dataField: 'dmge_pagos',
        text: 'Pagos',
        sort: true
    }, {
        dataField: 'dmge_fechaultimopago',
        text: 'Fecha',
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
        dataField: 'mgef_estadosuscripcion',
        text: 'Estado Suscripción',
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
        sort: true,
        csvType: Text
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
        dataField: 'mgef_edadcartera',
        text: 'Edad Cartera',
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
    },{
        dataField: 'mgef_numeromedidor',
        text: 'Número Medidor',
        sort: true
    },{
        dataField: 'mgef_estadoasignacion',
        text: 'Estado Asignación',
        sort: true
    },{
        dataField: 'mgef_cantidadvisitas',
        text: 'Cantidad Visitas',
        sort: true
    },{
        dataField: 'mgef_fechaultimavisita',
        text: 'Fecha Última Visita',
        sort: true
    },{
        dataField: 'mgef_fechahomologacion ',
        text: 'Fecha Homologación ',
        sort: true
    } /*{
        dataField: 'df1',
        isDummyField: true,
        text: 'Acción'
    },*/];

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
                   // const url = reponseDatoMG.headers['urlCarta']
                    const blob = new Blob([reponseDatoMG.data], { type: type, encoding: 'UTF-8' })
                    const link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = 'Lista_Vista_Completa.xlsx'
                    link.click();

                }
            });
    
        }//fin validate

    }

    /**
     * boton customizado la linea <MyExportCSV { ...props.csvProps } /> se puede reemplazar por: 
     * <ExportCSVButton { ...props.csvProps } >Export CSV!!</ExportCSVButton> este es un botón normal no customizado
    */
 
    render() {
        const { data, showFormEdicion } = this.props.gestionCarteraState;
        //customización botón exportar
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
                <RVistaEdicionNovedadVisita ocultarVentana={this.ocultarVentana} />
               
                    <h1>Vista Completa</h1>
                    <div className="customHr">.</div>
                    <br />
                    <ToolkitProvider
                        keyField='mgef_ideregistro' 
                        data={data} 
                        columns={this.state.columnas} 
                        columnToggle
                        exportCSV={ 
                            {
                                fileName: 'Lista_Vista_Completa.csv',
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
                    
               
            </Fragment>
        );
    }
}

ListVistaCompletaMG.propTypes = {
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
    listarItem() {
        dispatch({
            type: ACCION.LISTAR_ITEM,
            payload: "Listar "
        })

    }
});

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ListVistaCompletaMG);
export { VistaRedux as RVistaListVistaCompletaMG };