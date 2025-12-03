import React, { Component } from 'react';

class VistaNoPermitida extends Component {

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <div>
        <h2 className="text-center">Acceso no autorizado</h2>
        <p className="text-center">No tiene acceso a este programa.</p>
      </div>
    );
  }

}

export { VistaNoPermitida };
