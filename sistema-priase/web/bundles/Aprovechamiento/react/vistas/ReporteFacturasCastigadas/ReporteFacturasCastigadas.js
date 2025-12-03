import connect from "react-redux/es/connect/connect";
import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import { Button, Col, Dropdown, Form } from "react-bootstrap";
import "./ReporteFacturasCastigadas.scss";
import DateBoxG from "../Utils/Components/DateBoxG";
import moment from "moment";
import {
  consultaGetAprovechamiento,
  saveConsultaGetAprovechamiento,
} from "../../store/actions/Utils";
import RUTAS_API from "../../global/rutas_api";
import { VARIABLES_APROVECHAMIENTO } from "../../global/constantes";

class ReporteFacturasCastigadasInt extends Component {
  state = {
    //Variables de control de validación de los formularios
    validated: false,

    // Variables de control de los campos de fecha en el formulario de búsqueda
    from: moment().format("YYYY-MM-DD"),
    to: moment().format("YYYY-MM-DD"),

    // Variables auxiliares para manejo de terceros seleccionados
    nombre: "",
    documento: "",
    terceros: [],
    tercerosSeleccionados: [],
  };
  nombreTimer;
  documentoTimer;

  componentDidMount() {
    this.obtenerParametrosAprovechamiento();
    this.obtenerTercerosPorNombre();
  }

  /**
   * Método encargado de cargar los parámetros de aprovechamiento
   */
  obtenerParametrosAprovechamiento = () => {
    this.props.consultaGetAprovechamiento(
      RUTAS_API.PAR_PARAMETRO.CONSULTA_PARAMETROS_APROVECHAMIENTO,
      {},
      {},
      "parametrosAprovechamiento"
    );
  };

  /**
   * Método encargado de consultar lista de terceros que coincidan con el nombre proporcionado
   */
  obtenerTercerosPorNombre = async (nombre = "") => {
    await this.props.consultaGetAprovechamiento(
      RUTAS_API.TER_TERCERO.CONSULTA_APROVECHADORES_POR_NOMBRE,
      { nombre },
      {},
      "tercerosNombre"
    );

    if (this.props.tercerosNombre && this.props.tercerosNombre.data) {
      const terceros = this.filtrarTercerosSeleccionados();

      this.setState({ terceros });
    }
  };

  /**
   * Método auxiliar encargado de filtrar los terceros seleccionados de la lista completa
   */
  filtrarTercerosSeleccionados = () => {
    let terceros;

    if (this.state.tercerosSeleccionados.length === 0) {
      terceros = [...this.props.tercerosNombre.data];
    } else {
      terceros = this.props.tercerosNombre.data.filter((tercero) => {
        return !!!this.state.tercerosSeleccionados.find(
          (terceroSeleccionado) => {
            return (
              terceroSeleccionado.terIderegistro === tercero.terIderegistro
            );
          }
        );
      });
    }

    return terceros;
  };

  filtrarPorValores = (nombre, documento) => {
    let terceros = this.filtrarTercerosSeleccionados();

    if (nombre) {
      terceros = terceros.filter((tercero) =>
        tercero.terNomcompleto.toUpperCase().includes(nombre.toUpperCase())
      );

      if (this.state.documento) {
        terceros = terceros.filter((tercero) => {
          const documentoX = `${tercero.terDocumento}${
            tercero.terDigverificacion ? tercero.terDigverificacion : ""
          }`;
          return documentoX.includes(this.state.documento);
        });
      }

      this.setState({ terceros, nombre });
    } else if (documento) {
      terceros = terceros.filter((tercero) => {
        const doc = `${tercero.terDocumento}${
          tercero.terDigverificacion ? tercero.terDigverificacion : ""
        }`;
        return doc.includes(documento);
      });

      if (this.state.nombre) {
        terceros = terceros.filter((tercero) =>
          tercero.terNomcompleto
            .toUpperCase()
            .includes(this.state.nombre.toUpperCase())
        );
      }

      this.setState({ terceros, documento });
    } else if (this.state.nombre) {
      terceros = terceros.filter((tercero) =>
        tercero.terNomcompleto
          .toUpperCase()
          .includes(this.state.nombre.toUpperCase())
      );

      if (this.state.documento) {
        terceros = terceros.filter((tercero) => {
          const documentoX = `${tercero.terDocumento}${
            tercero.terDigverificacion ? tercero.terDigverificacion : ""
          }`;
          return documentoX.includes(this.state.documento);
        });
      }

      this.setState({ terceros });
    } else if (this.state.documento) {
      terceros = terceros.filter((tercero) => {
        const doc = `${tercero.terDocumento}${
          tercero.terDigverificacion ? tercero.terDigverificacion : ""
        }`;
        return doc.includes(this.state.documento);
      });

      if (this.state.nombre) {
        terceros = terceros.filter((tercero) =>
          tercero.terNomcompleto
            .toUpperCase()
            .includes(this.state.nombre.toUpperCase())
        );
      }

      this.setState({ terceros });
    } else {
      this.setState({ terceros });
    }
  };

