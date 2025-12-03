import React, { Suspense } from "react";
import parametrosApi from "../../../api/homologaciones/ParParametrosApi";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import basicoDefault from "../../../api/homologaciones/BasicoDefault";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import paginationFactory from "react-bootstrap-table2-paginator";
import ParametrizacionImportacionImins from "../ParametrizacionImportacionImins/ParametrizacionImportacionImins";
import ParametrizacionImportacionDimins from "../../../components/Homologaciones/ParametrizacionImportacionDimins/ParametrizacionImportacionDimins";
//import empresasApi from '../../../api/homologaciones/Empresas';
import ModalGuardar from "../../../components/utils/ModalGuardar/ModalGuardar";
import homoApi from "../../../api/homologaciones/Homologacion";
import ModalCargando from "../../../components/utils/ModalCargando/ModalCargando";
import Alerta from "../../../components/utils/AlertaComponent/AlertaComponent";

interface IProps {
  value?: any;
  informacion?: any;
  permisos?: any;
  //guardarInfoGestion:(e:any)=>void
}

class ParametrizacionImportCrear extends React.Component<IProps, any> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      cargando: false,
      estadoLista: false,
      estadoWizard: 0,
      crear: {
        idImarc: 0,
        imarcNombreArchivo: "",
        imarcTipoArchivo: "XLSX",
        imarcTipoProceso: 1,
        detallesImcol: [],
        detallesImins: [],
      },
      agregarColumna: {
        idImcol: 0,
        nombre: "",
        descripcion: "",
        tipoDato: "TEXTO",
        obligatorio: false,
        validador: "",
        tipoResolucion: "",
        json: "",
      },
      tiposDatos: [],
      tiposResolucion: [],
      parametros: [],
      jsonColumna: true,
      listaEncabezado: ["nombre", "descripcion", "tipoDato"],
      seleccion: "",
      listaTablas: [],
      estadoModal: false,
      alerta: {
        variante: "",
        estado: false,
        valor: "",
      },
    };
    this.getEncabezado = this.getEncabezado.bind(this);
    this.formatoBotton = this.formatoBotton.bind(this);
  }

  async componentDidMount() {
    await this.cargarParametros();
    await this.cargarDefecto();
  }

  cargarParametros = async () => {
    let paraApi: parametrosApi = new parametrosApi();
    let tmp = await paraApi.listaParametros();
    await this.setState({
      parametros: tmp.data,
    });
  };

  cargarDefecto = async () => {
    let basico: basicoDefault = new basicoDefault();
    //let empApi:empresasApi=new empresasApi();
    //let tmp=await empApi.tablasBase();
    await this.setState({
      tiposDatos: await JSON.parse(
        basico.buscarParametro("tipo_dato_importacion", this.state.parametros)
      ),
      tiposResolucion: await JSON.parse(
        basico.buscarParametro(
          "tipo_resolucion_importacion",
          this.state.parametros
        )
      ),
      listaTablas: await JSON.parse(
        basico.buscarParametro(
          "tablas_parametrizacion_importacion",
          this.state.parametros
        )
      ),
      //listaTablas:tmp.data
    });
  };

  async cambioValor(
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) {
    const { value, name } = e.target;

    await this.setState({
      crear: {
        ...this.state.crear,
        [name]: value,
      },
    });
  }

  async cambioValorColumna(
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) {
    const { value, name } = e.target;
    await this.setState({
      agregarColumna: {
        ...this.state.agregarColumna,
        [name]: value,
      },
    });
  }

  async cambioValorColumnaJson(
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) {
    const { value, name } = e.target;
    let buscarTmp = this.state.tiposResolucion.filter(
      (item) => item.valor === value
    );
    console.log(buscarTmp);
    if (buscarTmp[0] !== undefined && buscarTmp[0].texto === 1) {
      await this.setState({
        jsonColumna: false,
      });
    } else {
      await this.setState({
        jsonColumna: true,
        agregarColumna: {
          ...this.state.agregarColumna,
          imcolJason: "",
        },
      });
    }
    await this.setState({
      agregarColumna: {
        ...this.state.agregarColumna,
        [name]: value,
      },
    });
  }

  agregarColumna = async () => {
    let busqueda = this.state.crear.detallesImcol.filter(
      (item) => item.nombre !== this.state.agregarColumna.nombre
    );
    let tmp = busqueda; //this.state.crear.detallesImcol;
    tmp.push(this.state.agregarColumna);
    await this.setState({
      crear: {
        ...this.state.crear,
        detallesImcol: tmp,
      },
      agregarColumna: {
        idImcol: 0,
        nombre: "",
        descripcion: "",
        tipoDato: "",
        obligatorio: false,
        validador: "",
        tipoResolucion: "",
        json: "",
      },
    });
  };

  ////imins
  eliminarImins = async (e: any) => {
    await this.setState({
      detallesImins: e,
    });
  };

  agregarImins = async (e: any) => {
    await this.setState({
      crear: {
        ...this.state.crear,
        detallesImins: e,
      },
    });
    //console.log('imins en crear ',this.state.detallesImins);
  };

  eliminarDimins = async (e: any) => {
    await this.setState({
      crear: {
        ...this.state.crear,
        detallesImins: e,
      },
    });
  };

  cambioDimins = async (e: any) => {
    await this.setState({
      detallesImins: {
        ...this.state.crear.detallesImins,
        detalleDimins: e,
      },
    });
  };

  guardar = async () => {
    await this.setState({
      cargando: true,
    });
    let api: homoApi = new homoApi();
    console.log("que sale de informacion ", this.state.crear);
    let tmp = await api.insertarparametrizaion(this.state.crear);
    let resultadoFinal = tmp.data;
    if (resultadoFinal.statusCode === 200) {
      this.llamarAlerta("success", "Transaccion Exitosa...");
    } else {
      this.llamarAlerta(
        "danger",
        "Error Transaccion, Comunicarse con el Area de Tecnologia..."
      );
    }
    await this.setState({
      estadoWizard: 0,
      crear: {
        idImarc: 0,
        imarcNombreArchivo: "",
        imarcTipoArchivo: "XLSX",
        imarcTipoProceso: "1",
        detallesImcol: [],
        detallesImins: [],
      },
      cargando: false,
      estadoModal: false,
    });
    console.log(tmp.data);
  };

  llamarAlerta = (tmp1: string, tmp2: string) => {
    this.setState({
      alerta: {
        ...this.state.basico,
        estado: true,
        variante: tmp1,
        valor: tmp2,
      },
    });
    setTimeout(() => {
      this.setState({
        alerta: {
          ...this.state.basico,
          estado: false,
          variante: "",
          valor: "",
        },
      });
    }, 3000);
  };

  formatoGeneral2(cell: any) {
    let resultado = "";
    for (let tmp in cell) {
      if (typeof cell[tmp] === "string") {
        resultado = cell[tmp];
      }
    }
    return resultado;
  }

  formatoBotton(cell: any, row: any) {
    return (
      <Button
        variant="outline-danger"
        key={cell}
        onClick={this.seleccion.bind(this, row)}
      >
        Eliminar
      </Button>
    );
  }

  async seleccion(e: any) {
    let filtro = this.state.crear.detallesImcol.filter(
      (item) => item.nombre !== e.nombre
    );
    await this.setState({
      crear: {
        ...this.state.crear,
        detallesImcol: filtro,
      },
    });
  }

  getEncabezado() {
    //var encabezado = ['CODIGO','UBICACION','ESTRATO','MUNICIPIO','NOMBRE','IDENTIFICACION','DIRECCION','CICLO'];
    var encabezado = this.state.listaEncabezado;
    return encabezado.map((row: any, index: number) => {
      var tmp = row;
      var tmp2 = tmp.lastIndexOf(".");
      if (tmp2 > 0) {
        let nombre1 = row.substring(0, tmp2);
        return (
          <TableHeaderColumn
            key={index}
            dataAlign="center"
            dataField={nombre1}
            dataFormat={this.formatoGeneral2}
            dataSort={true}
          >
            {nombre1}
          </TableHeaderColumn>
        );
      } else {
        return (
          <TableHeaderColumn
            key={index}
            dataAlign="center"
            dataField={row}
            dataSort={true}
          >
            {row}
          </TableHeaderColumn>
        );
      }
    });
  }

  mostrarModal = (): any => {
    if (this.state.estadoModal) {
      return (
        <ModalGuardar
          guardar={this.guardar}
          cerrar={() => this.setState({ estadoModal: false })}
        />
      );
    }
  };

  mostrarCargando = (): any => {
    if (this.state.cargando) {
      return <ModalCargando estado={this.state.cargando}></ModalCargando>;
    }
  };

  mostrarAlerta = (): any => {
    if (this.state.alerta.estado) {
      return <Alerta informacion={this.state.alerta}></Alerta>;
    }
  };

  cargarDetalle = (e): any => {
    return (
      <div>
        <Container>
          <Row>
            <Col>
              <div className="form-group">
                <label>Estado Obligatorio</label>
                <select
                  onChange={(e) => this.cambioValorColumna(e)}
                  className="form-control"
                  name="obligatorio"
                  value={e.obligatorio}
                  disabled={true}
                >
                  <option value="--" key="0"></option>
                  <option value="true" key="1">
                    VERDADERO
                  </option>
                  <option value="false" key="2">
                    FALSO{" "}
                  </option>
                </select>
              </div>
            </Col>
            <Col>
              <div className="form-group">
                <label>Validador</label>
                <input
                  className="form-control"
                  onChange={(e) => this.cambioValorColumna(e)}
                  name="validador"
                  value={e.validador}
                  type="text"
                  placeholder=""
                  disabled={true}
                />
              </div>
            </Col>
            <Col>
              <div className="form-group">
                <label>Tipo Resolucion</label>
                <select
                  onChange={(e) => this.cambioValorColumnaJson(e)}
                  className="form-control"
                  name="tipoResolucion"
                  value={e.tipoResolucion}
                  disabled={true}
                >
                  <option value="--" key="0"></option>
                  {this.state.tiposResolucion.map((e: any, key: number) => {
                    return (
                      <option key={key} value={e.valor}>
                        {e.valor}
                      </option>
                    );
                  })}
                </select>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="form-group">
                <label>Json Consulta</label>
                <input
                  className="form-control"
                  onChange={(e) => this.cambioValorColumna(e)}
                  name="json"
                  value={e.json}
                  type="text"
                  disabled={true}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  };

  handleExpand = async (rowKey, isExpand) => {
    //this.expandedRows[rowKey] = isExpand;
    //console.log('que seleccione...'+rowKey);
    //console.log('que seleccione2...'+isExpand);
    if (isExpand) {
      await this.setState({
        busqueda: [],
        seleccion: rowKey,
      });
      //await this.cargarBarrios();
      //this.actualizarSeleccion(rowKey);
    } else {
      await this.setState({
        busqueda: [],
      });
    }
  };

  wizard = (): any => {
    const tableOptions = {
      expandBy: "column",
      onExpand: this.handleExpand,
      onlyOneExpanding: true,
    };

    const expandColumnOptions = {
      //expandColumnVisible: true
    };
    switch (this.state.estadoWizard) {
      case 0:
        return (
          <div>
            <Container>
              <Row>
                <Col>
                  <div className="text-center">
                    <h2>
                      <label>Nombre del Archivo</label>
                    </h2>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="form-group">
                    <Form.Group controlId="form100">
                      <label>Nombre Archivo</label>
                      <input
                        className="form-control"
                        onChange={(e) => this.cambioValor(e)}
                        name="imarcNombreArchivo"
                        value={this.state.crear.imarcNombreArchivo}
                        type="text"
                        placeholder=""
                      />
                      <Form.Text className="text-muted">
                        Este Campo es Obligatorio...
                      </Form.Text>
                    </Form.Group>
                  </div>
                </Col>
                <Col>
                  <div className="form-group">
                    <label>Tipo de Archivo</label>
                    <input
                      className="form-control"
                      onChange={(e) => this.cambioValor(e)}
                      name="imarcTipoArchivo"
                      value={this.state.crear.imarcTipoArchivo}
                      type="text"
                      placeholder=""
                      disabled={true}
                    />
                  </div>
                </Col>
                <Col>
                  <div className="form-group">
                    <label>Tipo de proceso</label>
                    <select
                      className="form-control"
                      onChange={(e) => this.cambioValor(e)}
                      name="imarcTipoProceso"
                      value={this.state.crear.imarcTipoProceso}
                      placeholder=""
                    >
                      <option value="1">Insertar registros</option>
                      <option value="2">Actualizar registros</option>
                    </select>
                  </div>
                </Col>
              </Row>
              <br />
              <br />
              <Row>
                <Col>
                  <Button
                    variant="info"
                    onClick={() => this.setState({ estadoWizard: 1 })}
                    disabled={
                      this.state.crear.imarcNombreArchivo.length > 0 &&
                      this.props.permisos?.CREATE
                        ? false
                        : true
                    }
                    size="lg"
                  >
                    Siguiente
                  </Button>
                </Col>
              </Row>
            </Container>
          </div>
        );
      case 1:
        return (
          <div>
            <Card>
              <Card.Body>
                <Row>
                  <Col>
                    <div className="text-center">
                      <h2>
                        Agregar Campos Archivo (Los campos Tipo de dato y
                        Resolucion son requeridos)
                      </h2>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="form-group">
                      <Form.Group controlId="form1">
                        <label>Nombre Columna</label>
                        <input
                          className="form-control"
                          onChange={(e) => this.cambioValorColumna(e)}
                          name="nombre"
                          value={this.state.agregarColumna.nombre}
                          type="text"
                          placeholder=""
                        />
                        <Form.Text className="text-muted">
                          Este Campo es Obligatorio...
                        </Form.Text>
                      </Form.Group>
                    </div>
                  </Col>
                  <Col>
                    <div className="form-group">
                      <Form.Group controlId="form2">
                        <label>Descripcion</label>
                        <input
                          className="form-control"
                          onChange={(e) => this.cambioValorColumna(e)}
                          name="descripcion"
                          value={this.state.agregarColumna.descripcion}
                          type="text"
                          placeholder=""
                        />
                        <Form.Text className="text-muted"></Form.Text>
                      </Form.Group>
                    </div>
                  </Col>
                  <Col>
                    <div className="form-group">
                      <Form.Group controlId="form3">
                        <label>Tipo de Dato (* Requerido)</label>
                        <select
                          onChange={(e) => this.cambioValorColumna(e)}
                          className="form-control"
                          name="tipoDato"
                          value={this.state.agregarColumna.tipoDato}
                        >
                          <option value="--" key="0"></option>
                          {this.state.tiposDatos.map((e: any, key: number) => {
                            return (
                              <option key={key} value={e.valor}>
                                {e.valor}
                              </option>
                            );
                          })}
                        </select>
                        <Form.Text className="text-muted">
                          Este Campo es Obligatorio...
                        </Form.Text>
                      </Form.Group>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="form-group">
                      <Form.Group controlId="form4">
                        <label>Estado Obligatorio</label>
                        <select
                          onChange={(e) => this.cambioValorColumna(e)}
                          className="form-control"
                          name="obligatorio"
                          value={this.state.agregarColumna.obligatorio}
                        >
                          <option value="--" key="0"></option>
                          <option value="true" key="1">
                            VERDADERO
                          </option>
                          <option value="false" key="2">
                            FALSO{" "}
                          </option>
                        </select>
                        <Form.Text className="text-muted">
                          Este Campo es Obligatorio...
                        </Form.Text>
                      </Form.Group>
                    </div>
                  </Col>
                  <Col>
                    <div className="form-group">
                      <label>Validador</label>
                      <input
                        className="form-control"
                        onChange={(e) => this.cambioValorColumna(e)}
                        name="validador"
                        value={this.state.agregarColumna.validador}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </Col>
                  <Col>
                    <div className="form-group">
                      <Form.Group controlId="form5">
                        <label>Tipo Resolucion (* Requerido)</label>
                        <select
                          onChange={(e) => this.cambioValorColumnaJson(e)}
                          className="form-control"
                          name="tipoResolucion"
                          value={this.state.agregarColumna.tipoResolucion}
                        >
                          <option value="--" key="0"></option>
                          {this.state.tiposResolucion.map(
                            (e: any, key: number) => {
                              return (
                                <option key={key} value={e.valor}>
                                  {e.valor}
                                </option>
                              );
                            }
                          )}
                        </select>
                        <Form.Text className="text-muted">
                          Este Campo es Obligatorio...
                        </Form.Text>
                      </Form.Group>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="form-group">
                      <label>Json Consulta</label>
                      <input
                        className="form-control"
                        onChange={(e) => this.cambioValorColumna(e)}
                        name="json"
                        value={this.state.agregarColumna.json}
                        type="text"
                        placeholder="sintaxis JSON"
                        disabled={this.state.jsonColumna}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Col>
                      <Button
                        variant="primary"
                        onClick={this.agregarColumna}
                        disabled={
                          this.state.agregarColumna.nombre.length > 0 &&
                          this.state.agregarColumna.tipoDato.length > 0 &&
                          this.state.agregarColumna.tipoResolucion.length > 0 &&
                          this.state.agregarColumna.tipoDato.length > 0
                            ? false
                            : true
                        }
                      >
                        Agregar
                      </Button>
                    </Col>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <br />
            <br />
            <Row>
              <Col>
                <div className="text-center">
                  <h2>Lista de Campos Archivo</h2>
                </div>
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col>
                <BootstrapTable
                  wrapperClasses="table"
                  data={this.state.crear.detallesImcol}
                  striped={true}
                  hover={true}
                  pagination={paginationFactory({})}
                  keyField="nombre"
                  noDataIndication="No Hay Informacion..."
                  options={tableOptions}
                  expandColumnOptions={expandColumnOptions}
                  expandableRow={() => true}
                  expandComponent={this.cargarDetalle}
                >
                  <TableHeaderColumn
                    dataAlign="center"
                    dataField="button"
                    dataFormat={this.formatoBotton}
                  >
                    Eliminar
                  </TableHeaderColumn>
                  {this.getEncabezado()}
                </BootstrapTable>
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col>
                <Button
                  variant="secondary"
                  onClick={() => this.setState({ estadoWizard: 0 })}
                  size="lg"
                >
                  Atras
                </Button>
              </Col>
              <Col>
                <Button
                  variant="info"
                  onClick={() => this.setState({ estadoWizard: 2 })}
                  size="lg"
                >
                  Siguiente
                </Button>
              </Col>
            </Row>
          </div>
        );
      case 2:
        return (
          <div>
            <Card>
              <Card.Body>
                <Row>
                  <Col>
                    <div className="text-center">
                      <h2>Tablas Parametrizacion</h2>
                    </div>
                  </Col>
                </Row>
                <ParametrizacionImportacionImins
                  listaTablas={this.state.listaTablas}
                  informacion={this.state.crear.detallesImins}
                  eliminarDetalle={this.eliminarImins}
                  agregarDetalle={this.agregarImins}
                  idImarcpadre={this.state.crear.idImarc}
                />
                <br />
                <br />
                <Row>
                  <Col>
                    <Button
                      variant="secondary"
                      onClick={() => this.setState({ estadoWizard: 1 })}
                      size="lg"
                    >
                      Atras
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="info"
                      onClick={() => this.setState({ estadoWizard: 3 })}
                      size="lg"
                    >
                      Siguiente
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        );
      case 3:
        return (
          <div>
            <Row>
              <Col>
                <div className="text-center">
                  <h2>
                    parametrizar Campos Tablas (agregar los campos tipo
                    Resolucion y dato son requeridos)
                  </h2>
                </div>
              </Col>
            </Row>
            <ParametrizacionImportacionDimins
              informacion={this.state.crear.detallesImins}
              cambioDetalle={this.cambioDimins}
            />
            <br />
            <br />
            <Row>
              <Col>
                <Button
                  variant="success"
                  onClick={() => this.setState({ estadoModal: true })}
                >
                  Guardar Parametrizacion
                </Button>
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col>
                <Button
                  variant="secondary"
                  onClick={() => this.setState({ estadoWizard: 2 })}
                  size="lg"
                >
                  Atras
                </Button>
              </Col>
            </Row>
          </div>
        );
    }
  };

  render() {
    return (
      <div>
        <Suspense fallback={<div>Cargando...</div>}>
          <div className="row">
            <div className="d-flex p-2 bd-highlight">
              <h2>Crear patametrizacion Importacion Homologaciones</h2>
            </div>
            <div className="col-12">
              {this.mostrarAlerta()}
              {this.mostrarModal()}
              {this.mostrarCargando()}
              {this.wizard()}
            </div>
          </div>
        </Suspense>
      </div>
    );
  }
}
export default ParametrizacionImportCrear;
