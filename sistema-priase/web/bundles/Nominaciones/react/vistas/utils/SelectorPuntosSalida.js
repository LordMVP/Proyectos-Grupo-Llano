import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Util } from 'appfuture-react';
import { Combo, Input, TextoNumerico } from 'appfuture-react';
import Modal from 'react-bootstrap4-modal';
import { get as getProp } from 'object-path';

class SelectorPuntosSalida extends Component {

  state = {
    mostrarModal: false,
    puntosSalidaTemp: [],
    puntosSalida: [],
  };

  /**
   * Controla el cambio de estado de la propiedad mostrarModal que se usa para mostrar o ocultar el modal de selección.
   */
  abrirCerrarModal = (estado) => {
    if (!this.props.unidadMedida && this.props.unidadMedida == '' || this.props.unidadMedida == '-1') {
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
  confirmarSeleccionPuntosSalida = (estado) => {
    const v = this.validarSeleccion();
    if (v) {
      this.props.seleccionarItem(this.state.puntosSalida);
    }
    this.abrirCerrarModal(estado);
  };

  /**
   * Valida la selección de los puntos de salida y sus campos respectivos.
   * @return {boolean}
   */
  validarSeleccion = () => {
    let respuesta = 0;
    this.state.puntosSalida.forEach(puntoSalida => {
      //Verificamos si el puntoSalida seleccionado tiene cargo seleccionado.
      if (!this.verificarCamposSeleccion(puntoSalida)) {
        respuesta--;
      }
    });
    return respuesta === 0;
  };

  /**
   * Verifica que el usuario haya seleccionado correctamente los campos correspondientes a los puntos de salida que ha configurado.
   * @return {boolean}
   */
  verificarCamposSeleccion = (puntoSalida) => {
    if (!puntoSalida.seleccionado) {
      return true;
    }
    let respuesta = true;
    if (!puntoSalida.cntsCantidadcontratada || puntoSalida.cntsCantidadcontratada < 0) {
      this.props.mostrarAlerta('Error', 'Debe ingresar una cantidad contratada para el punto de salida: "' + puntoSalida[this.props.propTexto] + '".');
      respuesta = false;
    }
    if (!puntoSalida.uniIdemedidacantidad || puntoSalida.uniIdemedidacantidad < 0) {
      this.props.mostrarAlerta('Error', 'Debe seleccionar una unidad de medida para el punto de salida: "' + puntoSalida[this.props.propTexto] + '".');
      respuesta = false;
    }
    if (this.props.tipoContrato == 'C') {
      if (!puntoSalida.cntsPresionentrada || puntoSalida.cntsPresionentrada < 0) {
        this.props.mostrarAlerta('Error', 'Debe seleccionar una cantidad para la presión minima del transportador del punto: "' + puntoSalida[this.props.propTexto] + '".');
        respuesta = false;
      }
      if (!puntoSalida.uniIdmedidapresion || puntoSalida.uniIdmedidapresion < 0) {
        this.props.mostrarAlerta('Error', 'Debe seleccionar una unidad de medida para la presión minima del punto: "' + puntoSalida[this.props.propTexto] + '".');
        respuesta = false;
      }
    }
    return respuesta;
  };

  /**
   * Elimina la selección de un punto de salida especifico.
   */
  quitarSeleccionItem = (puntoSalida) => {
    const puntosSalida = this.state.puntosSalida.map(ps => {
      if (ps.idPuntoSalida === puntoSalida.idPuntoSalida) {
        ps.seleccionado = false;
      }
      return ps;
    });
    this.setState({ puntosSalida: puntosSalida, mostrarModal: true });
  };

  componentDidMount() {
    this.setState({ puntosSalida: this.obtenerListaPuntosSalida(), puntosSalidaTemp: this.obtenerListaPuntosSalida() });
  };

  /**
   * Devuelve la lista de puntos de salida Actualizada con algunos valores necesarios para que el componente funcione correctamente.
   * @return {array}
   */
  obtenerListaPuntosSalida = () => {
    const lista = this.props.lista.map(puntoSalida => {
      puntoSalida.idPuntoSalida = Util.generarIdControl('_idPuntoSalida_' + puntoSalida[this.props.propValor]);
      puntoSalida.cntsCantidadcontratada = puntoSalida.cntsCantidadcontratada ? puntoSalida.cntsCantidadcontratada : puntoSalida.pstaCapacidad;
      puntoSalida.uniIdemedidacantidad = (puntoSalida.uniIdemedida.uniIderegistro) ? puntoSalida.uniIdemedida.uniIderegistro : puntoSalida.uniIdemedidacantidad
      return puntoSalida;
    });
    return lista;
  };

  actualizarPuntosSalida = () => {
    this.setState({ puntosSalida: this.obtenerListaPuntosSalida() });
  };

  /**
   * Rendierizará el componente selector.
   * @return {Component}
   */
  renderSelector = () => {
    const texto = '';
    const seleccionados = this.state.puntosSalida.reduce((total, registro) => { return total + (registro.seleccionado ? 1 : 0) }, 0);
    const placeholder = `(${seleccionados}) Seleccionados`;
    return (
      <div className='col-3 form-group'>
        <label>{this.props.titulo}</label>
        <div className="input-group mb-3">
          <input value={texto} disabled={true} type="text" className="form-control" placeholder={placeholder} />
          <div className="input-group-prepend">
            <button
              className="btn-primary btn-buscador input-group-btn"
              title={`Seleccionar ` + this.props.titulo}
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
    let { puntosSalida, puntosSalidaTemp } = this.state;

    puntosSalida = puntosSalida.map(registro => {
      const puntoSalida = { ...registro };
      return puntoSalida;
    });

    const control = evento.target;
    const idPuntoSalida = control.attributes['data-idpuntosalida'].value;
    const index = puntosSalida.findIndex(ps => ps[this.props.propValor] == idPuntoSalida);
    const indexTemp = puntosSalidaTemp.findIndex(ps => ps[this.props.propValor] == idPuntoSalida);
    if (indexTemp < 0 || index < 0) {
      return;
    }
    puntosSalida[index].seleccionado = ((evento.target.name !== 'check_idpuntosalida')) ? true : evento.target.checked;
    if ((evento.target.name !== 'check_idpuntosalida')) {
      if (evento.target.name == 'cntsCantidadcontratada') {
        if (puntosSalidaTemp[index].pstaCapacidad < control.value && control.value >= 0) {
          return;
        }
      } else {
        puntosSalida[index][evento.target.name] = evento.target.value;
      }
    }
    puntosSalida[index][evento.target.name] = evento.target.value;
    this.setState({ puntosSalida: puntosSalida });
  };

  /**
   * Renderizará el componente modal del selector.
   * @return {Component}
   */
  renderModalSelector = () => {
    const listaPuntosSalida = this.state.puntosSalida;
    return (
      <Modal
        visible={this.state.mostrarModal}
        dialogClassName='modal-lg'>
        <div className="modal-header">
          <h4 className="modal-title"><b>{this.props.titulo}</b></h4>
        </div>
        <div className="modal-body">
          <div>
            <p>Seleccione los {this.props.titulo}</p>
            <table className='table table-hover table-striped table-bordered label-nodisplay'>
              <thead className='bg-dark text-white'>
                <tr><th>Punto Salida</th><th>C.Contratada</th><th>Unidad Medida</th><th>Presion minima del transportador</th><th>Unidad Medida de Presion</th></tr>
              </thead>
              <tbody>
                {
                  listaPuntosSalida.map(registro => {
                    return (
                      <tr key={`item_selector_${registro[this.props.propValor]}`}>
                        <td className='text-left' style={{ width: '40%' }}>
                          <label className='text-left display'>
                            <input name='check_idpuntosalida' key={Util.generarIdControl('_check_' + registro[this.props.propValor])} data-idpuntosalida={registro[this.props.propValor]} type="checkbox" checked={registro.seleccionado || false} onChange={this.controlarCambio} />
                            <span> {registro[this.props.propTexto]}</span>
                          </label>
                        </td>
                        <td>
                          <TextoNumerico
                            aceptaDecimales={true}
                            aceptaNegativos={false}
                            cols={12}
                            value={(registro.cntsCantidadcontratada)}
                            onChange={this.controlarCambio}
                            name='cntsCantidadcontratada'
                            extra={{ 'data-idpuntosalida': registro[this.props.propValor] }}
                          />
                        </td>
                        <td>
                          <Combo
                            opciones={this.props.unidadesMedida}
                            propTexto='uniNombre1'
                            propValor='uniIderegistro'
                            name='uniIdemedidacantidad'
                            cols={12}
                            value={registro.uniIdemedidacantidad}
                            onChange={this.controlarCambio}
                            extra={{ 'data-idpuntosalida': registro[this.props.propValor] }}
                          />
                        </td>
                        <td>
                          <TextoNumerico
                            aceptaDecimales={false}
                            aceptaNegativos={false}
                            cols={12}
                            value={registro.cntsPresionentrada}
                            onChange={this.controlarCambio}
                            name='cntsPresionentrada'
                            extra={{ 'data-idpuntosalida': registro[this.props.propValor] }}
                          />
                        </td>
                        <td>
                          <Combo
                            opciones={this.props.unidadesMedidaPresion}
                            propTexto='uniNombre1'
                            propValor='uniIderegistro'
                            name='uniIdmedidapresion'
                            cols={12}
                            value={registro.uniIdmedidapresion}
                            onChange={this.controlarCambio}
                            extra={{ 'data-idpuntosalida': registro[this.props.propValor] }}
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
          <button className='btn btn-primary' onClick={() => { this.confirmarSeleccionPuntosSalida(false) }}>Aceptar</button>
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

SelectorPuntosSalida.propTypes = {
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

export { SelectorPuntosSalida };
