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
import { RVistaFormModalConceptosDeterioro, RVistaListResumenResultadosDeterioro } from '../index';
import validaFormulario from '../Utils/ValidacionHelper';
import deterioroNiff from '../../store/servicios/DeterioroNiffServicios';
import { ACCION } from '../../store/actions/TiposAcciones';
const { ToggleList } = ColumnToggle;
const { ExportCSVButton } = CSVExport;

/**
 * Lista de resultados del proceso de inicializar Deterioro NIFF
 */
class ListResultadosDeterioro extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columnas: this.columnas,
            showbutton: this.props.gestionCarteraState.showButtonsAsinacionMG
        }
        
    }
    ToggleList= ColumnToggle;
    columnas = [
    {
        dataField: 'niff_estado',
        text: 'Estado Niff',
        filter: textFilter({
            placeholder: 'Ingrese Estado',
        }),
        sort: true
    },
    {
        dataField: 'fac_numeroa',
        text: 'Factura Número',
        filter: textFilter({
            placeholder: 'Ingrese factura',
        }),
        sort: true
    },{
        dataField: 'dsus_ideregistr',
        text: 'Id Suscripción',
        filter: textFilter({
            placeholder: 'Ingrese Suscripción',
        }),
        sort: true
    }, ,{
        dataField: 'dsus_pcodigo',
        text: 'Código',
        filter: textFilter({
            placeholder: 'Ingrese Código',
        }),
        sort: true
    },{
        dataField: 'doc_nombre',
        text: 'Documento',
        filter: textFilter({
            placeholder: 'Ingrese Documento',
        }),
        sort: true
    },{
        dataField: 'tido_nombre',
        text: 'Tipo Documento',
        filter: textFilter({
            placeholder: 'Ingrese Tipo',
        }),
        sort: true
    }, {
        dataField: 'per_nombre',
        text: 'Periodo Deterioro',
        sort: true
    }, {
        dataField: 'ter_documento',
        text: 'Cliente (ID ó NIT) ',
        filter: textFilter({
            placeholder: 'Ingrese Número',
        }),
        headerStyle: (colum, colIndex) => {
            return { width: '150px', textAlign: 'left' };
        },
        sort: true
    }, {
        dataField: 'fac_sdoreal',
        text: 'Valor de la Factura',
        sort: true
    }, {
        dataField: 'castigo',
        text: 'Castigo',
        sort: true
    }, {
        dataField: 'fac_feccastigad',
        text: 'Fecha Castigo',
        sort: true
    }, {
        dataField: 'fac_fecha',
        text: 'Fecha de Venta',
        sort: true
    }, {
        dataField: 'niff_descripcionsegmento',
        text: 'Empresa',
        filter: textFilter({
            placeholder: 'Ingrese Empresa',
        }),
        sort: true
    }, {
        dataField: 'niff_plazofactura',
        text: 'Plazo de la Factura',
        sort: true
    }, {
        dataField: 'fac_fecvence',
        text: 'Fecha de Vencimiento (inicio de mora)',
        headerStyle: (colum, colIndex) => {
            return { width: '150px', textAlign: 'left' };
        },
        sort: true
    }, {
        dataField: 'pcn_descripcion',
        text: 'Política Deterioro',
        filter: textFilter({
            placeholder: 'Ingrese Política',
        }),
        sort: true
    }, {
        dataField: 'niff_holgura',
        text: 'Holgura (en días)',
        sort: true
    }, {
        dataField: 'niff_credito',
        text: 'Periodo Normal de Crédito (en días)',
        filter: textFilter({
            placeholder: 'Ingrese Periodo',
        }),
        headerStyle: (colum, colIndex) => {
            return { width: '150px', textAlign: 'left' };
        },
        sort: true
    },{
        dataField: 'niff_fechainiciodeterioro',
        text: 'Fecha de Inicio del Deterioro',
        sort: true
    },{
        dataField: 'niff_tiempofinanciacion',
        text: 'Tiempo de Financiación hasta el Cierre (en meses)',
        sort: true
    },{
        dataField: 'tasa_intbancariocorriente',
        text: 'Tasa Efectiva Anual Aplicable',
        sort: true
    },{
        dataField: 'tasa_efectivamensual',
        text: 'Tasa Mensual Aplicable',
        sort: true
    },{
        dataField: 'niff_valorpresente',
        text: 'Valor Presente',
        sort: true
    },{
        dataField: 'niff_valordeterioromayorigual360',
        text: 'Deterioro 100%',
        sort: true
    },{
        dataField: 'niff_valordeterioromenor360',
        text: 'Deterioro de Valor<360',
        sort: true
    },{
        dataField: 'df1',
        isDummyField: true,
        text: 'Conceptos',
        csvExport: false,
        formatter: (cellContent, row) => {
            return (
                <Button onClick={() => this.seleccionarItem(row)} variant="primary">Ver Detalle</Button>
            );
            
        }
    }];
 
   
    /**
   * Método encargado de obtener los datos generales para el formulario del listados de novedad visita
  */
    componentDidMount() {

    }

    seleccionarItem = (item) => {
        
    
    deterioroNiff.ConsultarConceptos(item.niff_ideregistr).then((reponseDato) => {
            
            if (reponseDato.data.codigoRespuesta== 200) {
                
                var data=[];
                if(reponseDato.data.data.dfac_detalleconceptos!=null && reponseDato.data.data.dfac_detalleconceptos.length>0 && reponseDato.data.data.dfac_detalleconceptos!="{}" ){
                    data=JSON.parse(reponseDato.data.data.dfac_detalleconceptos);
                }
                
                this.props.setDataDetalle(data);
                this.props.setShowModal();
            }
        });
       
    }

  
    handleExcel = () => {
        
        const {id_periodoInicioDN } = this.props.gestionCarteraState
        
        /*const validacion = validaFormulario.validaEjecutarFiltro(formEdicionMG, formEdicionFooterMG);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {*/
            
            var itemTipo = [1,2];
                
            var itemPeriodo = [id_periodoInicioDN];
            
            deterioroNiff.generarExcel(itemPeriodo,itemTipo).then((reponseDatoMG) => {
                
                if (reponseDatoMG.status== 200) {
                    const type = reponseDatoMG.headers['content-type'];
                    //const url = reponseDatoMG.headers['urlCarta']
                    const blob = new Blob([reponseDatoMG.data], { type: type, encoding: 'UTF-8' })
                    const link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = 'Lista_Deterioro.xlsx'
                    link.click();

                }
            });
    
      //  }//fin validate

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
                    <div className="relative-parent">
                        <h1>Lista de Resultados</h1>
                        <div className="customHr">.</div>
                        <br />
                       
                        <ToolkitProvider
                            keyField='niff_ideregistr' 
                            data={data} 
                            columns={this.state.columnas} 
                            columnToggle
                            exportCSV={ 
                                {
                                    fileName: 'Lista_Resultados_Deterioro.csv',
                                    noAutoBOM: false,
                                    onlyExportFiltered: true, 
                                    exportAll: false,
                                    blobType: 'text/csv;charset=utf-8'
                                } 
                            }
                        >
                        {
                            props => (
                                <div >
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
                        <br /><RVistaListResumenResultadosDeterioro/>  
                        <br /><RVistaFormModalConceptosDeterioro/> 
                       
                        </div>)}
                    
            </Fragment>
        );
    }
}

ListResultadosDeterioro.propTypes = {
    history: PropTypes.object
};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
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
    setDataDetalle(item) {
        dispatch({
            type: ACCION.SET_DATAMODALCONCEPTO_DN,
            payload: item
        })
    },
    setShowModal(data) {
        dispatch({
            type: ACCION.SET_MODALCONCEPTO_DN,
            payload: data
        })
    }

});

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ListResultadosDeterioro);
export { VistaRedux as RVistaListResultadosDeterioro };