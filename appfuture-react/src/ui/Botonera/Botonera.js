import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Util} from '../../util/Util';

import './Botonera.scss';

class Botonera extends Component {
  
  renderBotones = () => {
    return this.props.funciones.map(btn => {
      return (
        <button
          key={Util.generarIdControl('btn')}
          type='button'
          className={`btn primary ${btn.className || ''}`}
          onClick={btn.callback}
          title={btn.title || null}>
          {btn.texto}
        </button>
      );
    });
  };
  
  render() {
    return (
      <div className={`container d-flex justify-content-center pt-3 botonera btn-group ${this.props.className}`} role='group' aria-label='Basic example'>
        {this.renderBotones()}
      </div>
    );
  }
  
}

Botonera.propTypes = {
  funciones: PropTypes.array,
  className: PropTypes.string
};

Botonera.defaultProps = {
  className: ''
};

export default Botonera;
