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
import { RCostoForm } from './utiles/CostoForm/CostoForm';
import { RVigenciaForm } from './utiles/VigenciaForm/VigenciaForm';
import { RImpuestosForm } from './utiles/ImpuestosForm/ImpuestosForm';

import './Comision.scss';

class ComRecaudo extends Component {
  state = {
    recaudos: [],
    nuevoRecaudo: {
      prc_valor: undefined,
      ter_ideregistro: undefined,
      uni_medpago: undefined,
      bcu_ideregistro: undefined,
      uni_tipocosto: undefined,
      prc_ideregistro: undefined,
      prc_vigencia_desde: '',
      prc_vigencia_hasta: ''
    },
    impuestos: [],
    editable: false,
    consultaInfo: {
      mostrar: false,
      recaudos: []
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
    this.obtenerDatosComRecaudo();
  }

  /**
   * Método encargado de obtener los datos existentes de comisión de recaudos
   */
  obtenerDatosComRecaudo = () => {
    axios.get(URL_COM+RUTAS_API.COMISION.RECAUDOS)
      .then(respuesta => this.setState({ recaudos: respuesta.data.datos },
        () => this.configurarModales()))
      .catch((error) => console.log(error));
  }

  /**
   * Método encargado de configurar los valores booleanos que permitiran
   * mostrar modales con informacion en la tabla
   */
  configurarModales = () => {
    const recaudos = this.state.recaudos;

    recaudos.forEach(recaudo => {
      recaudo.mostrarModalImpuesto = false;
      recaudo.mostrarModalEliminar = false;
    });

    this.setState({ recaudos },
      () => {
        if (this.state.editable) this.setState({ editable: false });
        this.renderizarPaginas();
      });
  }

  /**
   * Método encargado de consultar un recaudo a partir de un tercero
   */
  consultarRecaudo = (ter_ideregistro, uni_medpago, bcu_ideregistro) => {
    const consultaInfo = this.state.consultaInfo;

    if (!isNaN(ter_ideregistro)) {
      consultaInfo.recaudos = [...this.state.recaudos];

      consultaInfo.recaudos = consultaInfo.recaudos.filter((rec) =>
        rec.ter_ideregistro === ter_ideregistro);

      if (uni_medpago) consultaInfo.recaudos = consultaInfo.recaudos.filter(
        (rec) => rec.uni_medpago === uni_medpago);

      if (bcu_ideregistro) consultaInfo.recaudos = consultaInfo.recaudos.filter(
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
        recaudos: []
      }
    });
  }

