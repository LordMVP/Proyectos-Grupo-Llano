import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Util } from 'appfuture-react';
import { Combo, Input } from 'appfuture-react';
import Modal from 'react-bootstrap4-modal';
import { get as getProp } from 'object-path';

class SelectorMedidores extends Component {

  state = {
    mostrarModal: false,
    medidores: [],
  };

  /**
   * Controla el cambio de estado de la propiedad mostrarModal que se usa para mostrar o ocultar el modal de selección.
   */
  abrirCerrarModal = (estado) => {
    this.setState({
      mostrarModal: estado
    });
  };

  /**
   * Confirma la selección de los puntos de salida, es decir invoca el método del componente padre para actualizar su lista de puntos de salida.
   */
  confirmarSeleccionMedidores = (estado) => {
    this.abrirCerrarModal(estado);
    const v = this.validarSeleccion();
    if (v) {
      this.props.seleccionarItem(this.state.medidores);
    }
  };

  /**
   * Valida la selección de los puntos de salida y sus campos respectivos.
   * @return {boolean}
   */
  validarSeleccion = () => {
    let respuesta = 0;
    this.state.medidores.forEach(medidor => {
      //Verificamos si el medidor seleccionado tiene cargo seleccionado.
      if (!this.verificarCamposSeleccion(medidor)) {
        respuesta--;
      }
    });
    return respuesta === 0;
  };

  /**
   * Verifica que el usuario haya seleccionado correctamente los campos correspondientes a los puntos de salida que ha configurado.
   * @return {boolean}
   */
  verificarCamposSeleccion = (medidor) => {
    if (!medidor.seleccionado) {
      return true;
    }
    let respuesta = true;
    if (!medidor.precioMedidor || medidor.precioMedidor < 0) {
      this.props.mostrarAlerta('Error', 'Debe ingresar una cantidad contratada para el punto de salida: "' + medidor[this.props.propTexto] + '".');
      respuesta = false;
    }
    if (!medidor.uniIdeMedidor || medidor.uniIdeMedidor < 0) {
      this.props.mostrarAlerta('Error', 'Debe seleccionar una unidad de medida para el punto de salida: "' + medidor[this.props.propTexto] + '".');
      respuesta = false;
    }
    return respuesta;
  };

  /**
   * Elimina la selección de un punto de salida especifico.
   */
  quitarSeleccionItem = (medidor) => {
    const medidores = this.state.medidores.map(ps => {
      if (ps.idMedidor === medidor.idMedidor) {
        ps.seleccionado = false;
      }
      return ps;
    });
    this.setState({ medidores: medidores, mostrarModal: true });
  };

  componentDidMount() {
    this.setState({ medidores: this.obtenerListaMedidores() });
  };

  /**
   * Devuelve la lista de puntos de salida Actualizada con algunos valores necesarios para que el componente funcione correctamente.
   * @return {array}
   */
  obtenerListaMedidores = () => {
    const lista = this.props.lista.map(medidor => {
      medidor.idMedidor = Util.generarIdControl('_idMedidor_' + medidor.mesuIderegistro);
      medidor.precioMedidor = medidor.precioMedidor ? medidor.precioMedidor : medidor.pstaCapacidad;
      medidor.uniIdeMedidor = medidor.uniIdeMedidor ? medidor.uniIdeMedidor : medidor.uniIdemedida.uniIderegistro;
      return medidor;
    });
    return lista;
  };

  actualizarPuntosSalida = () => {
    this.setState({ medidores: this.obtenerListaMedidores() });
  };

  /**
   * Rendierizará el componente selector.
   * @return {Component}
   */
  renderSelector = () => {
    const texto = '';
    const seleccionados = this.state.medidores.reduce((total, registro) => { return total + (registro.seleccionado ? 1 : 0) }, 0);
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
    const medidores = [...this.state.medidores];
    const control = evento.target;
    const idMedidor = control.attributes['data-idmedidor'].value;
    const index = medidores.findIndex(ps => ps.idMedidor === idMedidor);
    medidores[index].seleccionado = ((evento.target.name !== 'check_idmedidor')) ? true : evento.target.checked;
    if ((evento.target.name !== 'check_idmedidor')) {
      medidores[index][evento.target.name] = evento.target.value;
    }
    this.setState({ medidores: medidores });
  };

  /**
   * Renderizará el componente modal del selector.
   * @return {Component}
   */
  renderModalSelector = () => {
    const listaMedidores = this.state.medidores;
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
                <tr><th>Medidor</th><th>Precio</th><th>Unidad Medida</th></tr>
              </thead>
              <tbody>
                {
                  listaMedidores.map(registro => {
                    return (
                      <tr key={`item_selector_${registro[this.props.propValor]}`}>
                        <td className='text-left' style={{ width: '40%' }}>
                          <label className='text-left display'>
                            <input name='check_idmedidor' key={Util.generarIdControl('_check_' + registro.trmIderegistro)} data-idmedidor={registro.idMedidor} type="checkbox" checked={registro.seleccionado || false} onChange={this.controlarCambio} />
                            <span> {registro[this.props.propTexto]}</span>
                          </label>
                        </td>
                        <td>
                          <Input
                            label=''
                            value={(registro.precioMedidor) ? registro.precioMedidor : registro.pstaCapacidad}
                            onChange={this.controlarCambio}
                            name='precioMedidor'
                            cols={12}
                            extra={{ 'data-idmedidor': registro.idMedidor }}
                          />
                        </td>
                        <td>
                          <Combo
                            opciones={this.props.unidadesMedida}
                            propTexto='uniNombre1'
                            propValor='uniIderegistro'
                            label=''
                            name='uniIdeMedidor'
                            cols={12}
                            value={(registro.uniIdeMedidor) ? registro.uniIdeMedidor : registro.uniIdemedida.uniIderegistro}
                            onChange={this.controlarCambio}
                            extra={{ 'data-idmedidor': registro.idMedidor }}
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
          <button className='btn btn-primary' onClick={() => { this.confirmarSeleccionMedidores(false) }}>Aceptar</button>
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

SelectorMedidores.propTypes = {
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

export { SelectorMedidores };
