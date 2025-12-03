import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import './react-table.css';

class Tabla extends Component {

  render() {
    return (
      <ReactTable
        data={this.props.datos}
        columns={this.props.columnas}
        previousText='Anterior'
        nextText='Siguiente'
        loadingText='Cargando...'
        noDataText='No se encontraron registros'
        pageText='Pág.'
        ofText='de'
        rowsText='registros'
        minRows={0}
      />
    );
  }

}

Tabla.propTypes = {
  className: PropTypes.string,
  datos: PropTypes.array,
  columnas: PropTypes.array
};

Tabla.defaultProps = {
  className: '',
};

export default Tabla;
