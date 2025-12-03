import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Button, Row, Col} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { textFilter } from 'react-bootstrap-table2-filter';
import {RVistaListDetalleMetaGV, RVistaListDetalleMetaRE } from '../index'
import cumplimientoMetasServicio from '../../store/servicios/CumplimientoMetasServicios';
import { ACCION } from '../../store/actions/TiposAcciones';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

/**
 * Lista de resultados del componente liquidación de
 */
class ListResultadosConsolidacionMetas extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columnas: this.columnas,
            showDetalleGestion:false,
            showDetalleRecaudo:false,
        }

    }
    columnas = [{
        dataField: 'cmetr_estado',
        text: 'Estado',
        filter: textFilter({
            placeholder: 'Ingrese Estado',
        }),
        footer: '',
        sort: true
    },{
        dataField: 'mdeg_nombreejecutivo',
        text: 'Ejecutivo',
        footer: '',
        sort: true
    }, {
        dataField: 'mege_descripcion',
        text: 'Meta',
        footer: '',
        sort: true
    }, {
        dataField: 'concepto',
        text: 'Concepto',
        footer: '',
        sort: true
    }, {
        dataField: 'per_nombre',
        text: 'Periodo',
        footer: 'Totales',
        sort: true
    }, {
        dataField: 'cmetr_total_recaudo',
        text: 'Total Recaudo',
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0),
        sort: true
    }, {
        dataField: 'cmetv_meta_recaudo',
        text: 'Meta Recaudo',
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0),
        sort: true
    }, {
        dataField: 'cmetr_porcentaje_cumplimiento',
        text: '% Cumplimiento',
        footer: columnData => {
            var suma = columnData.reduce((acc, item) => acc + item, 0)
            var dataLec = columnData.length;
            let promedio= suma/dataLec;
            return (
              <strong>{promedio}%</strong>
            );
        },
        sort: true
    },{
        dataField: 'cmetv_cumplimiento_meta',
        text: '% Cumplimiento Meta',
        footer: '100',
        sort: true
    },{
        dataField: 'cmetc_cantidad_visita_realizada',
        text: 'Cantidad Visitas Realizadas',
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0),
        sort: true
    },{
        dataField: 'cmetc_cantidad_visita_realizar',
        text: 'Cantidad Visitas a Realizar',
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0),
        sort: true
    },{
        dataField: 'df4',
        isDummyField: true,
        text: 'Detalle',
        footer: '',
        formatter: (cellContent, row) => {
            if(row.cmetr_estado!="H"){
                return (
                    <Button onClick={() => this.seleccionarItem(row)} variant="primary">Reporte</Button>
                    
                ); 
            }else{
                return (
                    <Button onClick={() => this.seleccionarItemHistorico(row)} variant="primary">Reporte</Button>
                    
                );
            }
           
            
        }
    }];

   
    
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
        
        if(item.cmetc_tipo_meta===1){
            cumplimientoMetasServicio.datosGeneralesConsulta(2,item.cmetc_tipo_meta,item.per_periodo,item.eje_idregsitro).then((responseDato) => { 
                var data = [];
                
                if (responseDato.data.codigoRespuesta == 200)
                {
                    this.props.setDataDetalleGV(responseDato.data.data.listCumplimientoMetasVisitas);
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
        if(item.cmetc_tipo_meta===2){
            cumplimientoMetasServicio.datosGeneralesConsulta(2,item.cmetc_tipo_meta,item.per_periodo,item.eje_idregsitro).then((responseDato) => { 
                var data = [];
                
                if (responseDato.data.codigoRespuesta == 200)
                {
                    this.props.setDataDetalleRE(responseDato.data.data.listCumplimientoMetasRecaudos);
                    this.setState({
                        showDetalleRecaudo:true, 
                        showDetalleGestion:false
                      });
                     // this.props.setShowListadoPrincipal();
                }else{
                  this.props.setDataDetalleRE(data);
                }
          
            });
            
        }
    }

    //para historicos
    
    seleccionarItemHistorico = (item) => {
        
        //const { formEdicionCCM } = this.props.gestionCarteraState;
            cumplimientoMetasServicio.ConsultaHistoricosReporte(2,item.cmetc_tipo_meta,item.per_periodo,item.eje_idregsitro, item.mege_idregistro).then((responseDato) => { 
                var data = [];
                
                if (responseDato.data.codigoRespuesta == 200)
                {
                    if(item.cmetc_tipo_meta===1){
                        this.props.setDataDetalleGV(responseDato.data.data.listCumplimientoMetasVisitas);
                        this.setState({
                            showDetalleGestion:true, 
                            showDetalleRecaudo:false
                          });
                    }else{
                        this.props.setDataDetalleGV(data);
                    }
                    if(item.cmetc_tipo_meta===2) {
                        this.props.setDataDetalleRE(responseDato.data.data.listCumplimientoMetasRecaudos);
                        this.setState({
                            showDetalleRecaudo:true, 
                            showDetalleGestion:false
                          });
                    }else{
                        this.props.setDataDetalleRE(data);
                    }
                    //this.props.setShowListadoPrincipal();
                }
          
            });
        
    }
    volver = (item) => {
        
        this.setState({
            showDetalleGestion:false, 
            showDetalleRecaudo:false
            });
            this.props.setShowListadoPrincipal();
    }

 
    

    render() {
        const { data } = this.props.gestionCarteraState
        return (
            <Fragment>
                <div><h1>Lista de Resultados</h1>
                <div className="customHr">.</div>
                <br />
                
                    <BootstrapTable bootstrap4 wrapperClasses="table-responsive" rowClasses="text-nowrap" striped bordered hover keyField='cmetc_idregistro' data={data} columns={this.state.columnas} pagination={paginationFactory()} filter={filterFactory()} filterPosition="top" noDataIndication="No hay registros disponible" />
                </div>
                <br/>
                <br/>
                <div className="relative-parent">
                    {this.state.showDetalleGestion &&(<RVistaListDetalleMetaGV/>)}
                    {this.state.showDetalleRecaudo &&(<RVistaListDetalleMetaRE/>)}
                    <br/>
                </div>
                <br />
             
            </Fragment>
        );
    }
}

ListResultadosConsolidacionMetas.propTypes = {
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
            type: ACCION.SET_SHOW_LISTARESULTMETA
        })
    },
    setDataDetalleRE(data) {
        dispatch({
            type: ACCION.SET_DATA_DETALLECMRE,
            payload: data
        })
    },
    setDataDetalleGV(data) {
        dispatch({
            type: ACCION.SET_DATA_DETALLECMGV,
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ListResultadosConsolidacionMetas);
export { VistaRedux as RVistaListResultadosConsolidacionMetas };