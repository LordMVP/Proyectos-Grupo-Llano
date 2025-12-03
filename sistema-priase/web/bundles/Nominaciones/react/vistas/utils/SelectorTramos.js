import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Util } from 'appfuture-react';
import Modal from 'react-bootstrap4-modal';
import { get as getProp } from 'object-path';

class SelectorTramos extends Component {

  state = {
    mostrarModal: false,
    listaTramos: [],
  };

  abrirCerrarModal = (estado) => {
    this.setState({
      mostrarModal: estado
    });
  };

  confirmarSeleccionTramos = (estado) => {
    if (this.validarSeleccion()) {
      this.abrirCerrarModal(estado);
      this.props.seleccionarItem(this.props.lista);
    }
  };

  cancelar = () => {
    this.abrirCerrarModal(false);
  }

  validarSeleccion = () => {
    let respuesta = 0;
    this.props.lista.forEach(tramo => {
      //Verificamos si el tramo seleccionado tiene cargo seleccionado.
      if (!this.verificarSeleccionCargo(tramo)) {
        this.props.mostrarAlerta('Cargo no seleccionado', 'El cargo del tramo "' + tramo[this.props.propTexto] + '" no ha sido seleccionado.');
        respuesta++;
      }
    });
    return respuesta == 0;
  };

  verificarSeleccionCargo = (tramo) => {
    if (!tramo.seleccionado) {
      return true;
    }
    let respuesta = false;
    tramo.listaCargos.forEach(cargo => {
      if (cargo.seleccionado) {
        respuesta = true;
      }
    });
    return respuesta;
  };

  componentDidMount() {
    this.setState({ listaTramos: this.props.lista });
  };

  cargarDatos = (entidad) => {
    this.setState({
      mostrarModalConsulta: false,
      // Cargar datos de la entidad
      // ...
    });
  };

  /**
   * Rendierizará el componente selector.
   * @return {Component}
   */
  renderSelector = () => {
    const estadoContrato = getProp(this.props, 'estadoContrato', '');
    let desabilitarE = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitarE = true;
    }
    const texto = '';
    const seleccionados = this.props.lista.reduce((total, registro) => { return total + (registro.seleccionado ? 1 : 0) }, 0);
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
              disabled={(desabilitarE)}
              onClick={() => this.abrirCerrarModal(true)}><i className='fa fa-fw fa-check-square-o'></i></button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renderiza el select de los cargos de un tramo.
   * @return {Comment}
   */
  renderSelectCargos = (tramo) => {
    return (
      <select
        key={Util.generarIdControl('_idCargo_' + tramo.trmIderegistro)}
        className='form-control form-control-sm'
        name='cargoTramo'
        onChange={this.seleccionarTramo}
        data-idtramo={tramo.trmIderegistro}
      >
        <option value='' key={Util.generarIdControl('option' + tramo.trmIderegistro)}>Seleccione una opción</option>
        {
          tramo.listaCargos.map(cargo => {
            const label = `C.V: ${cargo.trcaCargovariable}, C.F: ${cargo.trcaCargofijo}, C AO&M: ${cargo.trcaCargoaoym}`;
            return (
              <Fragment>
                {(cargo.seleccionado) && (<option key={Util.generarIdControl('option' + tramo.trmIderegistro)} value={cargo.trcaIderegistro} selected='true'>{label}</option>)}
                {(!cargo.seleccionado) && (<option key={Util.generarIdControl('option' + tramo.trmIderegistro)} value={cargo.trcaIderegistro} >{label}</option>)}
              </Fragment>
            );
          })
        }
      </select >
    )
  };

  seleccionarTramo = (evento) => {
    let tramos = [...this.props.lista];
    if (!Util.validarArreglo(tramos)) {
      tramos = [...this.props.lista];
    }
    let value = evento.target.value;
    if (evento.target.name == 'cargoTramo') {
      value = evento.target.attributes['data-idtramo'].value;
    }
    const idTramo = parseInt(value);
    const index = tramos.findIndex(t => t.trmIderegistro === idTramo);
    if (index == -1) {
      this.props.mostrarAlerta('El Tramo no es válido', 'Lo sentimos el tramo seleccionado no es válido.');
      return;
    }
    let listaCargos = tramos[index].listaCargos;
    if (!Array.isArray(listaCargos) || listaCargos.length == 0) {
      this.props.mostrarAlerta('No hay cargos', 'Lo sentimos el tramo seleccionado no tiene cargos configurados.');
      return;
    }
    tramos[index].seleccionado = ((evento.target.name === 'cargoTramo')) ? true : evento.target.checked;

    //Buscamos el cargo seleccionado para actualizar el estado...
    if (evento.target.name == 'cargoTramo') {
      const idCargo = evento.target.value;
      const listaCargosTemporal = listaCargos.map(cargo => {
        cargo.seleccionado = (cargo.trcaIderegistro == idCargo);
        return cargo;
      });
      tramos[index].listaCargos = listaCargos;
    }

    if (typeof this.props.seleccionarItem != 'function') {
      return;
    }
    this.setState({ listaTramos: tramos });
  };

  /**
   * Renderizará el componente modal del selector.
   * @return {Component}
   */
  renderModalSelector = () => {
    return (
      <Modal visible={this.state.mostrarModal}>
        <div className="modal-header">
          <h4 className="modal-title"><b>{this.props.titulo}</b></h4>
        </div>
        <div className="modal-body">
          <div>
            <p>Seleccione los {this.props.titulo}</p>
            <table className='table table-hover table-striped table-bordered table-condensed'>
              <thead className='bg-dark text-white'>
                <tr><th>Nombre Tramo</th><th>Cargo</th></tr>
              </thead>
              <tbody>
                {
                  this.props.lista.map(registro => {
                    if (Util.validarArreglo(registro.listaCargos)) {
                      return (
                        <tr key={`item_selector_${registro[this.props.propValor]}`}>
                          <td className='text-left'>
                            <label className='text-left'>
                              <input key={Util.generarIdControl('_check_' + registro.trmIderegistro)} type="checkbox" value={registro[this.props.propValor]} checked={registro.seleccionado || false} onChange={this.seleccionarTramo} />
                              <span> {registro[this.props.propTexto]}</span>
                            </label>
                          </td>
                          <td>
                            {this.renderSelectCargos(registro)}
                          </td>
                        </tr>
                      );
                    }
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className="modal-footer">
          <button className='btn btn-primary' onClick={() => { this.confirmarSeleccionTramos(false) }}>Aceptar</button>
          <button className='btn btn-primary' onClick={() => { this.cancelar(false) }}>Cancelar</button>
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

SelectorTramos.propTypes = {
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

export { SelectorTramos };
