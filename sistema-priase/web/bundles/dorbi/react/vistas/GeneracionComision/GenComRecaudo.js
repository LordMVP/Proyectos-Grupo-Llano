import React, { Component, Fragment } from "react";
import connect from "react-redux/es/connect/connect";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import Modal from "react-bootstrap4-modal";
import moment from "moment";
import axios from "axios";
import ReactPaginate from "react-paginate";

import RUTAS_API from "../../global/rutas_api";
import { PROGRAMAS, URL_GEN_COM } from "../../global/constantes";

import { RGenComNavbar } from "./utiles/GenComNavbar/GenComNavbar";
import { RGenComTercerosForm } from "./utiles/GenComTercerosForm/GenComTercerosForm";
import { RGenComFechas } from "./utiles/GenComFechas/GenComFechas";
import { RGenComImpuestos } from "./utiles/GenComImpuestos/GenComImpuestos";
import { RGenComNovedades } from "./utiles/GenComNovedades/GenComNovedades";

import "./GenCom.scss";

class GenComRecaudo extends Component {
  state = {
    consulta: {
      ter_ideregistro: undefined,
      uni_medpago: undefined,
      bcu_ideregistro: undefined,
      fecha_desde: "",
      fecha_hasta: "",
    },
    periodo: {
      ciclo: "",
      periodo: "",
    },
    comisiones: [],
    filas: [],
    offset: 0,
    perPage: 10,
    currentPage: 0,
    pageCount: 0,
    pageData: [],
    nov_tipos: [],
  };

  componentDidMount() {
    this.obtenerTipos();
    this.obtenerPeriodo();
  }

  /**
   * Método encargado de actualizar el valor de los terceros
   */
  modificarTercero = (ter_ideregistro, uni_ideregistro, bcu_ideregistro) => {
    const consulta = this.state.consulta;

    consulta.ter_ideregistro = ter_ideregistro;
    consulta.uni_medpago = uni_ideregistro;
    consulta.bcu_ideregistro = bcu_ideregistro;

    this.setState({ consulta });
  };

  /**
   * Método encargado de actualizar el valor de las fechas
   */
  modificarFechas = (fecha_desde, fecha_hasta) => {
    const consulta = this.state.consulta;

    consulta.fecha_desde = fecha_desde;
    consulta.fecha_hasta = fecha_hasta;

    this.setState({ consulta });
  };

  /**
   * Método encargado de consultar las comisiones
   */
  consultarComision = () => {
    const { consulta } = this.state;

    const ter_ideregistro = consulta.ter_ideregistro
      ? consulta.ter_ideregistro
      : 0;
    const uni_medpago = consulta.uni_medpago ? consulta.uni_medpago : 0;
    const bcu_ideregistro = consulta.bcu_ideregistro
      ? consulta.bcu_ideregistro
      : 0;
    const prc_vigencia_desde = consulta.fecha_desde;
    const prc_vigencia_hasta = consulta.fecha_hasta;
    const limit = 10000;

    const data = {
      ter_ideregistro,
      uni_medpago,
      bcu_ideregistro,
      prc_vigencia_desde,
      prc_vigencia_hasta,
    };

    axios
      .post(URL_GEN_COM + RUTAS_API.GEN_COMISION.RECAUDOS + "/consulta", data, {
        params: { limit },
      })
      .then((respuesta) =>
        this.setState({ comisiones: respuesta.data.datos }, () =>
          this.renderizarPaginas()
        )
      )
      .catch((error) => console.log(error));
  };

