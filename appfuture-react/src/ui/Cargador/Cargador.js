import React, {Component} from 'react';
import PropTypes from 'prop-types';
import estilos from './Cargador.scss';

class Cargador extends Component {

  renderCortina = () => {
    if (this.props.background) {
      return null;
    }

    return (
      <div className='cargador__cortina' />
    );
  };

  render() {
    if (!this.props.visible) {
      return null;
    }

    return (
      <div className='cargador'>
        <div className='cargador__texto'>
          <span>Cargando...</span>
        </div>
        {this.renderCortina()}
      </div>
    );
  }

}

Cargador.propTypes = {
  visible: PropTypes.bool,
  background: PropTypes.bool
};

Cargador.defaultProps = {
  visible: false,
  background: false
};

export default Cargador;
