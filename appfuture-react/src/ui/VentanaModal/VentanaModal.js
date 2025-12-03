import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Util} from '../../util/Util';
import './VentanaModal.scss';
import Modal from 'react-modal';

Modal.setAppElement('#root');

class VentanaModal extends Component {
  afterOpenModal = () => {
    // TODO: Implementar
    return true;
  };
  
  cerrarModal = (evento) => {
    this.props.cerrarModal();
  };
  
  render() {
    return (
      <Modal
        isOpen={this.props.mostrar}
        onAfterOpen={this.afterOpenModal}
        className={this.props.className}>

        <div className='modal__fondo'>
          <h3 className='modal__titulo'>
            <span>{this.props.titulo}</span>
            <a
            title='Cerrar Modal'
            className='modal__linkcerrar'
            onClick={this.cerrarModal}>

            X
            </a>
          </h3>

          <div className='modal__contenido'>{this.props.children}</div>
        </div>
      </Modal>
    );
  }
}

VentanaModal.propTypes = {
  id: PropTypes.string,
  titulo: PropTypes.string,
  className: PropTypes.string,
  mostrar: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  cerrarModal: PropTypes.func.isRequired
};

VentanaModal.defaultProps = {
  className: '',
  mostrar: false
};

export default VentanaModal;
