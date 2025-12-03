import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes, { string } from 'prop-types';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import Modal from 'react-bootstrap4-modal';

import RUTAS_API from '../../../../global/rutas_api';
import { URL_GEN_COM } from '../../../../global/constantes';

import { RGenComArchivos  } from '../GenComArchivos/GenComArchivos';
import './GenComNovedades.scss'

class GenComNovedades extends Component{
  state = {
    novedades: [],
    nuevaNovedad: {
      tipo: 3463,
      observ: ''
    },
    modalCrear: false
  }

  componentDidMount() {
    this.obtenerNovedades();
  }

  obtenerNovedades = () => {
    if (this.props.tipo === "recaudo") {
      const data = { gcr_ideregistro: this.props.comId };

      axios.post(URL_GEN_COM+RUTAS_API.GEN_COMISION.NOVEDADES_REC_CONSULTAR, data)
        .then(respuesta => this.setState({ novedades: respuesta.data.datos },
          () => this.configurarModalArchivos()))
        .catch((error) => console.log(error));
    } else {
      const data = { gcc_ideregistro: this.props.comId };
      axios.post(URL_GEN_COM+RUTAS_API.GEN_COMISION.NOVEDADES_CARTERA_CONSULTAR, data)
        .then(respuesta => this.setState({ novedades: respuesta.data.datos },
          () => this.configurarModalArchivos()))
        .catch((error) => console.log(error));
    }
  }

  configurarModalArchivos = () => {
    const novs = this.state.novedades;
    const novedades = [];

    novs.forEach(novedad => {
      const nov = novedad;
      nov.modalArchivos = false;
      novedades.push(nov);
    });

    this.setState({ novedades })
  }

  controlarModalArchivos = (index) => {
    const novedades = this.state.novedades;
    novedades[index].modalArchivos = !novedades[index].modalArchivos;
    this.setState({ novedades });
  }

  controlarModalCrear = () => {
    const modalCrear = !this.state.modalCrear;

    this.setState({ modalCrear });
  }

  actualizarTipo = (evento, index) => {
    const novedades = this.state.novedades;
    const id = Number(evento.target.value);
    
    if (this.props.tipo === "recaudo") 
      novedades[index].gcrn_tiponovedad = id;
    else novedades[index].gccn_tiponovedad = id;

    this.setState({ novedades });
  }

  cambiarObserv = (evento, index) => {
    evento.preventDefault();
    const novedades = this.state.novedades;
    const observ = evento.target.value;

    if (this.props.tipo === "recaudo") 
      novedades[index].gcrn_observacion = observ;
    else novedades[index].gccn_observacion = observ;

    this.setState({ novedades });
  }

  crearNovedad = (evento) => {
    evento.preventDefault();

    if (this.props.tipo === "recaudo") {
      const data = {
        gcr_ideregistro: this.props.comId,
        gcrn_observacion: this.state.nuevaNovedad.observ,
        gcrn_tiponovedad: this.state.nuevaNovedad.tipo
      }
  
      axios.post(URL_GEN_COM+RUTAS_API.GEN_COMISION.NOVEDADES_REC_CREAR, data)
        .then(() => this.obtenerNovedades())
        .catch((error) => console.log(error));
    } else {
      const data = {
        gcc_ideregistro: this.props.comId,
        gccn_observacion: this.state.nuevaNovedad.observ,
        gccn_tiponovedad: this.state.nuevaNovedad.tipo
      }
  
      axios.post(URL_GEN_COM+RUTAS_API.GEN_COMISION.NOVEDADES_CARTERA_CREAR, data)
        .then(() => this.obtenerNovedades())
        .catch((error) => console.log(error));
    }
  }

  editarNovedad = (evento, index) => {
    evento.preventDefault();

    if (this.props.tipo === "recaudo") {
      const data = {
        gcrn_ideregistro: this.state.novedades[index].gcrn_ideregistro,
        gcrn_observacion: this.state.novedades[index].gcrn_observacion,
        gcrn_tiponovedad: this.state.novedades[index].gcrn_tiponovedad,
        gcr_ideregistro: this.props.comId
      }
  
      axios.post(URL_GEN_COM+RUTAS_API.GEN_COMISION.NOVEDADES_REC_MODIFICAR, data)
        .then(() => this.obtenerNovedades())
        .catch((error) => console.log(error));
    } else {
      const data = {
        gccn_ideregistro: this.state.novedades[index].gccn_ideregistro,
        gccn_observacion: this.state.novedades[index].gccn_observacion,
        gccn_tiponovedad: this.state.novedades[index].gccn_tiponovedad,
        gcc_ideregistro: this.props.comId
      }
  
      axios.post(URL_GEN_COM+RUTAS_API.GEN_COMISION.NOVEDADES_CARTERA_MODIFICAR, data)
        .then(() => this.obtenerNovedades())
        .catch((error) => console.log(error));
    }
  }

