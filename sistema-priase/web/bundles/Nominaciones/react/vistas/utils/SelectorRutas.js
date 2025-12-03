import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Util } from 'appfuture-react';
import { Combo, Input } from 'appfuture-react';
import Modal from 'react-bootstrap4-modal';
import { mostrarAlerta } from '../../store/actions/AplicacionAcciones';
import { get as getProp } from 'object-path';

class SelectorRutas extends Component {

  state = {
    mostrarModal: false,
    listaRutas: [],
  };

  /**
   * Controla el cambio de estado de la propiedad mostrarModal que se usa para mostrar o ocultar el modal de selección.
   */
  abrirCerrarModal = (estado) => {
    if (!this.props.unidadMedida && this.props.unidadMedida == '') {
      this.props.mostrarAlerta('Atención', 'Debe seleccionar una unidad de medida para la cantidad contratada');
      return;
    }
    this.setState({
      mostrarModal: estado
    });
  };

  /**
   * Confirma la selección de los puntos de salida, es decir invoca el método del componente padre para actualizar su lista de puntos de salida.
   */
  confirmarSeleccionListaRutas = (estado) => {
    this.abrirCerrarModal(estado);
    const v = this.validarSeleccion();
    if (v) {
      this.props.seleccionarItem(this.state.listaRutas);
    }
  };

  /**
   * Valida la selección de los puntos de salida y sus campos respectivos.
   * @return {boolean}
   */
  validarSeleccion = () => {
    let respuesta = 0;
    this.state.listaRutas.forEach(ruta => {
      //Verificamos si el ruta seleccionado tiene cargo seleccionado.
      if (!this.verificarCamposSeleccion(ruta)) {
        respuesta--;
      }
    });
    return respuesta === 0;
  };

  /**
   * Verifica que el usuario haya seleccionado correctamente los campos correspondientes a los puntos de salida que ha configurado.
   * @return {boolean}
   */
  verificarCamposSeleccion = (ruta) => {
    if (!ruta.seleccionado) {
      return true;
    }
    let respuesta = true;
    if (!ruta.cntuValor || ruta.cntuValor < 0) {
      this.props.mostrarAlerta('Error', 'Debe ingresar una cantidad contratada para el punto de salida: "' + ruta[this.props.propTexto] + '".');
      respuesta = false;
    }
    if (!ruta.uniIdemedida || ruta.uniIdemedida < 0) {
      this.props.mostrarAlerta('Error', 'Debe seleccionar una unidad de medida para el punto de salida: "' + ruta[this.props.propTexto] + '".');
      respuesta = false;
    }
    return respuesta;
  };

  /**
   * Elimina la selección de un punto de salida especifico.
   */
  quitarSeleccionItem = (ruta) => {
    const listaRutas = this.state.listaRutas.map(ps => {
      if (ps.idRuta === ruta.idRuta) {
        ps.seleccionado = false;
      }
      return ps;
    });
    this.setState({ listaRutas: listaRutas, mostrarModal: true });
  };

  componentDidMount() {
    this.setState({ listaRutas: this.obtenerListaListaRutas() });
  };

  /**
   * Devuelve la lista de puntos de salida Actualizada con algunos valores necesarios para que el componente funcione correctamente.
   * @return {array}
   */
  obtenerListaListaRutas = () => {
    // if (listaTipos.length > 0) {
    //   const lista = this.props.lista.filter(ruta => {
    //     const esConexion = (listaTipos.findIndex(tipoContrato => tipoContrato.uniPropiedad && tipoContrato.uniPropiedad.tipocontrato === 'CNX') >= 0);
    //     const esGNC = (listaTipos.findIndex(tipoContrato => tipoContrato.uniPropiedad && tipoContrato.uniPropiedad.tipocontrato === 'GNC') >= 0);
    //     if (esConexion && ruta.uniPropiedad && ruta.uniPropiedad.tipo === 'C') {
    //       return ruta;
    //     }
    //     if (esGNC && ruta.uniPropiedad && ruta.uniPropiedad.tipo === 'G') {
    //       return ruta;
    //     }
    //   }).map(ruta => {
    //     ruta.idRuta = Util.generarIdControl('_idRuta_' + ruta.uniIderegistro);
    //     ruta.cntuValor = ruta.cntuValor;
    //     ruta.unidadMedida = ruta.unidadMedida;
    //     return ruta;
    //   });
    //   return lista;
    // }
    const lista = this.props.lista.map(ruta => {
      ruta.idRuta = Util.generarIdControl('_idRuta_' + ruta.uniIderegistro);
      ruta.cntuValor = ruta.cntuValor;
      ruta.unidadMedida = ruta.unidadMedida;
      return ruta;
    });
    return lista;
  };

  actualizarListaRutas = () => {
    this.setState({ listaRutas: this.obtenerListaListaRutas() });
  };

