import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import axios from 'axios';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Modal from 'react-bootstrap4-modal';
import { ToastContainer, toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';

import RUTAS_API from '../../global/rutas_api';
import { PROGRAMAS, URL_COM } from '../../global/constantes';

import { RComNavbar } from './utiles/ComNavbar/ComNavbar';
import { RTercerosForm } from './utiles/TercerosForm/TercerosForm';
import { RImpuestosForm } from './utiles/ImpuestosForm/ImpuestosForm';
import { RVigenciaForm } from './utiles/VigenciaForm/VigenciaForm';
import { RRangosForm } from './utiles/RangosForm/RangosForm';

import './Comision.scss';

class ComRecCartera extends Component {
  state = {
    recCarteras: [],
    nuevoRecCartera: {
      pcrc_ideregistro: undefined,
      ter_ideregistro: undefined,
      uni_medpago: undefined,
      bcu_ideregistro: undefined,
      pcrc_vigencia_desde: '',
      pcrc_vigencia_hasta: ''
    },
    rangos: [],
    impuestos: [],
    editable: false,
    consultaInfo: {
      mostrar: false,
      recCarteras: []
    },
    filas: [],
    offset: 0,
    perPage: 10,
    currentPage: 0,
    pageCount: 0,
    pageData: [],
  }

  /**
   * Método encargado de cargar la lista en la tabla cuando se monte el componente
   */
  componentDidMount() {
    this.obtenerDatosComRecCartera();
  }

  /**
   * Método encargado de consultar las variables de priorización de conceptos
   */
  obtenerDatosComRecCartera = () => {
    axios.get(URL_COM+RUTAS_API.COMISION.REC_CARTERA)
      .then(respuesta => this.setState({ recCarteras: respuesta.data.datos },
        () => this.configurarModales()))
      .catch((error) => console.log(error));
  }

  configurarModales = () => {
    const recCarteras = this.state.recCarteras;

    recCarteras.forEach(recCartera => {
      recCartera.mostrarModalImpuesto = false;
      recCartera.mostrarModalEliminar = false;
      recCartera.mostrarModalRango = false;
    });

    this.setState({ recCarteras },
      () => {
        if (this.state.editable) this.setState({ editable: false });
        this.renderizarPaginas();
      });
  }

  /**
   * Método encargado de consultar una comision de recuperacion de cartera
   * a partir de un tercero
   */
  consultarRecCartera = (ter_ideregistro, uni_medpago, bcu_ideregistro) => {
    const consultaInfo = this.state.consultaInfo;

    if (!isNaN(ter_ideregistro)) {
      consultaInfo.recCarteras = [...this.state.recCarteras];

      consultaInfo.recCarteras = consultaInfo.recCarteras.filter((rec) =>
        rec.ter_ideregistro === ter_ideregistro);

      if (uni_medpago) consultaInfo.recCarteras = consultaInfo.recCarteras.filter(
        (rec) => rec.uni_medpago === uni_medpago);

      if (bcu_ideregistro) consultaInfo.recCarteras = consultaInfo.recCarteras.filter(
        (rec) => rec.bcu_ideregistro === bcu_ideregistro);
    }

    consultaInfo.mostrar = true;

    this.setState({ consultaInfo })
  }

  /**
   * Método encargado de cerrar el modal de consulta
   */
  cerrarModalConsulta = () => {
    this.setState({
      consultaInfo: {
        mostrar: false,
        recCarteras: []
      }
    });
  }

  /**
   * Método encargado de cerrar el modal de impuestos en consulta
   */
  controlarModalConsulta = (index, modalType) => {
    const consultaInfo = this.state.consultaInfo;
    consultaInfo.recCarteras[index][modalType] = 
      !consultaInfo.recCarteras[index][modalType];

    this.setState({ consultaInfo });
  }

  /**
   * Método encargado de cerrar el modal de impuestos
   */
  controlarModales = (index, modalType) => {
    const pageData = this.state.pageData;
    pageData[index][modalType] = !pageData[index][modalType];

    this.setState({ pageData });
  }

  modificarTercero = (ter_ideregistro, uni_ideregistro, bcu_ideregistro) => {
    const nuevoRecCartera = this.state.nuevoRecCartera;

    nuevoRecCartera.ter_ideregistro = ter_ideregistro;
    nuevoRecCartera.uni_medpago = uni_ideregistro;
    nuevoRecCartera.bcu_ideregistro = bcu_ideregistro;

    this.setState({ nuevoRecCartera });
  }

  modificarRango = (newRangos) => {
    const rangos = [];

    newRangos.forEach(rango => {
      rangos.push({
        rango_desde: rango.rango_desde,
        rango_hasta: rango.rango_hasta,
        comision: rango.comision
      })
    });

    this.setState({ rangos });
  }

  /**
   * Método encargado de actualizar el valor de la vigencia
   */
  modificarVigencia = (pcrc_vigencia_desde, pcrc_vigencia_hasta) => {
    const nuevoRecCartera = this.state.nuevoRecCartera;

    nuevoRecCartera.pcrc_vigencia_desde = pcrc_vigencia_desde;
    nuevoRecCartera.pcrc_vigencia_hasta = pcrc_vigencia_hasta;

    this.setState({ nuevoRecCartera });
  }

  modificarImpuestos = (newImpuestos) => {
    const impuestos = [];

    newImpuestos.forEach(impuesto => {
      impuestos.push({
        icc_porcentaje: impuesto.con_nombre,
        icc_valor: impuesto.con_valor,
        uni_impuesto: impuesto.uni_concepto,
        pcrc_ideregistro: undefined,
        active: impuesto.active
      })
    });

    this.setState({ impuestos });
  }

  agregarRecCartera = (evento) => {
    evento.preventDefault();
    const { nuevoRecCartera } = this.state;

    if (!nuevoRecCartera.ter_ideregistro) this.mostrarToast("Debe elegir un tercero");
    else if (!nuevoRecCartera.uni_medpago) this.mostrarToast("Debe elegir un convenio");
    else if (!nuevoRecCartera.bcu_ideregistro) this.mostrarToast("Debe elegir una cuenta del convenio");
    else {
      const data = {
        ter_ideregistro: nuevoRecCartera.ter_ideregistro,
        uni_medpago: nuevoRecCartera.uni_medpago,
        bcu_ideregistro: nuevoRecCartera.bcu_ideregistro,
        pcrc_vigencia_desde:  nuevoRecCartera.pcrc_vigencia_desde,
        pcrc_vigencia_hasta:  nuevoRecCartera.pcrc_vigencia_hasta
      }

      console.log(data);

      axios.post(URL_COM+RUTAS_API.COMISION.REC_CARTERA, data)
      .then((response) => {
        const id = response.data.id;
        const { rangos, impuestos } = this.state;
        const dataImpuestos = [];

        for (const impuesto of impuestos) {
          if (impuesto.active) dataImpuestos.push(impuesto);
        }

        if (dataImpuestos.length > 0) {
          for (let i = 0; i < dataImpuestos.length; i++) {
            dataImpuestos[i].pcrc_ideregistro = id;
            dataImpuestos[i].icc_ideregistro = null;
            dataImpuestos[i].usu_idregistro = null;
          }

          axios.post(URL_COM+RUTAS_API.COMISION.REC_CARTERA+"/impuestos", dataImpuestos)
            .then(() => {
              if (rangos.length > 0) {
                const dataRangos = rangos;
      
                for (let i = 0; i < dataRangos.length; i++) {
                  dataRangos[i].pcrc_ideregistro = id;
                  dataRangos[i].red_ideregistro = null;
                  dataRangos[i].usu_ideregistro = null;
                }
      
                axios.post(URL_COM+RUTAS_API.COMISION.REC_CARTERA+"/rangos", dataRangos)
                  .then(() => this.obtenerDatosComRecCartera())
                  .catch((error) => console.log(error));
              } else this.obtenerDatosComRecCartera();
            })
            .catch((error) => console.log(error));
        } else if (rangos.length > 0) {
          const dataRangos = rangos;

          for (let i = 0; i < dataRangos.length; i++) {
            dataRangos[i].pcrc_ideregistro = id;
            dataRangos[i].red_ideregistro = null;
            dataRangos[i].usu_ideregistro = null;
          }

          axios.post(URL_COM+RUTAS_API.COMISION.REC_CARTERA+"/rangos", dataRangos)
            .then(() => this.obtenerDatosComRecCartera())
            .catch((error) => console.log(error));
        } else this.obtenerDatosComRecCartera();
        this.setState({ editable: false });
      })
      .catch((error) => console.log(error));
    }
  }

  habilitarEdicion = (recCartera) => {
    this.setState({ editable: false });

    const nuevoRecCartera = this.state.nuevoRecCartera;

    nuevoRecCartera.pcrc_ideregistro = recCartera.pcrc_ideregistro;
    nuevoRecCartera.ter_ideregistro = recCartera.ter_ideregistro;
    nuevoRecCartera.uni_medpago = recCartera.uni_medpago;
    nuevoRecCartera.bcu_ideregistro = recCartera.bcu_ideregistro; 
    nuevoRecCartera.pcrc_vigencia_desde = recCartera.pcrc_vigencia_desde;
    nuevoRecCartera.pcrc_vigencia_hasta = recCartera.pcrc_vigencia_hasta;

    const rangos = [];
    recCartera.rangos.forEach(rango => {
      rangos.push({
        rango_desde: rango.rango_desde,
        rango_hasta: rango.rango_hasta,
        comision: rango.comision
      });
    });

    const impuestos = [];
    recCartera.impuesto.forEach(impuesto => {
      impuestos.push({
        icc_porcentaje: impuesto.icc_porcentaje,
        icc_valor: impuesto.icc_valor,
        uni_impuesto: impuesto.uni_impuesto,
        pcrc_ideregistro: recCartera.pcrc_ideregistro,
        active: true
      });
    });

    this.setState({ nuevoRecCartera, rangos, impuestos },
      () => this.setState({ editable: true },
        () => this.renderizarPaginas()));
  }

  cancelarEdicion = (evento) => {
    evento.preventDefault();

    const nuevoRecCartera = this.state.nuevoRecCartera;
    nuevoRecCartera.pcrc_ideregistro = undefined;

    this.setState({ nuevoRecCartera, editable: false },
      () => this.renderizarPaginas());
  }

  /**
   * Método encargado de editar en bd los cambios del recuperacion de cartera
   */
  editarRecCartera = (evento) => {
    evento.preventDefault();
    const { rangos, nuevoRecCartera } = this.state;

    if (isNaN(nuevoRecCartera.ter_ideregistro)) this.mostrarToast("Debe elegir un tercero");
    else if (!nuevoRecCartera.uni_medpago) this.mostrarToast("Debe elegir un convenio");
    else if (!nuevoRecCartera.bcu_ideregistro) this.mostrarToast("Debe elegir una cuenta del convenio");
    else if (rangos.length < 1 ) this.mostrarToast("Debe configurar al menos 1 rango");
    else {
      const data = {
        pcrc_vigencia_hasta: moment(nuevoRecCartera.pcrc_vigencia_desde)
          .subtract(1, 'd').format("YYYY-MM-DDTHH:mm:ss.SSSZ")
      }

      const id = nuevoRecCartera.pcrc_ideregistro;

      axios.put(URL_COM+RUTAS_API.COMISION.REC_CARTERA+"/accion/"+id+"/2", data)
        .then(() => this.agregarRecCartera(evento))
      .catch((error) => console.log(error));
    }
  }

  eliminarRecCartera = (evento, recCartera) => {
    evento.preventDefault();

    const id = recCartera.pcrc_ideregistro;

    axios.put(URL_COM+RUTAS_API.COMISION.REC_CARTERA+"/accion/"+id+"/0", {
      pcrc_vigencia_hasta: null
    })
      .then(() => this.obtenerDatosComRecCartera())
      .catch((error) => console.log(error));
    
  }

  mostrarToast = (mensaje) => {
    const opciones = {
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    }

    toast.error(mensaje, opciones);
  }

  /**
   * Método encargado de renderizar las filas de la tabla.
   */
  renderizarPaginas = () => {
    const { editable } = this.state;
    const data = this.state.recCarteras;
    const slices = data.slice(this.state.offset, this.state.offset + this.state.perPage);
    const pageData = [];

    slices.forEach(slice => {
      slice.mostrarModalImpuesto = false;
      slice.mostrarModalEliminar = false;

      pageData.push(slice);
    });

    const filas = slices.map((dato, index) =>
    <tr key={`recCartera-${index}`}>
      <td>{dato.terceroObject.ter_nomcompleto}</td>
      <td>{dato.bcu_ideregistro_object.bcu_numcuenta}</td>
      <td>{dato.medpagoObject.uni_nombre1}</td>
      <td>
        <button
          className="btn btn-primary"
          onClick={() => this.controlarModales(index, 'mostrarModalImpuesto')}>
          Mostrar</button>
      </td>
      <td>
        <button
          className="btn btn-primary"
          onClick={() => this.controlarModales(index, 'mostrarModalRango')}>
          Mostrar</button>
      </td>
      <td>
        {moment(dato.pcrc_vigencia_desde).format("DD/MM/YYYY")} -
        {moment(dato.pcrc_vigencia_hasta).format("DD/MM/YYYY")}
      </td>
      <td>
        {dato.pcrc_estado === "1" ?
        <div className="row">
          <div className="col-6">
            <button
              className="btn btn-primary"
              disabled={editable}
              onClick={(evento) => {
                evento.preventDefault();
                this.habilitarEdicion(dato)
              }}>
                Editar</button>
          </div>
          <div className="col-6">
            <button
              className="btn btn-primary"
              disabled={editable}
              onClick={() => this.controlarModales(index, 'mostrarModalEliminar')}>
                Archivar</button>
          </div>
        </div> :
        "Histórico"}
      </td>
    </tr>);
  
      const pageCount = Math.ceil(data.length / this.state.perPage);
  
      this.setState({ pageCount, filas, pageData });
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

  /**
   * Método encargado de renderizar la tabla de la consulta
   */
  renderTablaConsulta = () => {
    const { consultaInfo } = this.state;

    if (consultaInfo.recCarteras.length > 0) 
      return <table className='table mt-8'>
        <thead>
          <tr>
            <th scope="col">Recaudador</th>
            <th scope="col">Cuenta Bancaria</th>
            <th scope="col">Convenio</th>
            <th scope="col">Impuestos Asociados</th>
            <th scope="col">Rango</th>
            <th scope="col">Vigencia</th>
          </tr>
        </thead>
        <tbody>
          {consultaInfo.recCarteras.map((recCartera, index) =>
          <tr key={`rec-${index}`}>
            <td>{recCartera.terceroObject.ter_nomcompleto}</td>
            <td>{recCartera.bcu_ideregistro_object.bcu_numcuenta}</td>
            <td>{recCartera.medpagoObject.uni_nombre1}</td>
            <td>
              <button
                className="btn btn-primary"
                onClick={() => this.controlarModalConsulta(index, 'mostrarModalImpuesto')}>
                Mostrar</button>
            </td>
            <td>
              <button
                className="btn btn-primary"
                onClick={() => this.controlarModalConsulta(index, 'mostrarModalRango')}>
                Mostrar</button>
            </td>
            <td>
              {moment(recCartera.pcrc_vigencia_desde).format("DD/MM/YYYY")} -
              {moment(recCartera.pcrc_vigencia_hasta).format("DD/MM/YYYY")}
            </td>
          </tr>)}
        </tbody>
      </table>
    else return <span>No hay datos para la consulta</span>
  }

  render() {
    const {
      nuevoRecCartera,
      rangos,
      impuestos,
      editable,
      consultaInfo,
      filas,
      perPage,
      pageCount,
      pageData,
    } = this.state;

    return (
      <Fragment>
        <RComNavbar history={this.props.history}/>
        <form className="p-5">
          <RTercerosForm
            idPrograma={PROGRAMAS.COM_REC_CARTERA}
            modificarTercero={this.modificarTercero}
            comision={nuevoRecCartera}
            editable={editable}
            consultar={this.consultarRecCartera}/>
          <hr/>
          <RRangosForm
            modificarRango={this.modificarRango}
            rangosInfo={rangos}
            editable={editable}/>
          <hr/>
          <RVigenciaForm
            modificarVigencia={this.modificarVigencia}
            comision={nuevoRecCartera}
            editable={editable}/>
          <hr/>
          <div className="row">
            <div className="col-9">
              <RImpuestosForm
                modificarImpuestos={this.modificarImpuestos}
                impuestosInfo={impuestos}
                editable={editable}/>
            </div>
            <div className="col-3">
              {editable  ?
              <div>
                <button
                  className="btn btn-primary mt-5 w-100"
                  onClick={(evento) => this.editarRecCartera(evento)}>Editar</button>
                <button
                  className="btn btn-secundary mt-5 w-100"
                  onClick={(evento) => this.cancelarEdicion(evento)}>Cancelar</button>
              </div> :
              <button
                className="btn btn-primary mt-5 w-100"
                onClick={this.agregarRecCartera}>Agregar</button>}
            </div>
          </div>
        </form>
        <hr style={{ borderTop: "1px solid #007bff" }}/>
        <div className="scroll-table">
          <table className='table mt-8'>
            <thead>
              <tr>
                <th scope="col">Recaudador</th>
                <th scope="col">Cuenta Bancaria</th>
                <th scope="col">Convenio</th>
                <th scope="col">Impuestos Asociados</th>
                <th scope="col">Rango</th>
                <th scope="col">Vigencia</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filas}
            </tbody>
          </table>
        </div>
        <div className="form-row align-items-center">
          <div className="col-auto">
            <ReactPaginate
              previousLabel={"Anterior"}
              nextLabel={"Siguiente"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.controlarClickAPagina}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}/>
          </div>
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
        {pageData.map((data, index) =>
          [<Modal
            key={`modal-impuesto-${index}`}
            visible={data.mostrarModalImpuesto}
            onClickBackdrop={() => this.controlarModales(index, 'mostrarModalImpuesto')}>
            <div className="modal-header">
              <h5 className="modal-title">Impuestos</h5>
            </div>
            <div className="modal-body">
              {data.impuesto.length > 0 ? 
              <table className='table'>
                <thead>
                  <tr>
                    <th scope="col">Tipo</th>
                    <th scope="col">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {data.impuesto.map((impuesto, jindex) =>
                  <tr key={`impuesto-${jindex}`}>
                    <td>{impuesto.icc_porcentaje}</td>
                    <td>{impuesto.icc_valor}</td>
                  </tr>)}
                </tbody>
              </table> :
              "No hay impuestos para esta entrada"}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => this.controlarModales(index, 'mostrarModalImpuesto')}>
                Cerrar</button>
            </div>
          </Modal>,
          <Modal
            key={`modal-rango-${index}`}
            visible={data.mostrarModalRango}
            onClickBackdrop={() => this.controlarModales(index, 'mostrarModalRango')}>
            <div className="modal-header">
              <h5 className="modal-title">Rangos</h5>
            </div>
            <div className="modal-body">
              <table className='table'>
                <thead>
                  <tr>
                    <th scope="col">Desde</th>
                    <th scope="col">Hasta</th>
                    <th scope="col">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rangos.map((rango, jindex) =>
                  <tr key={`rango-${jindex}`}>
                    <td>{rango.rango_desde}</td>
                    <td>{rango.rango_hasta}</td>
                    <td>{rango.comision}</td>
                  </tr>)}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => this.controlarModales(index, 'mostrarModalRango')}>
                Cerrar</button>
            </div>
          </Modal>,
          <Modal
            key={`modal-eliminar-${index}`}
            visible={data.mostrarModalEliminar}
            onClickBackdrop={() => this.controlarModales(index, 'mostrarModalEliminar')}>
            <div className="modal-header">
              <h5 className="modal-title">Archivar</h5>
            </div>
            <div className="modal-body">
              <span>Seguro que desea archivar esta entrada, no podrá verla en la tabla después de esta acción</span>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={(evento) => this.eliminarRecCartera(evento, data)}>
                Si</button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => this.controlarModales(index, 'mostrarModalEliminar')}>
                No</button>
            </div>
          </Modal>]
        )}
        <Modal
          className="modal-tabla"
          visible={consultaInfo.mostrar}
          onClickBackdrop={() => this.cerrarModalConsulta()}>
          <div className="modal-header">
            <h5 className="modal-title">Archivar</h5>
          </div>
          <div className="modal-body">
            {this.renderTablaConsulta()}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => this.cerrarModalConsulta()}>
              Cerrar</button>
          </div>
        </Modal>
        {consultaInfo.recCarteras.map((data, index) =>
          [<Modal
            key={`modal-impuesto-${index}`}
            visible={data.mostrarModalImpuesto}
            onClickBackdrop={() => this.controlarModalConsulta(index, 'mostrarModalImpuesto')}>
            <div className="modal-header">
              <h5 className="modal-title">Impuestos</h5>
            </div>
            <div className="modal-body">
              {data.impuesto.length > 0 ? 
              <table className='table'>
                <thead>
                  <tr>
                    <th scope="col">Tipo</th>
                    <th scope="col">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {data.impuesto.map((impuesto, jindex) =>
                  <tr key={`impuesto-${jindex}`}>
                    <td>{impuesto.icc_porcentaje}</td>
                    <td>{impuesto.icc_valor}</td>
                  </tr>)}
                </tbody>
              </table> :
              "No hay impuestos para esta entrada"}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => this.controlarModalConsulta(index, 'mostrarModalImpuesto')}>
                Cerrar</button>
            </div>
          </Modal>,
          <Modal
            key={`modal-rango-${index}`}
            visible={data.mostrarModalRango}
            onClickBackdrop={() => this.controlarModalConsulta(index, 'mostrarModalRango')}>
            <div className="modal-header">
              <h5 className="modal-title">Rangos</h5>
            </div>
            <div className="modal-body">
              <table className='table'>
                <thead>
                  <tr>
                    <th scope="col">Desde</th>
                    <th scope="col">Hasta</th>
                    <th scope="col">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rangos.map((rango, jindex) =>
                  <tr key={`rango-${jindex}`}>
                    <td>{rango.rango_desde}</td>
                    <td>{rango.rango_hasta}</td>
                    <td>{rango.comision}</td>
                  </tr>)}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => this.controlarModalConsulta(index, 'mostrarModalRango')}>
                Cerrar</button>
            </div>
          </Modal>]
        )}
        <ToastContainer
          position="top-right"
          autoClose={4500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
      </Fragment>
    );
  }
}

ComRecCartera.propTypes = {
  history: PropTypes.object
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ComRecCartera);

export { VistaRedux as RComRecCartera };