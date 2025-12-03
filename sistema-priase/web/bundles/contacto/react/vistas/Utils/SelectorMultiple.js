import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';

class SelectorMultiple extends Component {

  state = {
    mostrarModal: false,
    idUnidad: this.props.idUnidad,
    nombreDato: this.props.nombreDato
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
    const texto = '';
    const seleccionados = this.props.lista.reduce((total, registro) => { return total + (registro.seleccionado ? 1 : 0) }, 0);
    const placeholder = `(${seleccionados}) Seleccionados`;
    return (
      <div className={`col-${(this.props.cols) ? this.props.cols : '4'} form-group`}>
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
            {
              this.props.lista.map(registro => {
                return (
                  <div key={`item_selector_${registro[this.props.propValor]}`}>
                    <label>
                      <input type="checkbox" value={registro[this.props.propValor]} checked={registro.seleccionado || false} onChange={this.seleccionarItem} />
                      <span> {registro[this.props.propTexto]}</span>
                    </label>
                  </div>
                );
              })
            }
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
    this.props.seleccionarItem(event, this.state.nombreDato, this.state.idUnidad);
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
  cols: PropTypes.string,
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