  /**
   * Método encargado de procesar las comisiones
   */
  procesarComision = () => {
    const { consulta, periodo } = this.state;

    const ter_ideregistro = consulta.ter_ideregistro
      ? consulta.ter_ideregistro
      : 0;
    const uni_medpago = consulta.uni_medpago ? consulta.uni_medpago : 0;
    const bcu_ideregistro = consulta.bcu_ideregistro
      ? consulta.bcu_ideregistro
      : 0;
    const prc_vigencia_desde = consulta.fecha_desde;
    const prc_vigencia_hasta = consulta.fecha_hasta;

    const data = {
      ter_ideregistro,
      uni_medpago,
      bcu_ideregistro,
      prc_vigencia_desde,
      prc_vigencia_hasta,
    };

    axios
      .post(
        URL_GEN_COM + RUTAS_API.GEN_COMISION.RECAUDOS + "/" + periodo.id,
        data
      )
      .then()
      .catch((error) => console.log(error));
  };

  /**
   * Método encargado de configurar los valores booleanos que permitiran
   * mostrar modales con informacion en la tabla
   */
  configurarModales = () => {
    const coms = this.state.filas;
    const modales = [];

    coms.forEach(() => {
      const modal = {
        mostrarModalImpuesto: false,
        mostrarModalNovedad: false,
      };

      modales.push(modal);
    });

    this.setState({ modales });
  };

  /**
   * Método encargado de controlar los modales
   */
  controlarModal = (index, modalValor) => {
    const pageData = this.state.pageData;
    pageData[index][modalValor] = !pageData[index][modalValor];

    this.setState({ pageData });
  };

  obtenerTipos = () => {
    axios
      .get(URL_GEN_COM + RUTAS_API.GEN_COMISION.NOV_TIPOS)
      .then((respuesta) => this.setState({ nov_tipos: respuesta.data.datos }))
      .catch((error) => console.log(error));
  };

  obtenerPeriodo = () => {
    axios
      .get(URL_GEN_COM + RUTAS_API.GEN_COMISION.PERIODO_REC)
      .then((respuesta) =>
        this.setState({
          periodo: {
            ciclo: respuesta.data.datos.cic_ciclo.cic_nombre,
            periodo: respuesta.data.datos.per_nombre,
            id: respuesta.data.datos.per_ideregistro,
          },
        })
      )
      .catch((error) => console.log(error));
  };

  cierrePeriodo = (evento) => {
    evento.preventDefault();

    axios
      .put(URL_GEN_COM + RUTAS_API.GEN_COMISION.PERIODO_REC_CERRAR)
      .then()
      .catch((error) => console.log(error));
  };

