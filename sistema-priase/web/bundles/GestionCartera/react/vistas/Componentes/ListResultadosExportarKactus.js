import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Button, Row, Col} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { textFilter } from 'react-bootstrap-table2-filter';
import exportaraKactus from '../../store/servicios/ExporarKactusServicios';
import { ACCION } from '../../store/actions/TiposAcciones';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

/**
 * Lista de resultados del componente liquidación de
 */
class ListResultadosExportarKactus extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columnas: this.columnas,
            selectRow: this.selectRow,
            showDetalleGestion:false,
            showDetalleRecaudo:false,
        }

    }
    columnas = [{
        dataField: 'documento',
        text: 'No. Identificación',
        filter: textFilter({
            placeholder: 'Ingrese Documento',
        }),
        sort: true
    },{
        dataField: 'nombrecompleto',
        text: 'Ejecutivo',
        filter: textFilter({
            placeholder: 'Ingrese Ejecutivo',
        }),
        sort: true
    },{
        dataField: 'valorliquidadoFormatMoney',
        text: 'Valor Consolidado',
        sort: true
    }, {
        dataField: 'estado',
        text: 'Estado',
        filter: textFilter({
            placeholder: 'Ingrese Estado',
        }),
        sort: true
    }];

    selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        onSelect:  (row, isSelect, rowIndex, e) => {
            
            if (row.estado=="EXPORTADO") {
                if(isSelect) {
                    return false;
                }else{
                    var array =  this.props.gestionCarteraState.seleccionadosEK; // make a separate copy of the array
                    var index = array.indexOf(row);
                    if (index !== -1) {
                        array.splice(index, 1);
                        this.props.setNuevosSeleccionadosItem(array);
                    }
                }

            }else{
                if (isSelect) {
                    //TODO limpiar y eliminar lo que no sirve
                    //this.props.selecionarItem(row.mliq_idregistro, row.eje_idregsitro);
                    this.props.selecionarItem(row);
                } else {
                    var array =  this.props.gestionCarteraState.seleccionadosEK; // make a separate copy of the array
                    var index = array.indexOf(row);
                    //var arrayeje =  this.props.gestionCarteraState.seleccionadosEjelistLC; // make a separate copy of the array
                    //var indexeje = arrayeje.indexOf(row.eje_idregsitro);
                    //console.log('inx:', index, 'inxeje:', indexeje);
                    console.log('inx:', index);
                    //if (index !== -1 && indexeje !== -1) {
                    if (index !== -1) {
                        array.splice(index, 1);
                        //arrayeje.splice(indexeje, 1);
                        //console.log('array:', array,'arrayeje:', arrayeje);
                        //this.props.setNuevosSeleccionadosItem(array,arrayeje);
                        this.props.setNuevosSeleccionadosItem(array);
                    }
                    
                }
            }
            
        },
        onSelectAll:  (isSelect, rows, checked) => {
          const estado = rows.map(r => r.estado);
          const fila = rows.map(r => r);
          var i;
          //const idseje = rows.map(r => r.eje_idregsitro);
           
         /* if (estado.length>0) {
                for(i=0; i<estado.length; i++)
                {
                    if(isSelect && estado[i]==='EXPORTADO'){
                        //return false; 
                        //this.props.setNuevosSeleccionadosItem([],[]);
                        this.props.selecionarItem([]);
                            
                    }else {
                        this.props.selecionarItem(fila[i]);
                       
                    }//fin if else.
            }
           }*/
           
                    if (isSelect) {
                        //TDOD
                        //this.props.setNuevosSeleccionadosItem(ids,idseje);
                        this.props.setNuevosSeleccionadosItem(rows);
                    } else {
                        //this.props.setNuevosSeleccionadosItem([],[]);
                        this.props.setNuevosSeleccionadosItem([]);
                    }//fin if else.
                    
        
        }
    };
    /**
   * Método encargado de obtener los datos generales para el formulario del listados de novedad visita
  */
    componentDidMount() {

    }

    
    render() {
        const { data, showListaResultLC } = this.props.gestionCarteraState
        return (
            <Fragment>
                <h1>Lista de Resultados</h1>
                <div className="customHr">.</div>
                <br />
                <BootstrapTable bootstrap4 wrapperClasses="table-responsive" rowClasses="text-nowrap" striped bordered hover keyField='mliq_idregistro' data={data} columns={this.state.columnas} selectRow={this.state.selectRow} pagination={paginationFactory()} filter={filterFactory()} filterPosition="top" noDataIndication="No hay registros disponible" />
            </Fragment>
        );
    }
}

ListResultadosExportarKactus.propTypes = {
    history: PropTypes.object
};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera
});

const mapDispatchToProps = dispatch => ({
    selecionarFormItem(item) {
        dispatch({
            type: ACCION.SELECCIONAR_ITEM_EK,
            payload: item
        })
    },
    //TODO ELIMINAR LO QUE NO SIRVE
    //selecionarItem(itemPrimary,itemEjecutivo) {
    selecionarItem(itemPrimary) {
        dispatch({
            type: ACCION.SET_SELECCIONADOSLISTA_EK,
            payload: itemPrimary
           // payloadEje: itemEjecutivo
        })
    },
    //setNuevosSeleccionadosItem(itemPrimary,itemEjecutivo) {
    setNuevosSeleccionadosItem(itemPrimary) {
        dispatch({
            type: ACCION.SET_NEWSELECCIONADOSLISTA_EK,
            payload: itemPrimary,
            //payloadEje: itemEjecutivo
        })
    },
    setShowListadoPrincipal() {
        dispatch({
            type: ACCION.SET_SHOW_LISTARESULTLC
        })
    },
    setDataDetalleRE(data) {
        dispatch({
            type: ACCION.SET_DATA_DETALLELCRE,
            payload: data
        })
    },
    setDataDetalleGV(data) {
        dispatch({
            type: ACCION.SET_DATA_DETALLELCGV,
            payload: data
        })
    },
    setModalAbono() {
        dispatch({
            type: ACCION.SET_MODALABONO_LC
        })
    },
    listarItem() {
        dispatch({
            type: ACCION.LISTAR_ITEM,
            payload: "Listar "
        })

    }
});

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ListResultadosExportarKactus);
export { VistaRedux as RVistaListResultadosExportarKactus };