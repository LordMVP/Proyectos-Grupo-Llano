import React from "react";
import uniApi from "../../../api/homologaciones/UniUnidad";
import homoApi from "../../../api/homologaciones/Homologacion";
import facApi from "../../../api/homologaciones/FacFactura";
import EmpresasApi from "../../../api/homologaciones/Empresas";
import gestionApi from "../../../api/homologaciones/Ghomologacion";

import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Modal,
  Spinner,
} from "react-bootstrap";
//import TableInformacion from '../../../components/utils/TableInformacion/TableInformacion';
import Alerta from "../../../components/utils/AlertaComponent/AlertaComponent";

import HomologacionModel from "../../../models/HomologacionModel";
import ModalGuardar from "../../../components/utils/ModalGuardar/ModalGuardar";
import basicoDefault from "../../../api/homologaciones/BasicoDefault";
import parametrosApi from "../../../api/homologaciones/ParParametrosApi";
//import TableFormatoBootstrap from '../../../components/utils/TableInformacion/TableInformacion';
//import TablaDetalles from '../../../components/utils/TablaDetalles/TablaDetalles';
import InfoBasicaComponent from "../../../components/Homologaciones/InfoBasicaComponent/InfoBasicaComponent";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

interface IProps {
  guardarInfoHomologacion: (e: any) => void;
  value?: any;
  informacion: any;
  informacionAuxiliar?: any;
  permisos?: any;
}

