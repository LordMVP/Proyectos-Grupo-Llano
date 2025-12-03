import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Util } from '../../util/Util';

import './Boton.scss';

class Boton extends Component {
  state = { _id: this.props.id || Util.generarIdControl('btn') };

  onClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event.nativeEvent);
    }
  };

  render() {
    const { texto, cols, ...extra } = this.props;
    const id = this.state._id;

    return (
      <div className={`col-${cols}`}>
        <button id={id} className={`boton btn ${this.props.estilo}`} onClick={this.onClick} {...extra}>
          {this.props.children || texto || id}
        </button>
      </div>
    );
  }

}

Boton.propTypes = {
  id: PropTypes.string,
  estilo: PropTypes.string,
  onClick: PropTypes.func,
  texto: PropTypes.string,
  cols: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Boton.defaultProps = {
  cols: 4,
  estilo: 'primary'
};

export default Boton;