  handleNombreOnChange = (value) => {
    if (this.nombreTimer) {
      clearTimeout(this.nombreTimer);
      this.nombreTimer = null;
    }

    this.nombreTimer = setTimeout(() => {
      this.filtrarPorValores(value, null);
    }, 800);
  };

  handleDocumentoOnChange = (value) => {
    if (this.documentoTimer) {
      clearTimeout(this.documentoTimer);
      this.documentoTimer = null;
    }

    this.documentoTimer = setTimeout(() => {
      this.filtrarPorValores(null, value);
    }, 800);
  };

  handleTerceroOnSelect = (idTercero) => {
    const terceros = this.state.terceros.filter(
      (tercero) => tercero.terIderegistro !== idTercero
    );
    const tercerosSeleccionados = [...this.state.tercerosSeleccionados];

    tercerosSeleccionados.push(
      this.state.terceros.find(
        (tercero) => tercero.terIderegistro === idTercero
      )
    );

    this.setState({ terceros, tercerosSeleccionados });
  };

  handleAllTercerosOnSelect = () => {
    let tercerosSeleccionados = [...this.state.tercerosSeleccionados];

    tercerosSeleccionados = tercerosSeleccionados.concat([
      ...this.state.terceros,
    ]);

    this.setState({ terceros: [], tercerosSeleccionados });
  };

  handleTerceroOnRemove = (idTercero) => {
    const tercerosSeleccionados = this.state.tercerosSeleccionados.filter(
      (tercero) => tercero.terIderegistro !== idTercero
    );
    const terceros = [...this.state.terceros];

    terceros.push(
      this.state.tercerosSeleccionados.find(
        (tercero) => tercero.terIderegistro === idTercero
      )
    );

    this.setState({ terceros, tercerosSeleccionados });
  };

  handleAllTercerosOnRemove = () => {
    let terceros = [...this.state.terceros];

    terceros = terceros.concat([...this.state.tercerosSeleccionados]);

    this.setState({ tercerosSeleccionados: [], terceros });
  };

  /**
   * Método encargado de modificar en el state el valor de las fechas seleccionadas en el
   * filtro de búsqueda
   *
   * @param {*} evento
   */
  handleDateOnChange = (evento) => {
    this.setState({ [evento.target.id]: evento.target.value });
    /*this.props.saveItem(
      moment(evento.target.value).format("YYYY-MM-DD HH:mm:ss"),
      [evento.target.id]
    );*/
  };

  /**
   * Método encargado de manejar la validación del formulario de búsqueda de facturas castigadas
   *
   * @param {event} event Parámetro que se recibe para que el método solo se ejecute cuando se hace el llamado al evento de onChange
   */
  handleOnSubmit = (event) => {
    //const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    console.log("submit");

    /* TODO: 4/2/2021 agregar validación y consumo de servicio */
    /* TODO: 12/2/2021 las variables se encuentran en state, from, to, tercerosSeleccionados */
    /*if (this.props.preLoadIdRegister) {
      this.consultaDetalleSuscripcion();
    } else if (form.checkValidity() === true) {
      this.consultaDetalleSuscripcion();
      this.setState({ validated: true });
    }*/
  };

