import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Util } from 'appfuture-react'
import Modal from 'react-bootstrap4-modal';
import { get as getProp } from 'object-path';
import './SelectorMultiple.scss';

class SelectorMultiple extends Component {

  state = {
    mostrarModal: false,
  };

  abrirCerrarModal = (estado) => {
    this.setState({
      mostrarModal: estado
    });
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
    const lista = Util.validarArreglo(this.props.lista) ? this.props.lista : [];
    const texto = '';
    const seleccionados = lista.reduce((total, registro) => { return total + (registro.seleccionado ? 1 : 0) }, 0);
    const placeholder = `(${seleccionados}) Seleccionados`;
    return (
      <div className={`col-${this.props.cols ? this.props.cols : '3'} form-group`}>
        <label>{this.props.titulo}</label>
        <div className="input-group mb-3">
          <input value={texto} disabled={true} type="text" className="form-control" placeholder={placeholder} />
          <div className="input-group-prepend">
            <button
              className="btn-primary btn-buscador input-group-btn"
              title={`Seleccionar ` + this.props.titulo}
              disabled={this.props.extra && this.props.extra.disabled || this.props.disabled}
              onClick={() => this.abrirCerrarModal(true)}><i className='fa fa-fw fa-check-square-o'></i></button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renderizará el componente modal del selector.
   * @return {Component}
   */
  renderModalSelector = () => {
    const lista = Util.validarArreglo(this.props.lista) ? this.props.lista : [];
    return (
      <Modal visible={this.state.mostrarModal}>
        <div className="modal-header">
          <h4 className="modal-title"><b>{this.props.titulo}</b></h4>
        </div>
        <div className="modal-body selector-multiple">
          <div>
            <p>{this.props.tituloPersonalizado ? this.props.tituloPersonalizado : ('Seleccione los ' + this.props.titulo)}</p>
            <div className='list-content'>
              {
                lista.map(registro => {
                  return (
                    <div key={`item_selector_${getProp(registro, this.props.propValor, null)}`}>
                      <label className='visible label-selector'>
                        <input type="checkbox" value={getProp(registro, this.props.propValor, null)} checked={registro.seleccionado || false} onChange={this.seleccionarItem} />
                        <span> {getProp(registro, this.props.propTexto, 'No definido')}</span>
                      </label>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className='btn btn-primary' onClick={() => { this.abrirCerrarModal(false) }}>Aceptar</button>
        </div>
      </Modal>
    );
  };

  seleccionarItem = (event) => {
    if (typeof this.props.seleccionarItem != 'function') {
      return;
    }
    this.props.seleccionarItem(event);
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

SelectorMultiple.propTypes = {
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

export { SelectorMultiple };