  /**
   * Rendierizará el componente selector.
   * @return {Component}
   */
  renderSelector = () => {
    const texto = '';
    const seleccionados = this.state.listaRutas.reduce((total, registro) => { return total + (registro.seleccionado ? 1 : 0) }, 0);
    const placeholder = `(${seleccionados}) Seleccionados`;
    const estadoContrato = getProp(this.props, 'estadoContrato', '');
    let desabilitar = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitar = true;
    }
    return (
      <div className='col-3 form-group'>
        <label>{this.props.titulo}</label>
        <div className="input-group mb-3">
          <input value={texto} disabled={true} type="text" className="form-control" placeholder={placeholder} />
          <div className="input-group-prepend">
            <button
              className="btn-primary btn-buscador input-group-btn"
              title={`Seleccionar ` + this.props.titulo}
              disabled={desabilitar}
              onClick={() => this.abrirCerrarModal(true)}><i className='fa fa-fw fa-check-square-o'></i></button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Controla el cambio de los componentes...
   */
  controlarCambio = (evento) => {
    const listaRutas = [...this.state.listaRutas];
    const control = evento.target;
    const idRuta = control.attributes['data-idruta'].value;
    const index = listaRutas.findIndex(ps => ps.idRuta === idRuta);
    listaRutas[index].seleccionado = ((evento.target.name !== 'check_idruta')) ? true : evento.target.checked;
    if ((evento.target.name !== 'check_idruta')) {
      listaRutas[index][evento.target.name] = evento.target.value;
    }
    this.setState({ listaRutas: listaRutas });
  };

  /**
   * Renderizará el componente modal del selector.
   * @return {Component}
   */
  renderModalSelector = () => {
    const listaListaRutas = this.state.listaRutas;

    const tiposContratos = this.props.tiposContrato;
    const tiposContratosSeleccionados = tiposContratos.filter(tipoContrato => tipoContrato.seleccionado);
    const listaTipos = tiposContratosSeleccionados.filter(tc => tc.uniPropiedad && (tc.uniPropiedad.tipocontrato === 'CNX' || tc.uniPropiedad.tipocontrato === 'GNC'));

    return (
      <Modal visible={this.state.mostrarModal}>
        <div className="modal-header">
          <h4 className="modal-title"><b>{this.props.titulo}</b></h4>
        </div>
        <div className="modal-body">
          <div>
            <p>Seleccione los {this.props.titulo}</p>
            <table className='table table-hover table-striped table-bordered table-condensed label-nodisplay'>
              <thead className='bg-dark text-white'>
                <tr><th>Ruta</th><th>Valor</th><th>Unidad Medida</th></tr>
              </thead>
              <tbody>
                {
                  listaListaRutas.filter(ruta => {
                    const esConexion = (listaTipos.findIndex(tipoContrato => tipoContrato.uniPropiedad && tipoContrato.uniPropiedad.tipocontrato === 'CNX') >= 0);
                    const esGNC = (listaTipos.findIndex(tipoContrato => tipoContrato.uniPropiedad && tipoContrato.uniPropiedad.tipocontrato === 'GNC') >= 0);
                    if (esConexion && ruta.uniPropiedad && ruta.uniPropiedad.tipo === 'C') {
                      return ruta;
                    }
                    if (esGNC && ruta.uniPropiedad && ruta.uniPropiedad.tipo === 'G') {
                      return ruta;
                    }
                  }).map(registro => {
                    return (
                      <tr key={`item_selector_${registro[this.props.propValor]}`}>
                        <td className='text-left' style={{ width: '40%' }}>
                          <label className='text-left display'>
                            <input name='check_idruta' key={Util.generarIdControl('_check_' + registro[this.props.propValor])} data-idruta={registro.idRuta} type="checkbox" checked={registro.seleccionado || false} onChange={this.controlarCambio} />
                            <span> {registro[this.props.propTexto]}</span>
                          </label>
                        </td>
                        <td>
                          <Input
                            label=''
                            value={(registro.cntuValor) ? registro.cntuValor : ''}
                            onChange={this.controlarCambio}
                            name='cntuValor'
                            cols={12}
                            extra={{ 'data-idruta': registro.idRuta }}
                          />
                        </td>
                        <td>
                          <Combo
                            opciones={this.props.unidadesMedida}
                            propTexto='uniNombre1'
                            propValor='uniIderegistro'
                            label=''
                            name='uniIdemedida'
                            cols={12}
                            value={registro.uniIdemedida}
                            onChange={this.controlarCambio}
                            extra={{ 'data-idruta': registro.idRuta }}
                          />
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className="modal-footer">
          <button className='btn btn-primary' onClick={() => { this.confirmarSeleccionListaRutas(false) }}>Aceptar</button>
        </div>
      </Modal>
    );
  };

  render() {
    return (
      <Fragment>
        {this.renderSelector()}
        {this.renderModalSelector()}
      </Fragment>
    );
  }
}

SelectorRutas.propTypes = {
  history: PropTypes.object,
  mostrarAlerta: PropTypes.func,
  titulo: PropTypes.string,
  propValor: PropTypes.string,
  propTexto: PropTypes.string,
  seleccionarItem: PropTypes.func,
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    mostrarAlerta,
  }, dispatch);
};

export { SelectorRutas };