  render() {
    const { terceros, tercerosSeleccionados, validated, to, from } = this.state;
    const { parametrosAprovechamiento } = this.props;

    const today = moment().format("YYYY-MM-DD");
    const maximoDiasConsultaCastigo =
      parametrosAprovechamiento &&
      parametrosAprovechamiento.data[
        VARIABLES_APROVECHAMIENTO.maximoDiasConsultaCastigo
      ]
        ? parametrosAprovechamiento.data[
            VARIABLES_APROVECHAMIENTO.maximoDiasConsultaCastigo
          ]
        : 721;
    const minDate = moment()
      .subtract(maximoDiasConsultaCastigo, "days")
      .format("YYYY-MM-DD");

    const tercerosSelected = tercerosSeleccionados.length !== 0;
    const tercerosOrdenadosPorNombre = terceros.sort((a, b) => {
      const nombreA = a.terNomcompleto;
      const nombreB = b.terNomcompleto;
      return nombreA === nombreB ? 0 : nombreA > nombreB ? 1 : -1;
    });
    const tercerosOrdenadosPorDocumento = terceros.sort((a, b) => {
      const documentoA = `${a.terDocumento}-${
        a.terDigverificacion ? a.terDigverificacion : "X"
      }`;
      const documentoB = `${b.terDocumento}-${
        b.terDigverificacion ? b.terDigverificacion : "X"
      }`;
      return documentoA === documentoB ? 0 : documentoA > documentoB ? 1 : -1;
    });

    return (
      <div className="ReporteFacturasCastigadas px-4 pb-4">
        {/*Título de Página*/}
        <h2>Reporte Facturas Castigadas</h2>

        {/*Filtro*/}
        <Form validated={validated} onSubmit={this.handleOnSubmit}>
          {/*Buscadores de terceros*/}
          <Form.Row>
            {/*Nombres / Apellidos*/}
            <Form.Group as={Col} md="4">
              <Form.Label>Tercero Nombres/Apellidos</Form.Label>

              <Dropdown drop="down">
                <Dropdown.Toggle
                  as={Form.Control}
                  type="text"
                  placeholder="Digite nombre de tercero"
                  onChange={(e) => {
                    this.handleNombreOnChange(e.target.value);
                  }}
                />

                {terceros && terceros.length > 0 ? (
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onSelect={() => this.handleAllTercerosOnSelect()}
                    >
                      Todos
                    </Dropdown.Item>
                    {tercerosOrdenadosPorNombre.map((tercero) => (
                      <Dropdown.Item
                        key={`tercero-nombre-${tercero.terIderegistro}`}
                        onSelect={() =>
                          this.handleTerceroOnSelect(tercero.terIderegistro)
                        }
                      >
                        {tercero.terNomcompleto}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                ) : null}
              </Dropdown>
            </Form.Group>

            {/*Documento*/}
            <Form.Group as={Col} md="4">
              <Form.Label>Documento Tercero</Form.Label>

              <Dropdown drop="down">
                <Dropdown.Toggle
                  as={Form.Control}
                  type="number"
                  placeholder="Digite NIT con dígito de verificación"
                  onChange={(e) => {
                    this.handleDocumentoOnChange(e.target.value);
                  }}
                />

                {terceros && terceros.length > 0 ? (
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onSelect={() => this.handleAllTercerosOnSelect()}
                    >
                      Todos
                    </Dropdown.Item>
                    {tercerosOrdenadosPorDocumento.map((tercero) => (
                      <Dropdown.Item
                        key={`tercero-nit-${tercero.terIderegistro}`}
                        onSelect={() =>
                          this.handleTerceroOnSelect(tercero.terIderegistro)
                        }
                      >{`${tercero.terDocumento}-${
                        tercero.terDigverificacion
                          ? tercero.terDigverificacion
                          : "X"
                      }`}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                ) : null}
              </Dropdown>
            </Form.Group>
          </Form.Row>

          {tercerosSelected ? (
            <div>
              <hr style={{ borderTop: "1px solid #007bff" }} />

              {/*Botón Limpiar Selección*/}
              <Form.Row>
                <Form.Group as={Col} md="2">
                  <Button
                    type="button"
                    onClick={this.handleAllTercerosOnRemove}
                  >
                    Limpiar Seleccionados
                  </Button>
                </Form.Group>
              </Form.Row>

              {/*Terceros seleccionados*/}
              <div className="TercerosSeleccionados">
                {tercerosSeleccionados.map((tercero) => (
                  <div
                    key={`tercero-seleccionado-${tercero.terIderegistro}`}
                    className="TerceroSeleccionado"
                  >
                    <p className="TerceroName">{`${tercero.terNomcompleto}`}</p>
                    <p className="TerceroNit">{`${tercero.terDocumento}-${
                      tercero.terDigverificacion
                        ? tercero.terDigverificacion
                        : "X"
                    }`}</p>
                    <button
                      className="RemoveTercero"
                      onClick={() => {
                        this.handleTerceroOnRemove(tercero.terIderegistro);
                      }}
                    >
                      <i className="fa fa-times" />
                    </button>
                  </div>
                ))}
              </div>

              <hr style={{ borderTop: "1px solid #007bff" }} />
            </div>
          ) : null}

          {/*Campos de fecha*/}
          <Form.Row>
            <DateBoxG
              id="from"
              md="3"
              required
              label="Fecha Inicial"
              value={from}
              max={today}
              min={minDate}
              onChange={this.handleDateOnChange}
            />

            <DateBoxG
              id="to"
              md="3"
              label="Fecha Final"
              required
              value={to}
              min={from}
              max={today}
              onChange={this.handleDateOnChange}
            />
          </Form.Row>

          <Form.Row>
            <Form.Group as="Col" md="2">
              <Button type="submit" disabled={!tercerosSelected}>
                Resultados
              </Button>
            </Form.Group>
          </Form.Row>
        </Form>

        {/*Toast*/}
        <ToastContainer
          position="top-right"
          autoClose={4500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  parametrosAprovechamiento: state.Utils.parametrosAprovechamiento,
  tercerosNombre: state.Utils.tercerosNombre,
  tercerosDocumentoYDigito: state.Utils.tercerosDocumentoYDigito,
});

const mapDispatchToProps = {
  consultaGetAprovechamiento,
  saveConsultaGetAprovechamiento,
};

export const ReporteFacturasCastigadas = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReporteFacturasCastigadasInt);
