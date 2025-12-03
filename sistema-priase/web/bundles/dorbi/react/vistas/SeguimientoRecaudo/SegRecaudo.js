import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
// import Modal from 'react-bootstrap4-modal';
import moment from 'moment';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { saveAs } from "file-saver";

import RUTAS_API from '../../global/rutas_api';
import { PROGRAMAS, URL_GEN_COM } from '../../global/constantes';

// import { RGenComNavbar } from './utiles/GenComNavbar/GenComNavbar';
import { RSegRecTercerosForm } from './utiles/SegRecTercerosForm/SegRecTercerosForm';
import { RSegRecFechas } from './utiles/SegRecFechas/SegRecFechas';
// import { RGenComImpuestos } from './utiles/GenComImpuestos/GenComImpuestos';
// import { RGenComNovedades  } from './utiles/GenComNovedades/GenComNovedades';

import './SegRecaudo.scss'

class SegRecaudo extends Component{
  state = {
    consulta: {
      ter_ideregistro: undefined,
      uni_medpago: undefined,
      bcu_ideregistro: undefined,
      fecha_desde: '',
      fecha_hasta: ''
    },
    periodo: {
      ciclo: '',
      periodo: ''
    },
    comisiones: [],
    filas: [],
    offset: 0,
    perPage: 10,
    currentPage: 0,
    pageCount: 0,
    pageData: [],
  }

  /**
   * Método encargado de actualizar el valor de los terceros
   */
  modificarTercero = (ter_ideregistro, uni_ideregistro, bcu_ideregistro) => {
    const consulta = this.state.consulta;

    consulta.ter_ideregistro = ter_ideregistro;
    consulta.uni_medpago = uni_ideregistro;
    consulta.bcu_ideregistro = bcu_ideregistro;

    this.setState({ consulta });
  }

  /**
   * Método encargado de actualizar el valor de las fechas
   */
  modificarFechas = (fecha_desde, fecha_hasta) => {
    const consulta = this.state.consulta;

    consulta.fecha_desde = fecha_desde;
    consulta.fecha_hasta = fecha_hasta;

    this.setState({ consulta });
  }

  /**
   * Método encargado de consultar las comisiones
   */
  consultarComision = () => {
    const { consulta } = this.state;

    const ter_ideregistro = consulta.ter_ideregistro ? consulta.ter_ideregistro : null;
    const uni_medpago = consulta.uni_medpago ? consulta.uni_medpago : null;
    const bcu_ideregistro = consulta.bcu_ideregistro ? consulta.bcu_ideregistro : null;
    const rec_fechadesde = consulta.fecha_desde;
    const rec_fechahasta = consulta.fecha_hasta;
    const limit = 10000;

    const data = {
      ter_ideregistro,
      uni_medpago,
      bcu_ideregistro,
      rec_fechadesde,
      rec_fechahasta
    }
    
    axios.post(URL_GEN_COM+RUTAS_API.GEN_COMISION.SEG_RECAUDOS, data, { params: { limit } })
      .then(respuesta => this.setState({ comisiones: respuesta.data.datos, currentPage: 0, offset: 0 },
        () => this.renderizarPaginas()))
      .catch((error) => console.log(error));
  }