class InfoHomologacionComponent extends React.Component<IProps, any> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      value: "",
      estado: 0,
      dsusSeleccion: {},
      dsusBusqueda: {},
      homologacion: {
        empresa: 0,
        convenio: 0,
        medidor: "",
        pcodigo: "",
        dsusIderegistro: Number,
        consumos: [0, 0, 0, 0, 0, 0],
        tipoUso: 0,
        estrato: 0,
        ciclo: 0,
        empresa2: 0,
        cicNombre: "",
        tipoUsoNombre: "",
        observaciones: "",
        deshomologacion: false,
      },
      ListaEmpresaAlternas: [],
      listaCiclo: [],
      listaTipoUso: [],
      listaEstrato: [],
      listaConvenio: [],
      ///busqueda
      fechaBusqueda1: "",
      fechaBusqueda2: "",
      empresa2: 0,
      encabezadoLista: [
        "Fecha",
        "Convenio",
        "Empresa",
        "NombreCompleto",
        "SuscripcionAlterna",
        "Usuario",
      ],
      listaHomologacion: [],
      alerta: {
        variante: "",
        estado: false,
        valor: "",
      },
      saldoFacturas: 0,
      estadoModal: false,
      auxiliar: {},
      login: {
        idEmpresa: 0,
        idUsuario: 0,
      },
      parametros: {},
      encabezadoDetalle: [
        "suscripcion",
        "idSuscripcion",
        "tercero",
        "empresa",
        "tipoUso",
        "consumo",
      ],
      modalDetalles: false,
      detallesBasicoTmp: {},
      vistaColumnasBasica: [],
      estadoColumnasBasica: [],
      //estadoModal1:true,
      buscando1: false,
      columnasTablaBuscar: [
        {
          dataField: "iddgho",
          text: "Id",
          sort: true,
          align: "center",
          hidden: true
        },
        {
          dataField: "idghom",
          text: "IdHomologacion",
          sort: true,
          align: "center",
          //hidden: true
        },
        {
          dataField: "Fecha",
          text: "Fecha de Homologación",
          sort: true,
          align: "center",
          //hidden: true
        },
        {
          dataField: "Empresa1",
          text: "Empresa Origen",
          sort: true,
          align: "center",
          //hidden: true
        },
        {
          dataField: "Empresa2",
          text: "Empresa Actual",
          sort: true,
          align: "center",
          //hidden: true
        },
        {
          dataField: "Convenio",
          text: "Empresa Actual",
          sort: true,
          align: "center",
          hidden: true,
        },
        {
          dataField: "Empresa",
          text: "Empresa Origen",
          sort: true,
          align: "center",
          hidden: true,
        },
        {
          dataField: "NombreCompleto",
          text: "Nombres",
          sort: true,
          align: "center",
          hidden: true,
        },
        {
          dataField: "SuscripcionAlterna",
          text: "Suscripción Actual",
          sort: true,
          align: "center",
          //hidden: true
        },
        {
          dataField: "Usuario",
          text: "Usuario",
          sort: true,
          align: "center",
          //hidden: true
        },
        {
          dataField: "Observaciones",
          text: "Observacion",
          sort: true,
          align: "center",
          //hidden: true
        },
        {
          dataField: "Informacion",
          text: "Informacion",
          align: "center",
          formatter: (rowContent, row) => {
            return (
              <Button
                variant="success"
                key={rowContent}
                onClick={this.modalDetalles.bind(this, row)}
              >
                Informacion
              </Button>
            );
          },
        }
      ],
      columnasTabla: [
        {
          dataField: "fecha",
          text: "Fecha",
          sort: true,
          align: "center",
          //hidden: true
        },
        {
          dataField: "suscripcion",
          text: "Suscripcion",
          sort: true,
          align: "center",
          //hidden: true
        },
        {
          dataField: "idSuscripcion",
          text: "ID Suscripcion",
          sort: true,
          align: "center",
          //hidden: true
        },
        {
          dataField: "tercero",
          text: "Nombres",
          sort: true,
          align: "center",
          //hidden: true
        },
        {
          dataField: "empresa",
          text: "Empresa",
          sort: true,
          align: "center",
          //hidden: true
        },
        {
          dataField: "tipoUso",
          text: "Tipo de Uso",
          sort: true,
          align: "center",
          headerStyle: {
            fontSize: "10px",
          },
          //hidden: true
        },
        {
          dataField: "medidor",
          text: "Medidor",
          sort: true,
          align: "center",
          //hidden: true
        },
        {
          dataField: "consumo",
          text: "Consumo",
          sort: true,
          align: "center",
          //hidden: true
        },
        {
          dataField: "observaciones",
          text: "Observaciones",
          sort: true,
          align: "center",
          //hidden: true
        },
        {
          dataField: "Informacion",
          text: "Informacion",
          align: "center",
          formatter: (rowContent, row) => {
            return (
              <Button
                variant="success"
                key={rowContent}
                onClick={this.modalDetalles.bind(this, row)}
              >
                Informacion
              </Button>
            );
          },
        },
      ],
    };
  }

  async componentDidMount() {
    await this.cargarDatosSesion();
    await this.cargarParametros();
    await this.cargarDefecto();
  }

  cargarDatosSesion = async () => {
    let basico: basicoDefault = new basicoDefault();
    let resultado = basico.extraerInfoToken(localStorage.getItem("token"));
    await this.setState({
      login: {
        ...this.state.login,
        idEmpresa: resultado.idEmpresa,
        idUsuario: resultado.idUsuario,
      },
    });
  };

  cargarParametros = async () => {
    let paraApi: parametrosApi = new parametrosApi();
    let tmp = await paraApi.listaParametros();
    await this.setState({
      parametros: tmp.data,
    });
  };

  cargarDefecto = async () => {
    try {
      let basico: basicoDefault = new basicoDefault();
      let api: uniApi = new uniApi();
      let apiHomo: homoApi = new homoApi();
      let apiEmpresa: EmpresasApi = new EmpresasApi();

      let tmp = await apiEmpresa.empresasAlternasHomologable(
        this.state.login.idEmpresa
      );
      let tmp2 = await apiHomo.listaCiclos(this.state.login.idEmpresa);
      let tmp3 = await api.datosUnidades(
        parseInt(
          basico.buscarParametro("clase_tipo_uso", this.state.parametros)
        ),
        this.state.login.idEmpresa
      ); //tipo de uso
      let tmp4 = await api.datosUnidades(
        parseInt(
          basico.buscarParametro("clase_estrato", this.state.parametros)
        ),
        this.state.login.idEmpresa
      ); //estrato
      //let tmp5=await apiEmpresa.convenios(this.state.login.idEmpresa);
      await this.setState({
        ListaEmpresaAlternas: tmp.data,
        listaCiclo: tmp2.data,
        listaTipoUso: tmp3.data,
        listaEstrato: tmp4.data,
        dsusSeleccion: this.props.informacion,
        auxiliar: this.props.informacionAuxiliar,
        //listaConvenio:tmp5.data
        vistaColumnasBasica: JSON.parse(
          basico.buscarParametro(
            "vista_homologacion_basica",
            this.state.parametros
          )
        ),
      });
    } catch (e) {
      console.log(e);
    }
  };

  cargarListasEmpresa = async (empresa) => {
    let api: uniApi = new uniApi();
    let apiHomo: homoApi = new homoApi();
    let tmp2 = await apiHomo.listaCiclos(parseInt(empresa));
    let tmp3 = await api.datosUnidades(2, parseInt(empresa)); //tipo de uso
    let tmp4 = await api.datosUnidades(63, parseInt(empresa)); //estrato
    this.setState({
      listaCiclo: tmp2.data,
      listaTipoUso: tmp3.data,
      listaEstrato: tmp4.data,
    });
  };

  async cambioValorGeneral(
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) {
    const { value, name } = e.target;
    await this.setState({
      [name]: value,
    });
  }

  async cambioValor(e: any) {
    const { value, name } = e.target;
    await this.setState({
      homologacion: {
        ...this.state.homologacion,
        [name]: value,
      },
    });
  }

  async cambioValor2(
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) {
    const { value, name } = e.target;
    await this.setState({
      homologacion: {
        ...this.state.homologacion,
        [name]: value,
      },
    });
  }

  async cambioValor3(
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) {
    try {
      const { value, name } = e.target;

      //let apiEmpresa:EmpresasApi =new EmpresasApi();
      //let tmp5=await apiEmpresa.conveniosHomologables(this.state.login.idEmpresa,parseInt(value));
      //let convenioTmp=tmp5.data[0].cnre_ideregistr!=null ? tmp5.data[0].cnre_ideregistr : 0;
      await this.setState({
        homologacion: {
          ...this.state.homologacion,
          [name]: value,
          consumos: [0, 0, 0, 0, 0, 0],
          tipoUso: 0,
          estrato: 0,
          ciclo: 0,
          tipoUsoNombre: "",
          cicNombre: "",
          medidor: "",
          pcodigo: "",
          dsusIderegistro: Number,
          convenio: 0,
          //...this.state.homologacion,[name]:value,consumos:[0,0,0,0,0,0],tipoUso:0,estrato:0,ciclo:0,tipoUsoNombre:'',cicNombre:'',convenio:convenioTmp,
        },
        //listaConvenio:tmp5.data,
        dsusBusqueda: {},
      });
      this.cargarListasEmpresa(value);
    } catch (e) {
      console.log(e);
    }
  }

  async cambioValorEstado(
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) {
    const { value, name } = e.target;
    await this.setState({
      homologacion: {
        ...this.state.homologacion,
        [name]: value,
      },
    });
  }

  guardar = async () => {
    await this.setState({
      alerta: { variante: "", estado: false, valor: "" },
      estadoModal: false,
    });
    //if(this.validarConvenios()>0)
    if (0 > 1) {
      console.log("error...2");
      await this.setState({
        alerta: {
          variante: "warning",
          estado: true,
          valor: "NO tiene Permiso el convenio para homologar...",
        },
      });
    } else {
      let tercero = 0;
      let filtroConvenio = this.state.listaConvenio.filter(
        (item) =>
          item.cnre_ideregistr === parseInt(this.state.homologacion.convenio)
      );
      if ((this.state.homologacion.empresa == 322)) {
        tercero = this.state.dsusBusqueda.ter_ideregistro;
      } else {
        tercero = this.state.dsusSeleccion.ter_ideregistro;
      }
      let modelo1: HomologacionModel = new HomologacionModel(
        this.state.homologacion.convenio,
        filtroConvenio[0].cnre_nombre,
        tercero,
        this.state.login.idUsuario,
        this.state.login.idEmpresa,
        this.state.dsusSeleccion.per_ideregistro,
        this.state.dsusBusqueda.dsus_ideregistr,
        this.state.homologacion.empresa,
        this.state.dsusBusqueda.dsus_pcodigo,
        this.state.dsusSeleccion.sus_ideregistro,
        this.state.dsusBusqueda.sus_ideregistro,
        JSON.stringify(this.state.homologacion.consumos),
        this.state.dsusBusqueda.pro_idepropieda,
        this.state.homologacion.observaciones,
        this.state.homologacion.deshomologacion,
        this.props.informacion.dsus_ideregistr
      );
      this.props.guardarInfoHomologacion(modelo1);
    }
  };

  buscar = async () => {
    let condiciones = "";
    if (this.state.fechaBusqueda1 && this.state.fechaBusqueda2) {
      //condiciones=condiciones+' AND ghom_fecharegistro BETWEEN '+this.state.fechaBusqueda1+' AND '+this.state.fechaBusqueda2;
      condiciones =
        condiciones +
        ` AND DATE(ghom_fecharegistro) BETWEEN '` +
        this.state.fechaBusqueda1 +
        `' AND '` +
        this.state.fechaBusqueda2 +
        `'`;
    }
    if (this.state.empresa2 > 0) {
      //condiciones=condiciones+` AND dgho.emp_ideregistro=`+this.state.empresa2;
    }
    let gHomo: gestionApi = new gestionApi();
    let tmp = await gHomo.listaHomologaciones(
      this.state.dsusSeleccion.dsus_ideregistr,
      condiciones,
      this.state.empresa2
    );
    this.setState({
      listaHomologacion: tmp.data,
    });
  };

  consultar = () => {
    this.setState({ estado: 0 });
  };

  validarDeshomologacion1 = () => {
    if (
      parseInt(this.state.homologacion.dsusIderegistro) ===
        parseInt(this.props.informacion.dsus_ideregistr) ||
      this.state.homologacion.pcodigo === this.props.informacion.dsus_pcodigo ||
      this.state.homologacion.medidor === this.props.informacion.pro_idepropieda &&  
      this.state.homologacion.medidor.length>0
    ) {
      return true;
    } else {
      return false;
    }
  };

  validar = async () => {
    this.setState({
      alerta: { variante: "", estado: false, valor: "" },
      buscando1: true,
    });
    let resultado;
    let mensajeAdicional = "";
    let apiHomo: homoApi = new homoApi();
    let api: uniApi = new uniApi();
    let apiFac: facApi = new facApi();
    if (
      (parseInt(this.props.informacion.emp_ideregistro) ===
        parseInt(this.state.homologacion.empresa) &&
        this.state.homologacion.medidor.length === 0 &&
        this.state.homologacion.pcodigo.length === 0 &&
        isNaN(this.state.homologacion.dsusIderegistro)) ||
      this.validarDeshomologacion1()
    ) {
      console.log("entre al if...");
      resultado = await apiHomo.busquedaDsusHomo({
        dsus: this.props.informacion.dsus_ideregistr,
        medidor: "",
        pcodigo: "",
        empresa: this.state.homologacion.empresa,
        deshomologacion: true,
      });
      mensajeAdicional = "PROCESO DE DESHOMOLOGACION...";
      this.setState({
        homologacion: {
          ...this.state.homologacion,
          deshomologacion: true,
        },
      });
    } else {
      console.log("entre al else...");
      resultado = await apiHomo.busquedaDsusHomo({
        dsus: this.state.homologacion.dsusIderegistro,
        medidor: this.state.homologacion.medidor,
        pcodigo: this.state.homologacion.pcodigo,
        empresa: this.state.homologacion.empresa,
        deshomologacion: false,
      });
      this.setState({
        homologacion: {
          ...this.state.homologacion,
          deshomologacion: false,
        },
      });
    }
    //let resultado=await apiHomo.busquedaDsusHomo({"dsus":this.state.homologacion.dsusIderegistro,"medidor":this.state.homologacion.medidor,"pcodigo":this.state.homologacion.pcodigo,"empresa":this.state.homologacion.empresa});
    let tmpTipoUso = await api.datosUnidades(
      2,
      this.state.homologacion.empresa
    ); //tipo de uso
    let tmpCiclos = await apiHomo.listaCiclos(this.state.homologacion.empresa);
    //let convenioTmp=resultado.data[0].convenios[0].cnre_ideregistr!=null ? resultado.data[0].convenios[0].cnre_ideregistr : 0;
    let convenioTmp =
      resultado.data[0] != null
        ? resultado.data[0].convenios[0].cnre_ideregistr
        : 0;
    let valor = resultado.data[0];
    if (valor != null) {
      let tmpsaldoFacturas = await apiFac.saldoFacturas(
        this.props.informacion.dsus_ideregistr,
        //valor.dsus_ideregistr,
        this.state.homologacion.empresa
      );
      //console.log(tmpsaldoFacturas.data);
      this.setState({
        alerta: {
          variante: "success",
          estado: true,
          valor:
            "Convenio " +
            valor.cnre_nombre +
            " - Saldo facturas: $ " +
            new Intl.NumberFormat().format(tmpsaldoFacturas.data[0].saldo) +
            " - " +
            mensajeAdicional,
        },
        listaTipoUso: tmpTipoUso.data,
        listaCiclo: tmpCiclos.data,
        listaConvenio: resultado.data[0].convenios,
        homologacion: {
          ...this.state.homologacion,
          consumos: valor.consumos,
          tipoUso: valor.uni_tipusosuscr,
          estrato: valor.pro_catestrato,
          ciclo: valor.cic_ideregistro,
          medidor: valor.pro_idepropieda,
          pcodigo: valor.dsus_pcodigo,
          dsusIderegistro: valor.dsus_ideregistr,
          cicNombre: valor.cic_nombre,
          tipoUsoNombre: valor.uni_nombre1,
          convenio: convenioTmp,
        },
        dsusBusqueda: valor,
        buscando1: false,
      });
    } else {
      this.setState({
        alerta: {
          variante: "danger",
          estado: true,
          valor: "No se encontro suscripcion",
        },
        buscando1: false,
        homologacion: {
          ...this.state.homologacion,
          medidor: "",
          pcodigo: "",
          dsusIderegistro: null,
          consumos: [0, 0, 0, 0, 0, 0],
          tipoUso: 0,
          estrato: 0,
          ciclo: 0,
          cicNombre: "",
          tipoUsoNombre: "",
          convenio: convenioTmp,
        },
      });
    }
  };

  validarConvenios = (): number => {
    let condicion = 0;
    let filtroConvenio = this.state.listaConvenio.filter(
      (item) =>
        item.cnre_ideregistr === parseInt(this.state.homologacion.convenio)
    );
    if (
      this.state.dsusSeleccion.dsus_ideregistr ===
      this.state.dsusBusqueda.dsus_ideregistr
    ) {
      condicion = condicion + 1;
    }
    if (filtroConvenio[0].dicn_empfactura !== "S") {
      condicion = condicion + 1;
    }
    return condicion;
  };

  modalDetalles = async (e) => {
    let api: homoApi = new homoApi();
    let tmp = await api.informacionBasica(e.idSuscripcion);
    await this.setState({
      detallesBasicoTmp: tmp.data[0],
      modalDetalles: true,
    });
  };

  cambioModal = () => {
    this.setState({
      //estadoModal1:false
      modalDetalles: false,
    });
  };

  mostrarDetalles = (): any => {
    if (this.state.modalDetalles) {
      return (
        <div className="form-group">
          <Modal
            show={this.state.modalDetalles}
            onHide={this.cambioModal}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Informacion Basica</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <InfoBasicaComponent
                validacionEstado={this.state.estadoColumnasBasica}
                guardarAction={false}
                validacionVista={this.state.vistaColumnasBasica}
                informacion={this.state.detallesBasicoTmp}
                guardarInfoBasica={() => console.log("")}
              ></InfoBasicaComponent>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.cambioModal}>
                CERRAR
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    }
  };

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

  buscando = (): any => {
    if (this.state.buscando1) {
      return (
        <Row>
          <Col>
            <div className="form-group">
              <Spinner animation="border" variant="primary" />
              Buscando...
            </div>
          </Col>
        </Row>
      );
    }
  };

  mostrarAlerta = (): any => {
    if (this.state.alerta.estado) {
      return (
        <Row>
          <Col>
            <div className="form-group">
              <Alerta informacion={this.state.alerta}></Alerta>
            </div>
          </Col>
        </Row>
      );
    }
  };

  datosEmpresaAlterna = (): any => {
    if (
      parseInt(this.state.homologacion.empresa) === 322 ||
      parseInt(this.state.homologacion.empresa) === 317
    ) {
      return (
        <Card>
          <Card.Body>
            <Row>
              <Col>
                <div className="form-group">
                  <label>Informacion Gas Medidor</label>
                  <input
                    className="form-control"
                    onChange={(e) => this.cambioValor(e)}
                    name="medidor"
                    value={this.state.homologacion.medidor}
                    type="text"
                    placeholder=""
                  />
                </div>
              </Col>
              <Col>
                <div className="form-group">
                  <label>Codigo</label>
                  <input
                    className="form-control"
                    onChange={(e) => this.cambioValor(e)}
                    name="pcodigo"
                    value={this.state.homologacion.pcodigo}
                    type="text"
                    placeholder=""
                  />
                </div>
              </Col>
              <Col>
                <div className="form-group">
                  <label>Id Suscripcion</label>
                  <input
                    className="form-control"
                    onChange={(e) => this.cambioValor(e)}
                    name="dsusIderegistro"
                    value={this.state.homologacion.dsusIderegistro}
                    type="number"
                    placeholder=""
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="form-group">
                  <label>Observaciones</label>
                  <textarea
                    className="form-control"
                    onChange={(e) => this.cambioValor(e)}
                    name="observaciones"
                    value={this.state.homologacion.observaciones}
                    rows={3}
                    placeholder=""
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="form-group">
                  <label>Ultimos Consumo Gas</label>
                </div>
              </Col>
            </Row>
            <Row>
              {this.state.homologacion.consumos.map((e: any, index: number) => {
                if (index < 3) {
                  return (
                    <Col>
                      <div className="form-group">
                        <label> </label>
                        <input
                          className="form-control"
                          value={e}
                          type="text"
                          placeholder=""
                          disabled={true}
                        />
                      </div>
                    </Col>
                  );
                }
                return null;
              })}
            </Row>
            <Row>
              {this.state.homologacion.consumos.map((e: any, index: number) => {
                if (index >= 3) {
                  return (
                    <Col>
                      <div className="form-group">
                        <label> </label>
                        <input
                          className="form-control"
                          value={e}
                          type="text"
                          placeholder=""
                          disabled={true}
                        />
                      </div>
                    </Col>
                  );
                }
                return null;
              })}
            </Row>
            <Row>
              <Col>
                <div className="form-group">
                  <label>Tipo de Uso</label>
                  <input
                    className="form-control"
                    name="tipoUsoNombre"
                    value={this.state.homologacion.tipoUsoNombre}
                    type="text"
                    disabled={true}
                    placeholder=""
                  />
                </div>
              </Col>
              <Col>
                <div className="form-group">
                  <label>Estrato</label>
                  <input
                    className="form-control"
                    name="estrato"
                    value={this.state.homologacion.estrato}
                    type="text"
                    disabled={true}
                    placeholder=""
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="form-group">
                  <Button
                    variant="primary"
                    onClick={this.validar}
                    disabled={
                      this.state.homologacion.empresa === 0 ? true : false
                    }
                  >
                    Validar
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      );
    }
    if (
      parseInt(this.state.homologacion.empresa) === 299 ||
      parseInt(this.state.homologacion.empresa) === 300
    ) {
      return (
        <Card>
          <Card.Body>
            <Row>
              <Col>
                <div className="form-group">
                  <label>Codigo</label>
                  <input
                    className="form-control"
                    onChange={(e) => this.cambioValor(e)}
                    name="pcodigo"
                    value={this.state.homologacion.pcodigo}
                    type="text"
                    placeholder=""
                  />
                </div>
              </Col>
              <Col>
                <div className="form-group">
                  <label>Medidor</label>
                  <input
                    className="form-control"
                    onChange={(e) => this.cambioValor(e)}
                    name="medidor"
                    value={this.state.homologacion.medidor}
                    type="text"
                    placeholder=""
                  />
                </div>
              </Col>
              <Col>
                <div className="form-group">
                  <label>Consumo</label>
                  <input
                    className="form-control"
                    onChange={(e) => this.cambioValor2(e)}
                    name="consumo_5"
                    value={this.state.homologacion.consumos[0]}
                    type="text"
                    placeholder=""
                    disabled={true}
                  />
                </div>
              </Col>
              <Col>
                <div className="form-group">
                  <label>Ciclo</label>
                  <input
                    className="form-control"
                    name="cicNombre"
                    value={this.state.homologacion.cicNombre}
                    type="text"
                    placeholder=""
                    disabled={true}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="form-group">
                  <label>Observaciones</label>
                  <textarea
                    className="form-control"
                    onChange={(e) => this.cambioValor(e)}
                    name="observaciones"
                    value={this.state.homologacion.observaciones}
                    rows={3}
                    placeholder=""
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="form-group">
                  <Button
                    variant="primary"
                    onClick={this.validar}
                    disabled={
                      this.state.homologacion.empresa === 0 ? true : false
                    }
                  >
                    Validar
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      );
    }
  };

  renderEstado = (): any => {
    switch (this.state.estado) {
      case 0:
        return (
          <div>
            <Container>
              <Card className="mb-3">
                <Card.Header><strong>Información Suscripción</strong></Card.Header>
                <Card.Body>
                  <Row>
                    <Col>
                      <div className="form-group">
                        <label>Suscripción</label>
                        <input
                          className="form-control"
                          disabled={true}
                          value={this.props.informacion.ter_nomcompleto}
                          type="text"
                          placeholder=""
                        />
                      </div>
                    </Col>
                    <Col>
                      <div className="form-group">
                        <label>Código</label>
                        <input
                          className="form-control"
                          disabled={true}
                          value={this.props.informacion.dsus_pcodigo}
                          type="text"
                          placeholder=""
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="form-group">
                        <label>Dirección</label>
                        <input
                          className="form-control"
                          disabled={true}
                          value={this.props.informacion.pro_direccion}
                          type="text"
                          placeholder=""
                        />
                      </div>
                    </Col>
                    <Col>
                      <div className="form-group">
                        <label>Catastral</label>
                        <input
                          className="form-control"
                          disabled={true}
                          value={this.props.informacion.pro_numcatastral}
                          type="text"
                          placeholder=""
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="form-group">
                        <label>Convenio</label>
                        <input
                          className="form-control"
                          disabled={true}
                          value={this.props.informacion.cnre_nombre}
                          type="text"
                          placeholder=""
                        />
                      </div>
                    </Col>
                    <Col>
                      <div className="form-group">
                        <label>Empresa Homologada</label>
                        <input
                          className="form-control"
                          disabled={true}
                          value={this.props.informacion.Alterna}
                          type="text"
                          placeholder=""
                        />
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Header><strong>Proceso Homologación</strong></Card.Header>
                <Card.Body>
                  <Row>
                    <Col>
                      <div className="form-group">
                        <label>Convenio Actual</label>
                        <h5 style={{ color: "green", marginTop: "0.5rem" }}>
                          {this.state.dsusSeleccion.cnre_nombre}
                        </h5>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={4}>
                      <div className="form-group">
                        <label>Empresa Alterna</label>
                        <select
                          onChange={(e) => this.cambioValor3(e)}
                          className="form-control"
                          name="empresa"
                          value={this.state.homologacion.empresa}
                        >
                          <option value="0" key="0"></option>
                          {this.state.ListaEmpresaAlternas.map(
                            (e: any, key: number) => {
                              return (
                                <option key={key} value={e.empresa_sevemp}>
                                  {e.empresa_nom}
                                </option>
                              );
                            }
                          )}
                        </select>
                      </div>
                    </Col>
                    <Col sm={8}>
                      <div className="form-group">
                        <label>Convenio</label>
                        <select
                          onChange={(e) => this.cambioValor(e)}
                          disabled={true}
                          className="form-control"
                          name="convenio"
                          value={this.state.homologacion.convenio}
                        >
                          <option value="0" key="0"></option>
                          {this.state.listaConvenio.map((e: any, key: number) => {
                            return (
                              <option key={key} value={e.cnre_ideregistr}>
                                {e.cnre_nombre}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      {this.buscando()}
                      {this.mostrarAlerta()}
                      {this.datosEmpresaAlterna()}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Header><strong>Detalle Homologación</strong></Card.Header>
                <Card.Body>
                  <BootstrapTable
                    data={this.props.informacion.detalles}
                    keyField="idSuscripcion"
                    columns={this.state.columnasTabla}
                    rowStyle={{ fontSize: 12 }}
                    bootstrap4
                    striped={true}
                    hover={true}
                    condensed={true}
                    pagination={paginationFactory({})}
                    data-mobile-responsive="true"
                    wrapperClasses="table"
                    noDataIndication="No Hay Informacion..."
                  />
                </Card.Body>
              </Card>

              <Row>
                <Col>
                  <Button
                    variant="primary"
                    onClick={() => this.setState({ estadoModal: true })}
                    disabled={
                      this.state.homologacion.dsusIderegistro === null ||
                      this.state.homologacion.convenio === 0 ||
                      Object.entries(this.state.dsusBusqueda).length === 0 ||
                      !this.props.permisos?.EDIT
                        ? true
                        : false
                    }
                  >
                    Guardar
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="primary"
                    onClick={() => {
                      this.setState({ estado: 1 });
                    }}
                  >
                    Consultar
                  </Button>
                </Col>
              </Row>
            </Container>
          </div>
        );
      case 1:
        return (
          <div>
            <Container>
              <Row>
                <Col>
                  <div className="form-group">
                    <label>Desde</label>
                    <input
                      className="form-control"
                      onChange={(e) => this.cambioValorGeneral(e)}
                      name="fechaBusqueda1"
                      value={this.state.fechaBusqueda1}
                      type="date"
                      placeholder=""
                    />
                  </div>
                </Col>
                <Col>
                  <div className="form-group">
                    <label>Hasta</label>
                    <input
                      className="form-control"
                      onChange={(e) => this.cambioValorGeneral(e)}
                      name="fechaBusqueda2"
                      value={this.state.fechaBusqueda2}
                      type="date"
                      placeholder=""
                    />
                  </div>
                </Col>
                <Col>
                  <div className="form-group">
                    <label>Empresa Alterna</label>
                    <select
                      onChange={(e) => this.cambioValorGeneral(e)}
                      className="form-control"
                      name="empresa2"
                      value={this.state.empresa2}
                    >
                      <option value="0" key="0"></option>
                      {this.state.ListaEmpresaAlternas.map(
                        (e: any, key: number) => {
                          return (
                            <option key={key} value={e.empresa_sevemp}>
                              {e.empresa_nom}
                            </option>
                          );
                        }
                      )}
                    </select>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card className="mb-5">
                    <Card.Body>
                      <BootstrapTable
                        data={this.state.listaHomologacion}
                        keyField="SuscripcionAlterna"
                        columns={this.state.columnasTablaBuscar}
                        bootstrap4
                        striped={true}
                        hover={true}
                        pagination={paginationFactory({})}
                        data-mobile-responsive="true"
                        wrapperClasses="table"
                        noDataIndication="No Hay Informacion..."
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="form-group">
                    <Button
                      variant="primary"
                      disabled={
                        this.state.fechaBusqueda1 && this.state.fechaBusqueda2
                          ? false
                          : true
                      }
                      onClick={this.buscar}
                    >
                      Buscar
                    </Button>
                  </div>
                </Col>
                <Col>
                  <div className="form-group">
                    <Button variant="primary" onClick={this.consultar}>
                      Regresar
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="form-group"></div>
                </Col>
              </Row>
            </Container>
          </div>
        );
    }
  };

  render() {
    return (
      <div>
        {this.mostrarModal()}
        {this.renderEstado()}
        {this.mostrarDetalles()}
      </div>
    );
  }
}
export default InfoHomologacionComponent;