  eliminarNovedad = (evento, index) => {
    evento.preventDefault();

    if (this.props.tipo === "recaudo") {
      const data = {
        gcrn_ideregistro: this.state.novedades[index].gcrn_ideregistro
      }

      console.log(data);
  
      axios.post(URL_GEN_COM+RUTAS_API.GEN_COMISION.NOVEDADES_REC_ELIMINAR, data)
        .then(() => this.obtenerNovedades())
        .catch((error) => console.log(error));
    } else {
      const data = {
        gccn_ideregistro: this.state.novedades[index].gccn_ideregistro
      }
  
      axios.post(URL_GEN_COM+RUTAS_API.GEN_COMISION.NOVEDADES_CARTERA_ELIMINAR, data)
        .then(() => this.obtenerNovedades())
        .catch((error) => console.log(error));
    }
  }

  render() {
    const { index, controlarModal, nov_tipos } = this.props;
    const { novedades, nuevaNovedad, modalCrear } = this.state;

    return (
      <Fragment>
        <div className="modal-header">
          <h5 className="modal-title">Novedades</h5>
        </div>
        <div className="modal-body">
          {novedades.length > 0 ? 
          <table className='table'>
            <thead>
              <tr>
                <th scope="col">Tipo</th>
                <th scope="col">Archivos</th>
                <th scope="col">Observaciones</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {novedades.map((novedad, jindex) =>
              <tr key={`novedad-${jindex}`}>
                <td>
                  <select
                    className="form-control"
                    value={this.props.tipo === "recaudo" ?
                      novedad.gcrn_tiponovedad !== null ? novedad.gcrn_tiponovedad : nov_tipos[0].tipo :
                      novedad.gccn_tiponovedad !== null ? novedad.gccn_tiponovedad : nov_tipos[0].tipo}
                    onChange={evento => this.actualizarTipo(evento, jindex)}>
                    {nov_tipos.map((tipo, kindex) =>
                      <option
                        key={`tipo-${kindex}`}
                        value={tipo.uni_ideregistro}>{tipo.uni_nombre1}</option>
                    )}
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => this.controlarModalArchivos(jindex)}>
                    Mostrar</button>
                  <Modal
                    visible={novedad.modalArchivos}
                    onClickBackdrop={() => this.controlarModalArchivos(jindex)}>
                    <RGenComArchivos
                      novId={this.props.tipo === "recaudo" ?
                        novedad.gcrn_ideregistro :
                        novedad.gccn_ideregistro}
                      index={jindex}
                      archivos={this.props.tipo === "recaudo" ?
                        novedad.ar_archcarecaudo :
                        novedad.ac_archcartera}
                      controlarModal={this.controlarModalArchivos}
                      obtenerNovedades={this.obtenerNovedades}
                      tipo={this.props.tipo}/>
                  </Modal>  
                </td>
                <td>
                  <textarea
                    className="form-control"
                    value={this.props.tipo === "recaudo" ?
                      novedad.gcrn_observacion :
                      novedad.gccn_observacion}
                    onChange={evento => this.cambiarObserv(evento, jindex)}>
                  </textarea>
                </td>
                <td>
                  <button
                    onClick={evento => this.editarNovedad(evento, jindex)}
                    className="btn btn-primary mr-2">Editar</button>
                  <button
                    onClick={evento => this.eliminarNovedad(evento, jindex)}
                    className="btn btn-primary">Eliminar</button>
                </td>
              </tr>)}
            </tbody>
          </table> :
          "No hay novedades para esta entrada"}
          <div>
            <button
              className="btn btn-primary"
              onClick={this.controlarModalCrear}>+</button>
              <Modal
                visible={modalCrear}
                onClickBackdrop={this.controlarModalCrear}>
                <div className="modal-header">
                  <h5 className="modal-title">Nueva Novedad</h5>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="tipo-label">Tipo</label>
                    <select
                      id="tipo-label"
                      className="form-control"
                      value={nuevaNovedad.tipo}
                      onChange={evento => {
                        const nuevaNovedad = this.state.nuevaNovedad;
                        nuevaNovedad.tipo = Number(evento.target.value);

                        this.setState({ nuevaNovedad });
                      }}>
                      {nov_tipos.map((tipo, kindex) =>
                        <option
                          key={`tipoCrear-${kindex}`}
                          value={tipo.uni_ideregistro}>{tipo.uni_nombre1}</option>
                      )}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="observ-label">Observaciones</label>
                    <textarea
                      id="observ-label"
                      className="form-control"
                      value={nuevaNovedad.observ}
                      onChange={evento => {
                        evento.preventDefault();
                        const nuevaNovedad = this.state.nuevaNovedad;
                        nuevaNovedad.observ = evento.target.value;

                        this.setState({ nuevaNovedad });
                      }}>
                    </textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.crearNovedad}>
                    Crear</button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={this.controlarModalCrear}>
                    Cerrar</button>
                </div>
              </Modal>  
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => controlarModal(
              index, 'mostrarModalNovedades')}>
            Cerrar</button>
        </div>
      </Fragment>
    );
  }
}

GenComNovedades.propTypes = {
  comId: PropTypes.number,
  index: PropTypes.number,
  controlarModal: PropTypes.func,
  tipo: PropTypes.string,
  nov_tipos: PropTypes.array
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GenComNovedades);

export { VistaRedux as RGenComNovedades };