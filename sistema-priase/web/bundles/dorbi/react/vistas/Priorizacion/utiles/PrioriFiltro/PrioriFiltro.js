import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import './PrioriFiltro.scss';

class PrioriFiltro extends Component{
  state = {
    filtro: '',
    resultado: [],
    mostrarBorrar: false,
  }

  actualizarFiltro = (evento) => {
    const { lista, llave, actualizarLista } = this.props;

    evento.preventDefault();
    
    const nuevoFiltro = evento.target.value;

    if (nuevoFiltro == '') this.setState({ mostrarBorrar: false });
    else this.setState({ mostrarBorrar: true });

    const nuevoResultado = lista.filter((dato) =>
      dato[llave].toUpperCase().includes(nuevoFiltro.toUpperCase()));

    actualizarLista(nuevoResultado);
    
    this.setState({ filtro: nuevoFiltro });
  }

  borrarFiltro = (evento) => {
    evento.preventDefault();
    this.setState({ filtro: '', mostrarBorrar: false });
    this.actualizarFiltro(evento);
  }

  render() {
    const { filtro, mostrarBorrar } = this.state;
    return (
      <Fragment>
        <div className="input-group">
          <input
            value={filtro}
            onChange={this.actualizarFiltro}
            placeholder={`Filtrar por ${this.props.tipoFiltro}...`}
            name="filtro"
            className="form-control"/>
          {mostrarBorrar && <div className="input-group-prepend">
            <button className="btn" onClick={this.borrarFiltro}>X</button>
          </div>}
        </div>
      </Fragment>
    );
  }
}

PrioriFiltro.propTypes = {
  tipoFiltro: PropTypes.string,
  llave: PropTypes.string,
  lista: PropTypes.array,
  actualizarLista: PropTypes.func
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(PrioriFiltro);

export { VistaRedux as RPrioriFiltro };