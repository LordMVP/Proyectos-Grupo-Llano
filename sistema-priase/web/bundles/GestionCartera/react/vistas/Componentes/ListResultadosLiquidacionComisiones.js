import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Button, Row, Col} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { textFilter } from 'react-bootstrap-table2-filter';
import { RVistaFormModalAbonoLC, RVistaListDetalleLiquidacionComisionGV, RVistaListDetalleLiquidacionComisionRE } from '../index'
import gestionComisionServicio from '../../store/servicios/LiquidarComisionServicios';
import { ACCION } from '../../store/actions/TiposAcciones';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

/**
 * Lista de resultados del componente liquidación de
 */
class ListResultadosLiquidacionComisiones extends Component {

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
        dataField: 'nombreEjecutivo',
        text: 'Ejecutivo',
        sort: true
    }, {
        dataField: 'mliq_concepto',
        text: 'Concepto',
        sort: true
    }, {
        dataField: 'mliq_cantidad',
        text: 'Cantidad',
        sort: true
    }, {
        dataField: 'mliq_valorunitario',
        text: 'Valor Unitario',
        sort: true
    }, {
        dataField: 'mliq_valorliquidado',
        text: 'Valor Total',
        sort: true
    }, {
        dataField: 'mliq_valorbono',
        text: 'Valor Adicional',
        sort: true
    }, {
        dataField: 'mliq_estado',
        text: 'Estado',
        sort: true
    },{
        dataField: 'df3',
        isDummyField: true,
        text: 'Editar',
        formatter: (cellContent, row) => {
            const { showButtonEditarAbonoLC } = this.props.gestionCarteraState
            if(showButtonEditarAbonoLC){
                if(row.mliq_estado==="CERRADO" || row.mliq_estado==="CONFIRMADO"){
                    return (
                        <Button onClick={() => this.submitEditar(row)} variant="primary" disabled>Editar</Button>
                    );
                }else{
                    return (
                        <Button onClick={() => this.submitEditar(row)}variant="primary" >Editar</Button>
                    );
                }
            }else{
                return (
                    <p>Sin permisos</p>
                );
            }
            
        }
    },{
        dataField: 'df4',
        isDummyField: true,
        text: 'Reporte',
        formatter: (cellContent, row) => {
            return (
                <Button onClick={() => this.seleccionarItem(row)} variant="primary">Reporte</Button>
                
            );
            
        }
    }];

    selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        onSelect:  (row, isSelect, rowIndex, e) => {
            
            if (isSelect) {
                this.props.selecionarItem(row.mliq_idregistro, row.eje_idregsitro);
              
            } else {
                var array =  this.props.gestionCarteraState.seleccionadosLC; // make a separate copy of the array
                var index = array.indexOf(row.mliq_idregistro);
                var arrayeje =  this.props.gestionCarteraState.seleccionadosEjelistLC; // make a separate copy of the array
                var indexeje = arrayeje.indexOf(row.eje_idregsitro);
                console.log('inx:', index, 'inxeje:', indexeje);
                if (index !== -1 && indexeje !== -1) {
                    array.splice(index, 1);
                    arrayeje.splice(indexeje, 1);
                    console.log('array:', array,'arrayeje:', arrayeje);
                    this.props.setNuevosSeleccionadosItem(array,arrayeje);
                }
                
            }
        },
        onSelectAll:  (isSelect, rows) => {
          const ids = rows.map(r => r.mliq_idregistro);
          const idseje = rows.map(r => r.eje_idregsitro);
          if (isSelect) {
            this.props.setNuevosSeleccionadosItem(ids,idseje);
          } else {
              this.props.setNuevosSeleccionadosItem([],[]);
          }
        }
    };
    /**
   * Método encargado de obtener los datos generales para el formulario del listados de novedad visita
  */
    componentDidMount() {

    }

    EditarItem = (item) => {
        if(item.mliq_estado!="CERRADO" || item.mliq_estado!="CONFIRMADO"){
            this.props.setModalAbono();
            const formItem = {};
            formItem.mliq_idregistro = item.mliq_idregistro;
            this.props.selecionarFormItem(formItem);
        }
   }

    seleccionarItem = (item) => {
        
        if(item.mliq_tipoliq==="GV"){
            gestionComisionServicio.datosDetalle(item.mliq_idregistro,item.mliq_tipoliq).then((responseDato) => { 
                var data = [];
               
                if (responseDato.data.codigoRespuesta == 200)
                {
                    this.props.setDataDetalleGV(responseDato.data.data.listMaestroComisionDetalleGV);
                    this.setState({
                        showDetalleGestion:true, 
                        showDetalleRecaudo:false
                      });
                      this.props.setShowListadoPrincipal();
                }else{
                  this.props.setDataDetalleGV(data);
                }
          
            });
            

        }
        if(item.mliq_tipoliq==="RE"){
            gestionComisionServicio.datosDetalle(item.mliq_idregistro,item.mliq_tipoliq).then((responseDato) => { 
                var data = [];
               
                if (responseDato.data.codigoRespuesta == 200)
                {
                    this.props.setDataDetalleRE(responseDato.data.data.listMaestroComisionDetalleRE);
                    this.setState({
                        showDetalleRecaudo:true, 
                        showDetalleGestion:false
                      });
                      this.props.setShowListadoPrincipal();
                }else{
                  this.props.setDataDetalleRE(data);
                }
          
            });
            
        }
    }

    volver = (item) => {
        
        this.setState({
            showDetalleGestion:false, 
            showDetalleRecaudo:false
            });
            this.props.setShowListadoPrincipal();
    }

    submitEditar = (item) => {
        confirmAlert({
          title: 'Confirmación',
          message: '¿Está seguro de realizar esta acción?',
          buttons: [
            {
              label: 'Aceptar',
              onClick: () => this.EditarItem(item)
            },
            {
              label: 'Cancelar',
             // onClick: () => alert('Click No')
            }
          ]
        });
      };
    

    render() {
        const { data, showListaResultLC } = this.props.gestionCarteraState
        return (
            <Fragment>
                {showListaResultLC &&(<div><h1>Lista de Resultados</h1>
                <div className="customHr">.</div>
                <br />
                
                    <BootstrapTable bootstrap4 wrapperClasses="table-responsive" rowClasses="text-nowrap" striped bordered hover keyField='mliq_idregistro' data={data} columns={this.state.columnas} selectRow={this.state.selectRow} pagination={paginationFactory()} filter={filterFactory()} filterPosition="top" noDataIndication="No hay registros disponible" />
                </div>)}
                <RVistaFormModalAbonoLC/>
                {this.state.showDetalleGestion &&(<RVistaListDetalleLiquidacionComisionGV/>)}
                {this.state.showDetalleRecaudo &&(<RVistaListDetalleLiquidacionComisionRE/>)}
                <br />
                {!showListaResultLC &&(
                    <Button className="btn btn-primary pull-right" onClick={this.volver}>Volver</Button>
                )}
            </Fragment>
        );
    }
}

ListResultadosLiquidacionComisiones.propTypes = {
    history: PropTypes.object
};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera
});

const mapDispatchToProps = dispatch => ({
    selecionarFormItem(item) {
        dispatch({
            type: ACCION.SELECCIONAR_ITEM_LC,
            payload: item
        })
    },
    selecionarItem(itemPrimary,itemEjecutivo) {
        dispatch({
            type: ACCION.SET_SELECCIONADOSLISTA_LC,
            payload: itemPrimary,
            payloadEje: itemEjecutivo
        })
    },
    setNuevosSeleccionadosItem(itemPrimary,itemEjecutivo) {
        dispatch({
            type: ACCION.SET_NEWSELECCIONADOSLISTA_LC,
            payload: itemPrimary,
            payloadEje: itemEjecutivo
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ListResultadosLiquidacionComisiones);
export { VistaRedux as RVistaListResultadosLiquidacionComisiones };