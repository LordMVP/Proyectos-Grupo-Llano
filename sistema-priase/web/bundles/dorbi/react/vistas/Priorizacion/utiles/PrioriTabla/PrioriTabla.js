import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import ReactPaginate from 'react-paginate';

import { RPrioriFiltro } from '../PrioriFiltro/PrioriFiltro';
import './PrioriTabla.scss';

class PrioriTabla extends Component {
  state = {
    lista: [],
    listaFiltrada: [],
    filas: [],
    offset: 0,
    perPage: 10,
    currentPage: 0,
    pageCount: 0
  }

  /**
   * Método encargado de cargar la lista en la tabla cuando se monte el componente
   */
  componentDidMount() {
    this.obtenerListas();
  }

  /**
   * Método encargado de consultar las variables de priorización de conceptos
   */
  obtenerListas = () => {
    const { datos } = this.props;
    console.log(datos);
    this.setState({ lista: datos, listaFiltrada: datos },
      () => this.renderizarPaginas());
  }

  /**
   * Método encargado de controlar el cambio del valor de la prioridad del concepto.
   */
  controlarCambioPrioridad = (evento, dato) => {
    evento.preventDefault();

    const { id, priori } = this.props;

    const lista = [...this.state.lista];
    const index = lista.findIndex(d => d[id] == dato[id]);
    lista[index][priori] = evento.target.value;

    this.setState({ lista }, () => this.renderizarPaginas());
  }

  /**
   * Método encargado de controlar el cambio de página.
   */
  controlarClickAPagina = (evento) => {
    const currentPage = evento.selected;
    const offset = currentPage * this.state.perPage;

    this.setState({ currentPage, offset },
      () => this.renderizarPaginas());
  }

  /*
   * Método encargado de actualizar el valor de la prioridad del concepto en base de datos.
   */
  actualizarPrioridad = (dato) => this.props.actualizarPrioridad(dato);

  /**
   * Método encargado de actualizar el valor de máximo número de filas por página en la tabla.
   */
  actualizarNumeroDeFilas = (evento) => {
    evento.preventDefault();

    const perPage = Number(evento.target.value);
    const currentPage = 0;
    const offset = 0;

    this.setState({ perPage, currentPage, offset },
      () => this.renderizarPaginas());
  }

  /**
   * Método encargado de actualizar el la tabla filtrada.
   */
  actualizarLista = (listaFiltrada) => {
    const currentPage = 0;
    const offset = 0;

    this.setState({ listaFiltrada, currentPage, offset },
      () => this.renderizarPaginas());
  }

  /**
   * Método encargado de renderizar las filas de la tabla.
   */
  renderizarPaginas = () => {
    const { cabeceras, priori } = this.props

    const data = this.state.listaFiltrada;
    const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage);
    
    const filas = slice.map((dato, index) => (
      <tr key={`priori-${index}`}>
        {cabeceras.map((cabecera, index) =>
          <td  key={`${cabecera.llave}-${index}`}>{dato[cabecera.llave]}</td>
        )}
        <td>
          <input
            value={dato[priori] != null ? dato[priori] : 0}
            type="number"
            min={0}
            onChange={(evento) => this.controlarCambioPrioridad(evento, dato)}
            name="pagpriori"
            className="form-control"/>
          {dato[priori] == null && <span>El valor es (null)</span>}
        </td>
        <td>
          <button className="btn btn-primary" onClick={(evento) => {
            evento.preventDefault();
            this.actualizarPrioridad(dato);
          }}>
            Actualizar</button>
        </td>
      </tr>
    ));

    const pageCount = Math.ceil(data.length / this.state.perPage);

    this.setState({ pageCount, filas });
  }

  /**
   * Método encargado de renderizar la tabla.
   */
  render() {
    const { filas, pageCount, perPage, lista } = this.state;
    const { cabeceras } = this.props;

    return (
      <Fragment>
        <RPrioriFiltro
          tipoFiltro={cabeceras[0].titulo.toLowerCase()}
          llave={cabeceras[0].llave}
          lista={lista}
          actualizarLista={this.actualizarLista}/>
        <table className='table mt-8'>
          <thead>
            <tr>
              {cabeceras.map((cabecera, index) =>
                <th key={`titulo-${index}`} scope="col">{cabecera.titulo}</th>
              )}
              <th scope="col">Prioridad</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filas}
          </tbody>
        </table>
        <div className="form-row align-items-center">
          <div className="col-auto">
            <ReactPaginate
              previousLabel={"Anterior"}
              nextLabel={"Siguiente"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.controlarClickAPagina}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}/>
          </div>
          <div className="col-auto">
            <select
              className="form-control"
              value={perPage}
              onChange={this.actualizarNumeroDeFilas}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </Fragment>
    );
  }
}

PrioriTabla.propTypes = {
  datos: PropTypes.array,
  cabeceras: PropTypes.array,
  priori: PropTypes.string,
  id: PropTypes.string,
  actualizarPrioridad: PropTypes.func
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(PrioriTabla);

export { VistaRedux as RPrioriTabla };