  /**
   * Método encargado de exportar las comisiones
   */
   exportarComision = () => {
    const { consulta } = this.state;

    const ter_ideregistro = consulta.ter_ideregistro ? consulta.ter_ideregistro : null;
    const uni_medpago = consulta.uni_medpago ? consulta.uni_medpago : null;
    const bcu_ideregistro = consulta.bcu_ideregistro ? consulta.bcu_ideregistro : null;
    const rec_fechadesde = consulta.fecha_desde;
    const rec_fechahasta = consulta.fecha_hasta;
    const limit = 10000;

    const data = {
      ter_ideregistro,
      uni_medpago,
      bcu_ideregistro,
      rec_fechadesde,
      rec_fechahasta
    }
    
    axios.post(URL_GEN_COM+RUTAS_API.GEN_COMISION.SEG_RECAUDOS+'/exportar', data, { responseType: 'arraybuffer', params: { limit } })
      .then(respuesta => {
        let filename = "";
        let disposition = respuesta.headers['content-disposition'];
        if (disposition && disposition.indexOf('attachment') !== -1) {
            var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            var matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) { 
              filename = matches[1].replace(/['"]/g, '');
            }
        }
      
        var blob = new Blob([respuesta.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, filename);

      })
      .catch((error) => console.log(error));
  }

  /**
   * Método encargado de guardar el seguimiento
   */
  procesarComision = () => {
    const { consulta, comisiones } = this.state;

    var data = comisiones.filter( obj => obj.actualizar === true )
    console.log('procesarComision',data)

    axios.put(URL_GEN_COM+RUTAS_API.GEN_COMISION.SEG_RECAUDOS, data)
      // .then(respuesta => console.log('respuesta',respuesta))
      .catch((error) => console.log(error));
  }

  cambiarValorBase = (valor, key) => {
    // const { comisiones } = this.state;
    // console.log("cambiarValorPagado valor",valor,key)

    this.setState(prevState => ({ 
      comisiones: prevState.comisiones.map((item) => item.key == key? { ...item, segr_vlrpagado: valor, dif_recaudado_vs_aplicado: item.rec_vlrpagado - valor, actualizar: true } :item) ,
    }))
  }

  cambiarValorTransacciones = (valor, key) => {
    // const { comisiones } = this.state;
    // console.log("cambiarValorTransacciones valor",valor,id)

    this.setState(prevState => ({ 
      comisiones: prevState.comisiones.map((item) => item.key == key? { ...item, segr_transacciones: valor, dif_trans_recaudado_vs_aplicado: item.rec_transacciones - valor, actualizar: true } :item) ,
    }))
  }

  /**
   * Método encargado de renderizar las filas de la tabla.
   */
  renderizarPaginas = () => {
    // console.log("renderizarPaginas",this.state.comisiones)
    const data = this.state.comisiones;
    const slices = data.slice(this.state.offset, this.state.offset + this.state.perPage);
    // const pageData = [];

    // const pageCount = Math.ceil(data.length / this.state.perPage);
    // this.setState({ pageCount });

    // slices.forEach(slice => {
    //   slice.mostrarModalImpuesto = false;
    //   slice.mostrarModalNovedad = false;

    //   pageData.push(slice);
    // });

    // const filas = slices.map((dato, index) =>
    return slices.map((dato, index) =>
      <tr key={`rec-${index}`}>
        <td>{dato.ter_nomcompleto}</td>
        <td>{dato.uni_nombre1}</td>
        <td>{dato.bcu_numcuenta}</td>
        <td>{moment(dato.segr_fecha).format('DD/MM/YYYY')}</td>
        <td align="right">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' })
          .format(dato.rec_vlrpagado)}</td>
        <td align="right">{dato.rec_transacciones}</td>
        <td align="right">
          <input key={`seg-vlr-${dato.key}`} className="form-control" style={{width: "100px"}}
                name="segr_vlrpagado"
                type="text"
                data-inputmask={{alias: 'currency'}}
                value={dato.segr_vlrpagado?dato.segr_vlrpagado:''} 
                onChange={(e) => {
                  e.preventDefault()
                  const re = /^\d+$/
                  if (e.target.value.length===0 || re.test(e.target.value)) 
                    this.cambiarValorBase(e.target.value,dato.key)
                }}
                onPaste={(e) => {
                  e.preventDefault()
                  let value = e.clipboardData.getData('Text')
                  value = value.replace(/[^\d]/g, '')
                  this.cambiarValorBase(value,dato.key)
                }}
                />
        </td>
        <td align="right">
          <input key={`seg-tx-${dato.key}`} className="form-control" style={{width: "100px"}}
                name="segr_transacciones"
                type="text"
                value={dato.segr_transacciones?dato.segr_transacciones:''}
                onChange={(e) => {
                  e.preventDefault()
                  const re = /^\d+$/
                  if (e.target.value.length===0 || re.test(e.target.value)) 
                    this.cambiarValorTransacciones(e.target.value,dato.key)
                }}
                onPaste={(e) => {
                  e.preventDefault()
                  let value = e.clipboardData.getData('Text')
                  value = value.replace(/[^\d]/g, '')
                  this.cambiarValorTransacciones(value,dato.key)
                }}
                />
        </td>
        <td align="right">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' })
          .format(dato.dif_recaudado_vs_aplicado)}</td>
        <td align="right">{dato.dif_trans_recaudado_vs_aplicado}</td>
        <td align="right">
          {dato.comision_tipo==='NO_APLICA' && dato.comision_sin_iva}
          {dato.comision_tipo==='TRANSACCION' && new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' })
          .format(dato.comision_sin_iva)}
          {dato.comision_tipo==='PORCENTAJE' && new Intl.NumberFormat('es-CO', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })
          .format(dato.comision_sin_iva)}
        </td>
        <td align="right">
          <span className="mr-2">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' })
            .format(dato.comision_valor_total)}</span>
        </td>
      </tr>)
  
    // const pageCount = Math.ceil(data.length / this.state.perPage);
  
    // // this.setState({ pageCount, filas, pageData });
    // this.setState({ pageCount, pageData });
  }

  /**
   * Método encargado de controlar el cambio de página.
   */
  controlarClickAPagina = (evento) => {
    const currentPage = evento.selected;
    const offset = currentPage * this.state.perPage;

    this.setState({ currentPage, offset, pageData: [] },
      () => this.renderizarPaginas());
  }

  /**
   * Método encargado de actualizar el valor de máximo número de filas por página en la tabla.
   */
  actualizarNumeroDeFilas = (evento) => {
    evento.preventDefault();

    const perPage = Number(evento.target.value);
    const currentPage = 0;
    const offset = 0;

    this.setState({ perPage, currentPage, offset, pageData: [] },
      () => this.renderizarPaginas());
  }

  render() {
    const {
      consulta,
      filas,
      periodo,
      perPage,
      pageCount,
      pageData, comisiones } = this.state;

    console.log("comisiones",comisiones)

    return (
      <Fragment>
        <RSegRecTercerosForm
          idPrograma={PROGRAMAS.SEG_RECAUDO}
          modificarTercero={this.modificarTercero}
          consulta={consulta}/>
        <RSegRecFechas
          modificarFechas={this.modificarFechas}
          consultarComision={this.consultarComision}
          exportarComision={this.exportarComision}
          procesarComision={this.procesarComision}/>
        <table className='table mt-8'>
          <thead>
            <tr>
              <th scope="col">Banco</th>
              <th scope="col">Medio de Pago</th>
              <th scope="col">Nro. Cuenta</th>
              <th scope="col">Fecha Recaudo</th>
              <th scope="col">Valor Recaudado</th>
              <th scope="col">Nro. Transac.</th>
              <th scope="col">Vr. Recaudado Aplicado</th>
              <th scope="col">Nro. Transac. Aplicadas</th>
              <th scope="col">Dif. Valor Recaudado</th>
              <th scope="col">Dif. Nro. Transac.</th>
              <th scope="col">Comisión Sin IVA</th>
              <th scope="col">Vr. Total Comisión</th>
            </tr>
          </thead>
          <tbody>
            {this.renderizarPaginas()}
          </tbody>
        </table>
        <div className="form-row align-items-center">
          {comisiones && 
          <div className="col-auto">
            <ReactPaginate
              previousLabel={"Anterior"}
              nextLabel={"Siguiente"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={Math.ceil(comisiones.length / perPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.controlarClickAPagina}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}/>
          </div>
          }
          <div className="col-auto">
            <select
              className="form-control"
              value={perPage}
              onChange={this.actualizarNumeroDeFilas}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </Fragment>
    );
  }
}

SegRecaudo.propTypes = {
  history: PropTypes.object
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(SegRecaudo);

export { VistaRedux as RSegRecaudo };