  /**
   * Método encargado de cerrar el modal de impuestos en consulta
   */
  controlarModalConsulta = (index, modalType) => {
    const consultaInfo = this.state.consultaInfo;
    consultaInfo.recaudos[index][modalType] = 
      !consultaInfo.recaudos[index][modalType];

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

  /**
   * Método encargado de actualizar el valor de los terceros
   */
  modificarTercero = (ter_ideregistro, uni_ideregistro, bcu_ideregistro) => {
    const nuevoRecaudo = this.state.nuevoRecaudo;

    nuevoRecaudo.ter_ideregistro = ter_ideregistro;
    nuevoRecaudo.uni_medpago = uni_ideregistro;
    nuevoRecaudo.bcu_ideregistro = bcu_ideregistro;

    this.setState({ nuevoRecaudo });
  }

  /**
   * Método encargado de actualizar el valor de los costos
   */
  modificarCostos = (uni_tipocosto, prc_valor) => {
    const nuevoRecaudo = this.state.nuevoRecaudo;

    nuevoRecaudo.uni_tipocosto = uni_tipocosto;
    nuevoRecaudo.prc_valor = prc_valor;

    this.setState({ nuevoRecaudo });
  }

  /**
   * Método encargado de actualizar el valor de la vigencia
   */
  modificarVigencia = (prc_vigencia_desde, prc_vigencia_hasta) => {
    const nuevoRecaudo = this.state.nuevoRecaudo;

    nuevoRecaudo.prc_vigencia_desde = prc_vigencia_desde;
    nuevoRecaudo.prc_vigencia_hasta = prc_vigencia_hasta;

    this.setState({ nuevoRecaudo });
  }

  /**
   * Método encargado de actualizar el valor de los impuestos
   */
  modificarImpuestos = (newImpuestos) => {
    const impuestos = [];

    newImpuestos.forEach(impuesto => {
      impuestos.push({
        irc_porcentaje: impuesto.con_nombre,
        irc_valor: impuesto.con_valor,
        uni_impuesto: impuesto.uni_concepto,
        prc_ideregistro: undefined,
        active: impuesto.active
      })
    });

    this.setState({ impuestos });
  }

  /**
   * Método encargado de agregr la entrada de un nuevo recaudo
   */
  agregarRecaudo = (evento) => {
    evento.preventDefault();
    const { nuevoRecaudo } = this.state;

    if (!nuevoRecaudo.ter_ideregistro) this.mostrarToast("Debe elegir un tercero");
    else if (!nuevoRecaudo.uni_medpago) this.mostrarToast("Debe elegir un convenio");
    else if (!nuevoRecaudo.bcu_ideregistro) this.mostrarToast("Debe elegir una cuenta del convenio");
    else {
      const data = {
        ter_ideregistro: nuevoRecaudo.ter_ideregistro,
        uni_medpago: nuevoRecaudo.uni_medpago,
        bcu_ideregistro: nuevoRecaudo.bcu_ideregistro,
        uni_tipocosto: nuevoRecaudo.uni_tipocosto,
        prc_valor: nuevoRecaudo.prc_valor,
        prc_vigencia_desde:  nuevoRecaudo.prc_vigencia_desde,
        prc_vigencia_hasta:  nuevoRecaudo.prc_vigencia_hasta
      }

      axios.post(URL_COM+RUTAS_API.COMISION.RECAUDOS, data)
      .then((response) => {
        const { impuestos } = this.state;

        if (impuestos.length > 0) {
          const id = response.data.id;
          const { impuestos } = this.state;
          const dataImpuestos = [];

          for (const impuesto of impuestos) {
            if (impuesto.active) dataImpuestos.push(impuesto);
          }

          if (dataImpuestos.length > 0) {
            for (let i = 0; i < dataImpuestos.length; i++) {
              dataImpuestos[i].prc_ideregistro = id;
            }
  
            axios.post(URL_COM+RUTAS_API.COMISION.RECAUDOS+"/impuestos", dataImpuestos)
              .then(() => this.obtenerDatosComRecaudo())
              .catch((error) => console.log(error));
          } else this.obtenerDatosComRecaudo();
        } else this.obtenerDatosComRecaudo();
      })
      .catch((error) => console.log(error));
    }
  }

  /**
   * Método encargado de configurar y habilitar la entrada de un recaudo
   */
  habilitarEdicion = (recaudo) => {
    this.setState({ editable: false });

    const nuevoRecaudo = this.state.nuevoRecaudo;

    nuevoRecaudo.prc_ideregistro = recaudo.prc_ideregistro;
    nuevoRecaudo.ter_ideregistro = recaudo.ter_ideregistro;
    nuevoRecaudo.uni_medpago = recaudo.uni_medpago;
    nuevoRecaudo.uni_tipocosto = recaudo.uni_tipocosto;
    nuevoRecaudo.bcu_ideregistro = recaudo.bcu_ideregistro,
    nuevoRecaudo.prc_valor = recaudo.prc_valor;
    nuevoRecaudo.prc_vigencia_desde = recaudo.prc_vigencia_desde;
    nuevoRecaudo.prc_vigencia_hasta = recaudo.prc_vigencia_hasta;

    const impuestos = [];

    recaudo.impuesto.forEach(impuesto => {
      impuestos.push({
        irc_porcentaje: impuesto.irc_porcentaje,
        irc_valor: impuesto.irc_valor,
        uni_impuesto: impuesto.uni_impuesto,
        prc_ideregistro: recaudo.prc_ideregistro,
        active: true
      });
    });

    this.setState({ nuevoRecaudo, impuestos },
      () => this.setState({ editable: true },
        () => this.renderizarPaginas()));
  }

  /**
   * Método encargado de configurar y cancelar la edición de la entrada
   * de un recaudo
   */
  cancelarEdicion = (evento) => {
    evento.preventDefault();

    const nuevoRecaudo = this.state.nuevoRecaudo;
    nuevoRecaudo.prc_ideregistro = undefined;

    this.setState({ nuevoRecaudo, editable: false },
      () => this.renderizarPaginas());
  }

  /**
   * Método encargado de editar en bd los cambios del recaudo
   */
  editarRecaudo = (evento) => {
    evento.preventDefault();
    const { nuevoRecaudo } = this.state;

    if (isNaN(nuevoRecaudo.ter_ideregistro)) this.mostrarToast("Debe elegir un tercero");
    else if (!nuevoRecaudo.uni_medpago) this.mostrarToast("Debe elegir un convenio");
    else if (!nuevoRecaudo.bcu_ideregistro) this.mostrarToast("Debe elegir una cuenta del convenio");
    else {
      const data = {
        prc_vigencia_hasta: moment(nuevoRecaudo.prc_vigencia_desde)
          .subtract(1, 'd').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      }

      const id = nuevoRecaudo.prc_ideregistro;

      axios.put(URL_COM+RUTAS_API.COMISION.RECAUDOS+"/accion/"+id+"/2", data)
        .then(() => this.agregarRecaudo(evento))
        .catch((error) => console.log(error));
    }
  }

  /**
   * Método encargado de archivar la entrada de un recaudo
   */
  eliminarRecaudo = (evento, recaudo) => {
    evento.preventDefault();
    const id = recaudo.prc_ideregistro;

    axios.put(URL_COM+RUTAS_API.COMISION.RECAUDOS+'/accion/'+id+"/0", {
      prc_vigencia_hasta: null
    })
      .then(() => this.obtenerDatosComRecaudo())
      .catch((error) => console.log(error));
  }

  /**
   * Método encargado de mostrar mensajes adicionales
   */
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
    const data = this.state.recaudos;
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
        <td>{dato.uni_tipocosto_object.uni_nombre1} - Valor: {dato.prc_valor}</td>
        <td>
          {moment(dato.prc_vigencia_desde).format("DD/MM/YYYY")} -
          {moment(dato.prc_vigencia_hasta).format("DD/MM/YYYY")}
        </td>
        <td>
          {dato.prc_estado === "1" ?
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

    if (consultaInfo.recaudos.length > 0) 
      return <table className='table mt-8'>
        <thead>
          <tr>
            <th scope="col">Recaudador</th>
            <th scope="col">Cuenta Bancaria</th>
            <th scope="col">Convenio</th>
            <th scope="col">Impuestos Asociados</th>
            <th scope="col">Costo</th>
            <th scope="col">Vigencia</th>
          </tr>
        </thead>
        <tbody>
          {consultaInfo.recaudos.map((recaudo, index) =>
          <tr key={`rec-${index}`}>
            <td>{recaudo.terceroObject.ter_nomcompleto}</td>
            <td>{recaudo.bcu_ideregistro_object.bcu_numcuenta}</td>
            <td>{recaudo.medpagoObject.uni_nombre1}</td>
            <td>
              <button
                className="btn btn-primary"
                onClick={() => this.controlarModalConsulta(index)}>
                Mostrar</button>
            </td>
            <td>{recaudo.uni_tipocosto_object.uni_nombre1} - Valor: {recaudo.prc_valor}</td>
            <td>
              {moment(recaudo.prc_vigencia_desde).format("DD/MM/YYYY")} -
              {moment(recaudo.prc_vigencia_hasta).format("DD/MM/YYYY")}
            </td>
          </tr>)}
        </tbody>
      </table>
    else return <span>No hay datos para la consulta</span>
  }

  /**
   * Método encargado de renderizar el formulario y la tabla de comisión de recaudos.
   */
  render() {
    const {
      nuevoRecaudo,
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
            idPrograma={PROGRAMAS.COM_RECAUDO}
            modificarTercero={this.modificarTercero}
            comision={nuevoRecaudo}
            editable={editable}
            consultar={this.consultarRecaudo}/>
          <hr/>
          <RCostoForm
            modificarCostos={this.modificarCostos}
            comision={nuevoRecaudo}
            editable={editable}/>
          <hr/>
          <RVigenciaForm
            modificarVigencia={this.modificarVigencia}
            comision={nuevoRecaudo}
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
                  onClick={(evento) => this.editarRecaudo(evento)}>Editar</button>
                <button
                  className="btn btn-secundary mt-5 w-100"
                  onClick={(evento) => this.cancelarEdicion(evento)}>Cancelar</button>
              </div> :
              <button
                className="btn btn-primary mt-5 w-100"
                onClick={this.agregarRecaudo}>Agregar</button>}
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
                <th scope="col">Costo</th>
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
                    <td>{impuesto.irc_porcentaje}</td>
                    <td>{impuesto.irc_valor}</td>
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
                onClick={(evento) => this.eliminarRecaudo(evento, data)}>
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
        {consultaInfo.recaudos.map((data, index) =>
          <Modal
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
                    <td>{impuesto.irc_porcentaje}</td>
                    <td>{impuesto.irc_valor}</td>
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
          </Modal>)}
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

ComRecaudo.propTypes = {
  history: PropTypes.object
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ComRecaudo);

export { VistaRedux as RComRecaudo };