  /**
   * Método encargado de renderizar las filas de la tabla.
   */
  renderizarPaginas = () => {
    const data = this.state.comisiones;
    const slices = data.slice(
      this.state.offset,
      this.state.offset + this.state.perPage
    );
    const pageData = [];

    slices.forEach((slice) => {
      slice.mostrarModalImpuesto = false;
      slice.mostrarModalNovedad = false;

      pageData.push(slice);
    });

    const filas = slices.map((dato, index) => (
      <tr key={`rec-${index}`}>
        <td>{dato.prc_parecaudocomision.terceroObject.ter_nomcompleto}</td>
        <td>
          {dato.prc_parecaudocomision.bcu_ideregistro_object.bcu_numcuenta}
        </td>
        <td>{dato.prc_parecaudocomision.medpagoObject.uni_nombre1}</td>
        <td>{moment(dato.gcr_fecharecaudo).format("DD/MM/YYYY")}</td>
        <td align="right">
          {new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
          }).format(dato.gcr_valorbase)}
        </td>
        <td align="right">{dato.gcr_cantidad}</td>
        <td align="right">
          {new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
          }).format(dato.gcr_comisinimpuesto)}
        </td>
        <td align="right">
          <span className="mr-2">
            {new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
            }).format(dato.gcr_comiconimpuesto)}
          </span>
          <button
            className="btn btn-primary"
            onClick={() => this.controlarModal(index, "mostrarModalImpuesto")}
          >
            Mostrar
          </button>
        </td>
        <td align="right">
          {new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
          }).format(dato.gcr_total)}
        </td>
        <td>
          <button
            className="btn btn-primary"
            onClick={() => this.controlarModal(index, "mostrarModalNovedades")}
          >
            Mostrar
          </button>
        </td>
      </tr>
    ));

    const pageCount = Math.ceil(data.length / this.state.perPage);

    this.setState({ pageCount, filas, pageData });
  };

  /**
   * Método encargado de controlar el cambio de página.
   */
  controlarClickAPagina = (evento) => {
    const currentPage = evento.selected;
    const offset = currentPage * this.state.perPage;

    this.setState({ currentPage, offset, pageData: [] }, () =>
      this.renderizarPaginas()
    );
  };

  /**
   * Método encargado de actualizar el valor de máximo número de filas por página en la tabla.
   */
  actualizarNumeroDeFilas = (evento) => {
    evento.preventDefault();

    const perPage = Number(evento.target.value);
    const currentPage = 0;
    const offset = 0;

    this.setState({ perPage, currentPage, offset, pageData: [] }, () =>
      this.renderizarPaginas()
    );
  };

  render() {
    const {
      consulta,
      filas,
      periodo,
      perPage,
      pageCount,
      pageData,
      nov_tipos,
    } = this.state;

    return (
      <Fragment>
        <RGenComNavbar history={this.props.history} />
        <RGenComTercerosForm
          idPrograma={PROGRAMAS.COM_RECAUDO}
          modificarTercero={this.modificarTercero}
          consulta={consulta}
        />
        <RGenComFechas
          modificarFechas={this.modificarFechas}
          consultarComision={this.consultarComision}
          procesarComision={this.procesarComision}
        />
        <hr style={{ borderTop: "1px solid #007bff" }}></hr>
        <div>
          <span className="mr-2">
            {periodo.ciclo} - {periodo.periodo}
          </span>
          <button className="btn btn-primary" onClick={this.cierrePeriodo}>
            Cierre
          </button>
        </div>
        <div className="scroll-table">
          <table className="table mt-8">
            <thead>
              <tr>
                <th scope="col">Recaudador</th>
                <th scope="col">Cuenta Bancaria</th>
                <th scope="col">Convenio</th>
                <th scope="col">Fecha</th>
                <th scope="col">Valor Base</th>
                <th scope="col">
                  Cantidad de
                  <br />
                  Transacciones
                </th>
                <th scope="col">
                  Comisión sin
                  <br />
                  Impuestos
                </th>
                <th scope="col">
                  Valor de
                  <br />
                  Impuestos
                </th>
                <th scope="col">Costo Total</th>
                <th scope="col">Novedades</th>
              </tr>
            </thead>
            <tbody>{filas}</tbody>
          </table>
        </div>
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
              activeClassName={"active"}
            />
          </div>
          <div className="col-auto">
            <select
              className="form-control"
              value={perPage}
              onChange={this.actualizarNumeroDeFilas}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
        {pageData.map((data, index) => [
          <Modal
            key={`modal-impuesto-${index}`}
            visible={data.mostrarModalImpuesto}
            onClickBackdrop={() =>
              this.controlarModal(index, "mostrarModalImpuesto")
            }
          >
            <RGenComImpuestos
              impuestos={data.prc_parecaudocomision.impuesto}
              index={index}
              controlarModal={this.controlarModal}
            />
          </Modal>,
          <Modal
            key={`modal-novedad-${index}`}
            visible={data.mostrarModalNovedades}
            onClickBackdrop={() =>
              this.controlarModal(index, "mostrarModalNovedades")
            }
          >
            <RGenComNovedades
              comId={data.gcr_ideregistro}
              index={index}
              tipo="recaudo"
              nov_tipos={nov_tipos}
              controlarModal={this.controlarModal}
            />
          </Modal>,
        ])}
      </Fragment>
    );
  }
}

GenComRecaudo.propTypes = {
  history: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GenComRecaudo);

export { VistaRedux as RGenComRecaudo };
