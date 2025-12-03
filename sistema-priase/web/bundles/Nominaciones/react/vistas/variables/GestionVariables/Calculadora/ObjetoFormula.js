import React, { Component } from 'react';
import './ObjetoFormula.scss';

class ObjetoFormula extends Component {

  obtenerEstiloPorTipo = () => {
    switch (this.props.tipo) {
      case 'con':
        return 'obj-formula__variable';
      case 'fun':
        return 'obj-formula__funcion';
      case 'op':
        return 'obj-formula__operador';
      case 'parAbre':
      case 'parCierra':
        return 'obj-formula__parentesis';
      case 'valor':
      default:
        return 'obj-formula__valor';
    }
  };

  borrarElemento = () => {
    this.props.onBorrarElemento(this.props.posicion);
  }

  render() {
    const estilo = `obj-formula ${this.obtenerEstiloPorTipo()}`;
    return (
      <div className={estilo}>
        <span>
          {this.props.valor}
          {this.props.tipo === 'fun' && '()'}
        </span>
        <button onClick={this.borrarElemento} className='obj-formula__eliminar-btn'>
          <span>x</span>
        </button>
      </div>
    );
  }
}

export default ObjetoFormula;
