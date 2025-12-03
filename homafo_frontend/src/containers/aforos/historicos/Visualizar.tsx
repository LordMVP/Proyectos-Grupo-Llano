import React, { Component } from "react";
import { Form, Col, Button, Card, Row } from "react-bootstrap";

import * as API_HISTORICOS from "../../../api/aforos/aforosHistoricos";
//import TableRotated from '../../../components/Table/TableRotated'
import { connect } from "react-redux";
import { loadTiposAforoMulti } from "../../../actions/aforos/selectsAforosMulti";

import { bindActionCreators } from "redux";

import ParparametrosAforoApi from "../../../api/aforos/ParParametrosAforoApi";
import basicoDefault from "../../../api/homologaciones/BasicoDefault";
import paginationFactory from "react-bootstrap-table2-paginator";
import cellEditFactory from "react-bootstrap-table2-editor";
import BootstrapTable from "react-bootstrap-table-next";
import ModalDetallesEditar from "../../../components/utils/ModalDetalleEdit";
import "../../../assets/editaforo.css";
import "../../../assets/aforosRealizados.css";
import Alerta from "../../../components/utils/AlertaComponent/AlertaComponent";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import homoApi from "../../../api/homologaciones/Homologacion";
import reportesApi from "../../../api/homologaciones/ReportesApi";
import JasperBridgeModel from "../../../models/JasperBridgeModel";
import usuarioApi from "../../../api/homologaciones/UsuariosApi";
import parametrosApi from "../../../api/homologaciones/ParParametrosApi";

///validar permisos
import PARAMETROS from "../../../data/constantes";
import SesionApi from "../../../api/common/SesionApi";
import UtilsFunction from "../../../components/utils/UtilsFunction";

import * as API from "../../../api/aforos/select";
import { H1 } from "@blueprintjs/core";
import "../../../assets/app.css";
import { IoMdPhotos } from "react-icons/io";
import ModalSlideFotos from "../../../containers/aforos/visitas/ModalSlideFotos";
import LiafocoApi from "../../../api/aforos/LiafocoApi";

const sesionApi = new SesionApi();

type FormEvent = React.FormEvent<HTMLFormElement>;

/*type TAforosConsolidados= {
  totalNumeroVisitas:number;
  totalVolumenM3:number;
  totalVolumenMes:number;
  factorProduccion:number;
  tipo:string;
  tafna:string;
  detalles: any[];
};*/

const CapElementVisitasRealizadas = () => (
  <h3
    style={{
      borderRadius: "0.25em",
      textAlign: "center",
      color: "black",
      border: "1px solid black",
      padding: "0.5em",
    }}
  >
    Visitas Realizadas
  </h3>
);

//const CapElementMultiusuario=() => <h3 style={{ borderRadius: '0.25em', textAlign: 'center',
//color: 'black', border: '1px solid black', padding: '0.5em' }}>Informacion Basica</h3>;

class ItemSuscriptor {
  id: string;
  codigo: string;
  nombre: string;
  direccion: string;
  nombreBarrio: string;
  porcentaje: number;
  numpqr: string;
  actividad: string;
  iasus_nombreestablecimiento: string;
  iasus_referenciacomercial: string;
  tafna: string;
  estadoSuscriptor: string;
  tipoUsoSuscriptor: string;

  constructor(
    id: string,
    codigo: string,
    nombre: string,
    direccion: string,
    nombreBarrio: string,
    porcentaje: number,
    numpqr: string,
    actividad: string,
    iasus_nombreestablecimiento: string,
    iasus_referenciacomercial: string,
    tafna: string,
    estadoSuscriptor: string,
    tipoUsoSuscriptor: string
  ) {
    this.id = id;
    this.codigo = codigo;
    this.nombre = nombre;
    this.direccion = direccion;
    this.nombreBarrio = nombreBarrio;
    this.porcentaje = porcentaje;
    this.numpqr = numpqr;
    this.actividad = actividad;
    this.iasus_nombreestablecimiento = iasus_nombreestablecimiento;
    this.iasus_referenciacomercial = iasus_referenciacomercial;
    this.tafna = tafna;
    this.estadoSuscriptor = estadoSuscriptor;
    this.tipoUsoSuscriptor = tipoUsoSuscriptor;
  }
}

class Visualizar extends Component<
  {
    actions: any;
    selectsMulti: any;
    history: any;
    location: any;
    selects: any;
  },
  {}
> {
  /*const selectOptions = {
    0: 'good',
    1: 'Bad',
    2: 'unknown'
  };
  */

  state = {
    lastBarrio: "",

    vigenciaDesde: "",
    //vigenciaHasta: "",
    codigoBase: "",
    hafomDescripcion: "",
    vigenciaFinal: "",
    fechaCreacion: "",
    fechaActualizacion: "",
    observaciones: "",
    tipoAforo: "",
    claseSuscripcion: "",
    tipoDistribucion: "",
    nombreTipoDistribucion: "",

    afom_distribucion: "",
    nombre: "",
    codigoSus: "",
    cantidad: "",
    suscripcionesList: [],
    uni_tipoaforo: 0,
    afo_estado: "",
    estados: [],
    parametros: [],
    tiposDistribucion: [{ nombre: "", valor: "" }],
    mafv_factor: "",
    radicado: "",

    municipio: "",
    idMunicipio: "",
    fechaInicio: "",

    aforos_realizados: [
      {
        idAforo: 0,
        numeroVisita: "",
        idMaestro: 0,
        fechaVisita: "",
        dia: "",
        aforador: "",
        semana: "",
        volumen: "",
        total: {},
        estado: "",
        observaciones: "",
        detalles: {
          tipoRecipiente: "",
          dimensiones: "",
          cantidadRecipientes: 0,
          equivalencia: 0.0,
          total: 0.0,
          totalCantidadRecipientes: 0,
          totalTotales: 0.0,
          observaciones: "",
        },
      },
    ],

    aforos_pendientes: [],

    info_basica: false,

    detalle_registro_aforo: false,
    consolidado_aforos: false,
    info_reporte: false,
    alerta: {
      variante: "",
      estado: false,
      valor: "",
    },
    busqueda: {
      idAforo: "",
      fechaInicio: "",
      fechaFinal: "",
      pqrs: "",
      pcodigo: "",
      terCliente: "",
      terAforador: "",
    },
    terceros: [],
    terceroSeleccion: [],
    aforadores: [],
    idUsuario: 0,
    idEmpresa: 0,
    password: "",
    usuNombre: "",
    configuracion: {},
    cargandoTercero: false,
  // liquidaciones traidas por hafo (mini tabla en Consolidado Aforo)
  liquidaciones: [],
  cargandoLiquidaciones: false,
    permissions: [],
    effectivePermissions: {
      EDIT: false,
      VIEW: false,
      CREATE: false,
      SAVE: false,
      DELETE: false,
      QUERY: false,
    },
    showModalRegistro: false,
    showModalSave: false,
    aforosmulti_consolidados: {
      cargo_variable: "23",
      cargo_fijo: "23",
      vol_medio: "23",
      data: [],
    },
    actividadOptions: [],

    suscriptorListColumns: [
      {
        dataField: "id",
        text: "Id Suscripcion",
        short: true,
        align: "center",
        headerAlign: "center",
        editable: false,
        footerAlign: "center",
        footer: "Total",
      },
      {
        dataField: "codigo",
        text: "Codigo",
        align: "center",
        headerAlign: "center",
        editable: false,
        footerAlign: "center",
        footer: <span></span>,
      },
      {
        dataField: "tipoUsoSuscriptor",
        text: "Tipo Uso",
        align: "center",
        headerAlign: "center",
        editable: false,
        footerAlign: "center",
        footer: <span></span>,
      },
      {
        dataField: "estadoSuscriptor",
        text: "Estado",
        align: "center",
        headerAlign: "center",
        editable: false,
        footerAlign: "center",
        footer: <span></span>,
      },
      {
        dataField: "nombre",
        text: "Nombre",
        align: "center",
        headerAlign: "center",
        editable: false,
        footerAlign: "center",
        footer: <span></span>,
      },
      {
        dataField: "direccion",
        text: "Dirección",
        align: "center",
        headerAlign: "center",
        editable: false,
        footerAlign: "center",
        footer: <span></span>,
      },
      {
        dataField: "nombreBarrio",
        text: "Barrio",
        align: "center",
        headerAlign: "center",
        editable: false,
        hidden: true,
        footerAlign: "center",
        footer: <span></span>,
      },
      {
        dataField: "porcentaje",
        text: "Porcentaje",
        align: "center",
        headerAlign: "center",
        editable: false,
        footerAlign: "center",
        footer: (columnData) =>
          columnData
            .reduce((acc, item) => acc + parseFloat(item), 0)
            .toFixed(3),
      },
      {
        dataField: "numpqr",
        text: "Radicado PQR",
        align: "center",
        headerAlign: "center",
        editable: false,
        hidden: true,
        footerAlign: "center",
        footer: <span></span>,
      },
      {
        dataField: "actividad",
        text: "Actividad",
        align: "center",
        headerAlign: "center",
        editable: false,
        footerAlign: "center",
        footer: <span></span>,
      },
      {
        dataField: "iasus_nombreestablecimiento",
        text: "Santo y seña",
        align: "center",
        headerAlign: "center",
        editable: false,
        footerAlign: "center",
        footer: <span></span>,
      },
      {
        dataField: "iasus_referenciacomercial",
        text: "Referencia comercial",
        align: "center",
        headerAlign: "center",
        editable: false,
        footerAlign: "center",
        footer: <span></span>,
      },
      {
        dataField: "tafna",
        text: "Tafna",
        align: "center",
        headerAlign: "center",
        editable: false,
        footerAlign: "center",
        footer: (columnData) =>
          columnData
            .reduce((acc, item) => acc + parseFloat(item), 0)
            .toFixed(6),
      },
    ],

    columnsRealizados: [
      {
        dataField: "fechaVisita",
        text: "Fecha Visita",
        sort: true,
        editable: false,
        footer: "",
        align: "center",
        headerAlign: "center",
        footerAlign: "center",
      },
      {
        dataField: "aforador",
        text: "Aforador",
        sort: true,
        editable: false,
        footer: "",
        align: "center",
        headerAlign: "center",
        footerAlign: "center",
      },
      {
        dataField: "semana",
        text: "Semana",
        sort: true,
        editable: false,
        footer: "TOTAL",
        align: "center",
        headerAlign: "center",
        footerAlign: "center",
      },
      {
        dataField: "numeroVisita",
        text: "Numero Visita",
        sort: true,
        editable: false,
        footer: "",
        align: "center",
        headerAlign: "center",
        footerAlign: "center",
      },
      {
        dataField: "dia",
        text: "Día",
        sort: true,
        editable: false,
        footer: "",
        align: "center",
        headerAlign: "center",
        footerAlign: "center",
      },
      {
        dataField: "volumen",
        formatter: (row) => parseFloat(row).toFixed(6),
        text: "Volumen Total",
        editable: false,
        align: "center",
        headerAlign: "center",
        footerAlign: "center",
        sort: true,
        footer: (row) =>
          row.reduce((acc, item) => acc + parseFloat(item), 0).toFixed(6),
      },
      {
        dataField: "peso",
        formatter: (row) => Number(row).toFixed(6),
        text: "Peso Total",
        editable: false,
        align: "center",
        headerAlign: "center",
        footerAlign: "center",
        sort: true,
        footer: (columnData) =>
          columnData
            .reduce((acc, item) => acc + parseFloat(item), 0)
            .toFixed(6),
      },
      {
        dataField: "idAforadorVisitaButton",
        text: "Detalles",
        align: "center",
        headerAlign: "center",
        footerAlign: "center",
        editable: false,
        formatter: (rowContent, row: any) => {
          if (rowContent || row) {
          }
          return (
            <Button
              variant="primary"
              onClick={() => this.handleOpenModal(row.numeroVisita)}
            >
              Detalles{" "}
            </Button>
          );
        },
      },
      {
        dataField: "",
        text: "Detalles",
        align: "center",
        footerAlign: "center",
        headerAlign: "center",
        editable: false,
        formatter: (rowContent, row: any) => {
          return (
            <Button
              variant="secondary"
              key={rowContent}
              onClick={() => this.cargarfotosDatos(row)}
            >
              VER
              <IoMdPhotos />
            </Button>
          );
        },
      },
    ],

    detalleSelected: [],
    observacionesSelect: "",
    Totales: [],
    showModal: false,

    columnsPendientes: [
      {
        dataField: "numeroVisita",
        text: "Numero Visita",
        editable: false,
        sort: true,
        align: "center",
        headerAlign: "center",
      },
      {
        dataField: "fechaVisita",
        text: "Fecha Programación",
        editable: false,
        sort: true,
        align: "center",
        headerAlign: "center",
      },
      {
        dataField: "aforador",
        text: "Tecnico Aforador",
        editable: false,
        sort: true,
        align: "center",
        headerAlign: "center",
      },
    ],
    columnsConsolidadosx: [
      {
        dataField: "mes",
        formatter: (row) => {
          return <span>{row}</span>;
        },
        text: "Mes",
        short: true,
        editable: false,
        align: "center",
        headerAlign: "center",
        footer: "TOTALES:",
        footerAlign: "center",
      },
      {
        dataField: "numeroVisitas",
        text: "Num visitas",
        align: "center",
        headerAlign: "center",
        editable: false,
        footerAlign: "center",
        footer: (columnData) => columnData.reduce((acc, item) => acc + item, 0),
      },
      {
        dataField: "volumenM3",
        formatter: (cell) => cell.toFixed(3),
        text: "Volumen (m3)",
        align: "center",
        headerAlign: "center",
        editable: false,
        footerAlign: "center",
        footer: (columnData) =>
          columnData.reduce((acc, item) => acc + item, 0).toFixed(3),
      },
      {
        dataField: "volumenMes",
        formatter: (row) => Number(row).toFixed(3),
        text: "Peso (k)",
        align: "center",
        headerAlign: "center",
        editable: false,
        footerAlign: "center",
        footer: (columnData) =>
          columnData.reduce((acc, item) => acc + item, 0).toFixed(3),
      },
    ],
    columnsConsolidadosx2: [
      {
        dataField: "numAforo",
        text: "Aforo",
        align: "center",
        headerAlign: "center",
        editable: false,
        footerAlign: "center",
        footer: "Dif: ",
      },
      {
        dataField: "totalVolumenM3",
        formatter: (cell) => cell.toFixed(3),
        text: "Volumen (m3)",
        align: "center",
        headerAlign: "center",
        editable: false,
        footerAlign: "center",
        footer: (row) =>
          row.reduce((acc, item) =>
            acc - item < 0 ? (
              <span className="p-1 m-1 bg-danger text-white ">
                {(acc - item).toFixed(3)}
              </span>
            ) : (
              <span className="p-1 m-1 bg-info text-white ">{(acc - item).toFixed(3)}</span>
            )
          ),
      },
      {
        dataField: "tafna",
        formatter: (cell) => parseFloat(cell).toFixed(3),
        text: "Tafna",
        align: "center",
        headerAlign: "center",
        editable: false,
        footerAlign: "center",
        footer: (row) =>
          row.reduce((acc, item) =>
            acc - item < 0 ? (
              <span className="p-1 m-1 bg-danger text-white ">
                {(acc - item).toFixed(3)}
              </span>
            ) : (
              <span className="p-1 m-1 bg-info text-white ">
                {(acc - item).toFixed(3)}
              </span>
            )
          ),
      },
    ],
    aforos_consolidados: {} as any, //TAforosConsolidados,
    ShowModalSlideFotos: false,
    datosFotos: {
      dia: "",
      semana: "",
      idDmaf: 0,
      fechaEjecucion: "",
      observaciones: "",
    },
  };

  callDataApi = async () => {
    await API_HISTORICOS.GetAforosHistoricosById(
      this.props.location.state.idAforo
    ).then((response) => {
      if (response.success === true) {
        console.log(
          "que llego de la cosnulta///////////////// ",
          response.data
        );
        this.setState({
          lastBarrio: response.data[0].barrio,
          afo_estado: response.data[0].estado,
          vigenciaDesde: response.data[0].vigenciaDesde,
          //vigenciaHasta: response.data[0].vigenciaHasta,
          vigenciaFinal: response.data[0].vigenciaFinal,
          fechaCreacion: response.data[0].fechaCreacion,
          fechaActualizacion: response.data[0].fechaActualizacion,
          observaciones: response.data[0].observaciones,
          hafomDescripcion: response.data[0].hafomDescripcion,
          codigoBase: response.data[0].codigoBase,
          suscripcionesList: response.data.map((i) => {
            let itemNew: ItemSuscriptor = new ItemSuscriptor(
              i.idSuscriptor,
              i.codigoSuscriptor,
              i.nombreSuscriptor,
              i.direccion,
              i.barrio,
              i.porcentaje,
              i.numpqrSuscriptor,
              i.actividad,
              i.nombreEstablecimiento,
              i.referenciaComercial,
              i.tafna,
              i.estadoSuscriptor,
              i.tipoUsoSuscriptor
            );
            return itemNew;
          }),
          claseSuscripcion: response.data[0].claseSuscripcion,
          tipoAforo: response.data[0].tipoAforo,
          mafv_factor: response.data[0].factor,
          tipoDistribucion: response.data[0].tipoDistribucion,
          radicado: response.data[0].numpqrSuscriptor, //Agregamos radicado
        });
      }
    });

    for (var i = 0; i < this.state.tiposDistribucion.length; i++) {
      // look for the entry with a matching `code` value
      if (this.state.tiposDistribucion[i].valor == "4") {
        this.setState({
          nombreTipoDistribucion: this.state.tiposDistribucion[i].nombre,
        });
      }
    }
    await API_HISTORICOS.GetHistoricoDetalleVisitasByIdAforo(
      this.props.location.state.idAforo
    )
      .then((response) => {
        //console.log('que teiene visitas/////////////////////// ',response.data);
        console.log(response);
        const aforoRealizados = response.data.filter((item) => {
          return item.estado !== "P";
        });
        const aforosPendientes = response.data.filter((item) => {
          return item.estado !== "T";
        });
        this.setState({ aforos_realizados: aforoRealizados });
        this.setState({ aforos_pendientes: aforosPendientes });
      })
      .catch((error) => {
        return Promise.reject(error.status);
      }); //end .catch-AforosRealizados y pendiente T-P

    //obteniendo consolidados
    await API_HISTORICOS.GetHistoricoAforoConsolidado(
      this.props.location.state.idAforo,
      this.props.location.state.numAforoPadre
    )
      .then(
        (response) => {
          console.log("respuesta consolidado",response)
          if (response.success === true) {
            this.setState({ aforos_consolidados: response.data });
            return response;
          }
          return response;
        } //end.then-consolidado
      )
      .catch((error) => {
        return Promise.reject(error.status);
      }); //end .catch-consolidado
  }; //end callDataApi

  componentDidMount = async () => {
    let paraApiAforo: ParparametrosAforoApi = new ParparametrosAforoApi();
    let tmp = await paraApiAforo.listaParametros();
    await this.setState({
      parametros: tmp.data,
    });

    let basico: basicoDefault = new basicoDefault();
    await this.setState({
      estados: await JSON.parse(
        basico.buscarParametro("estados", this.state.parametros)
      ),
    });

    await this.setState({
      tiposDistribucion: await JSON.parse(
        basico.buscarParametro("tipos_distribucion", this.state.parametros)
      ),
    });

    await this.callDataApi();
    //console.log('que tiene consolidado/////////////////////////////// ',this.state.aforos_consolidados);
    ///reportes
    this.cargarDatosReportes();
    this.cargarParametros();
    await sesionApi
      .loadPermisos(PARAMETROS.AFORO_LIQUIDACION.PROGRAMA_ID)
      .then((response) => {
        this.setState({ permissions: response.data });
      });
    await this.cargarPermisos();
    API.getTecnicoAforador()
      .then((response) => {
        console.log("response tecnicos aforadores:", response.data);

        this.setState({ aforadores: response.data });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ errorMessage: error });
      });
  };

  cargarPermisos = async () => {
    let effectivePermission = UtilsFunction.getEffectivePermissions(
      this.state.permissions,
      "AFORO_LIQUIDACION"
    );
    await this.setState({ effectivePermissions: effectivePermission });
  };

  cargarDatosReportes = async () => {
    let usuApi: usuarioApi = new usuarioApi();
    let tmp = await usuApi.datosReportes(this.state.idUsuario);
    let resultado = tmp.data[0];
    this.setState({
      password: resultado.passwd,
      idUsuario: resultado.usu_ideregistro,
      idEmpresa: resultado.idEmpresa,
      usuNombre: resultado.usuario_nom,
    });
  };

  cargarParametros = async () => {
    let paraApi: parametrosApi = new parametrosApi();
    let tmp = await paraApi.listaParametros();
    await this.setState({
      configuracion: tmp.data,
    });
  };

  changeAccordionStatus = (e: any) => {
    const { name } = e.target;
    // toggle state and if opening the consolidado_aforos panel, fetch liquidaciones
    this.setState(
      (prevState: any) => ({ [name]: !prevState[name] }),
      async () => {
        try {
          if (
            name === "consolidado_aforos" &&
            this.state.consolidado_aforos &&
            (!this.state.liquidaciones || this.state.liquidaciones.length === 0)
          ) {
            await this.fetchLiquidacionesPorHafo();
          }
        } catch (err) {
          console.error("Error fetching liquidaciones:", err);
        }
      }
    );
  };

  fetchLiquidacionesPorHafo = async () => {
    // intenta obtener el id del aforo desde aforos_consolidados[0].numAforo
    try {
      const hafoId = this.state.aforos_consolidados?.[0]?.numAforo;
      if (!hafoId) {
        // nada que hacer si no hay id
        return;
      }
      this.setState({ cargandoLiquidaciones: true });

      const liafocoApi = new LiafocoApi();
      const response = await liafocoApi.obtenerLiquidacionesPorHafo(hafoId);

      // backend retorna { mensaje: string, data: [...] }
      const body = response.data;
      const data = body && body.data ? body.data : [];

      // solo guardamos arreglo (o vacío)
      this.setState({ liquidaciones: Array.isArray(data) ? data : [] });
    } catch (e) {
      console.error("fetchLiquidacionesPorHafo error", e);
      this.setState({ liquidaciones: [] });
    } finally {
      this.setState({ cargandoLiquidaciones: false });
    }
  };

  cambiarEstadoCobro = async (liafocoId: number, estadoActual: boolean) => {
    try {
      const nuevoEstado = !estadoActual;
      const liafocoApi = new LiafocoApi();
      
      await liafocoApi.cambiarEstadoCobro(liafocoId, nuevoEstado);
      
      // Actualizar el estado local de liquidaciones
      const liquidacionesActualizadas = this.state.liquidaciones.map((l: any) => 
        l.liafocoIderegistro === liafocoId 
          ? { ...l, liafocoCobro: nuevoEstado }
          : l
      );
      
      this.setState({ liquidaciones: liquidacionesActualizadas });
      
      this.llamarAlerta("success", `Estado de cobro actualizado a: ${nuevoEstado ? "Sí" : "No"}`);
    } catch (e) {
      console.error("Error al cambiar estado de cobro", e);
      this.llamarAlerta("danger", "Error al actualizar el estado de cobro");
    }
  };

  formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  };

  onSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  handleOpenModal = (numeroVisita: any) => {
    const filtered = this.state.aforos_realizados.filter(
      (data) => data.numeroVisita === numeroVisita
    );
    console.log("filtrado");
    console.log(filtered);
    if (filtered.length) {
      const detalleSelec = [filtered[0].detalles];
      if (detalleSelec.length) {
        this.setState({ detalleSelected: detalleSelec[0] });
        this.setState({ observacionesSelect: filtered[0].observaciones });
        this.setState({
          Totales: [
            detalleSelec[0][0].totalCantidadRecipientes,
            detalleSelec[0][0].totalTotales,
          ],
        });
        this.setState({ showModal: true });
      }
    }
  };

  handleModalClose = () => {
    this.setState({ showModal: false });
  };

  mostrarAlerta = (): any => {
    if (this.state.alerta.estado) {
      return <Alerta informacion={this.state.alerta}></Alerta>;
    }
  };

  async cambioValorBusqueda(
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) {
    const { value, name } = e.target;

    await this.setState({
      busqueda: {
        ...this.state.busqueda,
        [name]: value,
      },
    });
  }
  cambioValorTercero = (e: any) => {
    ///console.log(e);
    if (e[0] !== undefined) {
      this.setState({
        busqueda: {
          ...this.state.busqueda,
          terCliente: e[0].ter_ideregistro,
        },
        terceroSeleccion: [e[0]],
      });
    } else {
      this.setState({
        terceroSeleccion: [],
      });
    }
  };

  buscarTercero = async (e: any) => {
    let api: homoApi = new homoApi();
    await this.setState({
      cargandoTercero: true,
    });
    let tmp = await api.buscarNombreTercero(e);
    await this.setState({
      terceros: tmp.data,
      cargandoTercero: false,
    });
  };

  llamarAlerta = (tmp1: string, tmp2: string) => {
    this.setState({
      alerta: {
        ...this.state.alerta,
        estado: true,
        variante: tmp1,
        valor: tmp2,
      },
    });
    setTimeout(() => {
      this.setState({
        alerta: {
          ...this.state.alerta,
          estado: false,
          variante: "",
          valor: "",
        },
      });
    }, 3000);
  };

  generarReporteDetalle = async () => {
    try {
      let basico: basicoDefault = new basicoDefault();
      let api: reportesApi = new reportesApi();
      let condiciones = " ";
      let subCondiciones = " ";
      debugger;
      let nombreReporte = this.state.claseSuscripcion && this.state.claseSuscripcion.toUpperCase() === "INDIVIDUAL" ? "detalle_aforo" : "Aforos/PS2-1190_detallado_resultado_aforo_multiusuario";
      this.setState({
        cargando: true,
      });
      if (this.state.busqueda.idAforo.length > 0) {
        condiciones =
          condiciones +
          " AND afo.hafo_ideregistro=" +
          this.state.busqueda.idAforo;
      }
      if (this.state.busqueda.pcodigo.length > 0) {
        condiciones =
          condiciones +
          " AND dsus.dsus_pcodigo=" +
          `'` +
          this.state.busqueda.pcodigo +
          `'`;
      }
      if (this.state.busqueda.pqrs.length > 0) {
        condiciones =
          condiciones + " AND afo.hafo_numpqr=" + this.state.busqueda.pqrs;
      }
      if (this.state.busqueda.terAforador.length > 0) {
        condiciones =
          condiciones +
          " AND afo.ter_aforador=" +
          this.state.busqueda.terAforador;
      }
      if (this.state.busqueda.terCliente.length > 0) {
        condiciones =
          condiciones +
          " AND dsus.ter_ideregistro=" +
          this.state.busqueda.terCliente;
      }

      ///sub
      if (
        this.state.busqueda.fechaInicio.length > 0 &&
        this.state.busqueda.fechaFinal.length > 0
      ) {
        subCondiciones =
          subCondiciones +
          " AND dmaf.hdmaf_fechavisita::DATE BETWEEN" +
          `'` +
          this.state.busqueda.fechaInicio +
          `'` +
          " AND " +
          `'` +
          this.state.busqueda.fechaFinal +
          `'`;
      }

      let parametros = {
        PR_STR_FECHA1: this.state.busqueda.fechaInicio,
        PR_STR_FECHA2: this.state.busqueda.fechaFinal,
        PR_STR_CONDICIONES: condiciones,
        PR_STR_SUB_CONDICIONES: subCondiciones,
        PR_STR_USUARIO: this.state.usuNombre,
        PR_INT_EMPRESA: this.state.idEmpresa,
        PR_INT_AFO_IDEREGISTRO: parseInt(this.props.location.state.idAforo),
        PR_STR_ROOT_PATH: basico
          .buscarParametro("url_reportes", this.state.configuracion)
          .replace(/['"]+/g, ""),
      };
      let modelo: JasperBridgeModel = new JasperBridgeModel(
        basico
          .buscarParametro("jdni_reportes", this.state.configuracion)
          .replace(/['"]+/g, ""),
        "pdf",
        basico
          .buscarParametro("url_reportes", this.state.configuracion)
          .replace(/['"]+/g, "") +
          nombreReporte +
          ".jrxml",
        this.state.idUsuario.toString(),
        this.state.password,
        parametros
      );
      let resultado = await api.generarDetalleAforo(
        modelo,
        basico
          .buscarParametro("url_api_reportes", this.state.configuracion)
          .replace(/['"]+/g, "")
      );
      console.log("que envie ", parametros);

      let base64str = resultado.content;
      //console.log('que llego del reporte ',resultado);
      // decode base64 string, remove space for IE compatibility
      var binary = atob(base64str.replace(/\s/g, ""));
      var len = binary.length;
      var buffer = new ArrayBuffer(len);
      var view = new Uint8Array(buffer);
      for (var i = 0; i < len; i++) {
        view[i] = binary.charCodeAt(i);
      }

      this.setState({
        cargando: false,
      });

      // create the blob object with content-type "application/pdf"
      var blob = new Blob([view], { type: "application/pdf" });
      if (blob.size < 1000) {
        this.llamarAlerta("warning", "No hay Informacion para mostrar... ");
      } else {
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = nombreReporte + ".pdf";
        link.click();
      }
    } catch (e) {
      this.setState({
        cargando: false,
      });
      this.llamarAlerta("warning", "No hay Informacion para mostrar... ");
    }
  };

  generarReporteLiquidacion = async () => {
    try {
      let basico: basicoDefault = new basicoDefault();
      let api: reportesApi = new reportesApi();
      let condiciones = " ";
      let subCondiciones = " ";
      let nombreReporte = this.state.claseSuscripcion && this.state.claseSuscripcion.toUpperCase() === "INDIVIDUAL" ? "Aforos/liquidacion_aforo" : "Aforos/PS2-1189_consolidado_aforo_multiusuario";
      this.setState({
        cargando: true,
      });
      if (this.state.aforos_consolidados[0].numAforo){
        condiciones =
          condiciones +
          " AND afo.hafo_ideregistro=" +
          this.state.aforos_consolidados[0].numAforo;
      }
      if (this.state.busqueda.idAforo.length > 0) {
        condiciones =
          condiciones +
          " AND afo.hafo_ideregistro=" +
          this.state.busqueda.idAforo;
      }
      if (this.state.busqueda.pcodigo.length > 0) {
        condiciones =
          condiciones +
          " AND dsus.dsus_pcodigo=" +
          `'` +
          this.state.busqueda.pcodigo +
          `'`;
      }
      if (this.state.busqueda.pqrs.length > 0) {
        condiciones =
          condiciones + " AND afo.hafo_numpqr=" + this.state.busqueda.pqrs;
      }
      if (this.state.busqueda.terAforador.length > 0) {
        condiciones =
          condiciones +
          " AND afo.ter_aforador=" +
          this.state.busqueda.terAforador;
      }
      if (this.state.busqueda.terCliente.length > 0) {
        condiciones =
          condiciones +
          " AND dsus.ter_ideregistro=" +
          this.state.busqueda.terCliente;
      }

      let parametros = {
        PR_STR_FECHA1: this.state.busqueda.fechaInicio,
        PR_STR_FECHA2: this.state.busqueda.fechaFinal,
        PR_STR_CONDICIONES: condiciones,
        PR_STR_SUB_CONDICIONES: subCondiciones,
        PR_STR_USUARIO: this.state.usuNombre,
        PR_INT_EMPRESA: this.state.idEmpresa,
        PR_INT_AFO_IDEREGISTRO: parseInt(this.props.location.state.idAforo),
        PR_STR_ROOT_PATH: basico
          .buscarParametro("url_reportes", this.state.configuracion)
          .replace(/['"]+/g, "")+"Aforos/",
      };
      let modelo: JasperBridgeModel = new JasperBridgeModel(
        basico
          .buscarParametro("jdni_reportes", this.state.configuracion)
          .replace(/['"]+/g, ""),
        "pdf",
        basico
          .buscarParametro("url_reportes", this.state.configuracion)
          .replace(/['"]+/g, "") +
          nombreReporte +
          ".jrxml",
        this.state.idUsuario.toString(),
        this.state.password,
        parametros
      );
      let resultado = await api.generarDetalleAforo(
        modelo,
        basico
          .buscarParametro("url_api_reportes", this.state.configuracion)
          .replace(/['"]+/g, "")
      );

      let base64str = resultado.content;
      // decode base64 string, remove space for IE compatibility
      var binary = atob(base64str.replace(/\s/g, ""));
      var len = binary.length;
      var buffer = new ArrayBuffer(len);
      var view = new Uint8Array(buffer);
      for (var i = 0; i < len; i++) {
        view[i] = binary.charCodeAt(i);
      }

      this.setState({
        cargando: false,
      });

      // create the blob object with content-type "application/pdf"
      var blob = new Blob([view], { type: "application/pdf" });
      if (blob.size < 1000) {
        this.llamarAlerta("warning", "No hay Informacion para mostrar... ");
      } else {
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = nombreReporte + ".pdf";
        link.click();
      }
    } catch (e) {
      this.setState({
        cargando: false,
      });
      this.llamarAlerta("warning", "No hay Informacion para mostrar... ");
    }
  };

  cargarfotosDatos = async (row: any) => {
    //console.log('que llego de row ',row);
    await this.setState({
      datosFotos: {
        ...this.state.datosFotos,
        dia: row.dia,
        semana: row.semana,
        fechaEjecucion: row.fechaVisita,
        observaciones: row.observaciones,
        idDmaf: row.consecutivo,
      },
      ShowModalSlideFotos: true,
    });
    //console.log('que tiene datosFotos ',this.state.datosFotos);
  };

  render() {
    const {
      lastBarrio,
      vigenciaDesde,
      //vigenciaHasta,
      vigenciaFinal,
      observaciones,
      info_basica,
      detalle_registro_aforo,
      consolidado_aforos,
      info_reporte,
      radicado,
      codigoBase,
      hafomDescripcion,
    } = this.state;
    return (
      <div>
        <Form className="mb-2" onSubmit={this.onSubmit}>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>Barrio</Form.Label>
              <Form.Control
                name="lastBarrio"
                value={lastBarrio}
                readOnly
              ></Form.Control>
            </Form.Group>

            <Form.Group md="2" as={Col} controlId="afo_estado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                name="afo_estado"
                value={this.state.afo_estado}
                readOnly
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Vigencia Desde</Form.Label>
              <Form.Control
                placeholder="Vigencia"
                type="date"
                name="vigenciaDesde"
                value={vigenciaDesde}
                required
                readOnly
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Vigencia Final</Form.Label>
              <Form.Control
                placeholder="Vigencia"
                type="date"
                name="vigenciaFinal"
                value={vigenciaFinal}
                required
                readOnly
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group
              md="3"
              as={Col}
              controlId="formGridEmail"
              className="sm-2"
            >
              <Form.Label>Fecha creación</Form.Label>
              <Form.Control
                placeholder="creación"
                type="date"
                name="fechaCreacion"
                value={this.state.fechaCreacion}
                disabled
              />
            </Form.Group>
            <Form.Group md="3" as={Col} controlId="formGridEmail">
              <Form.Label> Fecha actualización</Form.Label>
              <Form.Control
                placeholder="actualizacion"
                type="date"
                name="fechaActualizacion"
                value={this.state.fechaActualizacion}
                disabled={true}
              />
            </Form.Group>
            <Form.Group md="3" as={Col} controlId="formGridEmail">
              <Form.Label> Radicado</Form.Label>
              <Form.Control
                placeholder="Radicado"
                type="number"
                name="radicado"
                value={radicado}
                disabled={true}
              />
            </Form.Group>
            <Form.Group md="3" as={Col} controlId="formGridEmail">
              <Form.Label> Descripcion</Form.Label>
              <Form.Control
                placeholder="Descripcion"
                type="text"
                name="hafomDescripcion"
                value={hafomDescripcion}
                disabled={true}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group
              md="8"
              as={Col}
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="observaciones"
                value={observaciones}
                required
                readOnly
              />
            </Form.Group>
            <Form.Group
              md="4"
              as={Col}
              controlId="exampleForm.ControlTextarea1"
            >
              <br />
              <br />
              <div>
                <Button
                  variant="primary"
                  style={{ margin: "10px" }}
                  onClick={() => this.props.history.goBack()}
                >
                  {" "}
                  Regresar al Listado
                </Button>
              </div>
            </Form.Group>
          </Form.Row>
          <Button
            variant="primary"
            className="mr-5"
            name="info_basica"
            onClick={this.changeAccordionStatus}
          >
            {" "}
            {info_basica ? "--" : "+"}
          </Button>{" "}
          Información Básica Suscripción
          {info_basica && (
            <div>
              <br />
              <Form.Row>
                {codigoBase ? (
                  <h5
                    style={{
                      borderRadius: "0.25em",
                      textAlign: "center",
                      color: "black",
                      border: "1px solid black",
                      padding: "0.5em",
                    }}
                  >
                    CODIGO MULTIUSUARIO: {codigoBase}
                  </h5>
                ) : (
                  ""
                )}
              </Form.Row>
              <Form.Row>
                <BootstrapTable
                  id={"AforosSuscriptoresTable"}
                  //classes={"greenHead"}
                  data={this.state.suscripcionesList}
                  keyField="id"
                  columns={this.state.suscriptorListColumns}
                  bootstrap4
                  striped={true}
                  hover={true}
                  pagination={paginationFactory({})}
                  cellEdit={cellEditFactory({
                    mode: "click",
                    blurToSave: true,
                  })}
                  rowClasses={(row) => {
                    if (row.estadoSuscriptor != "A") {
                      return "table-danger";
                    } else {
                      return "table-info";
                    }
                  }}
                  //caption={< CapElementMultiusuario />}
                />
              </Form.Row>

              <Form.Row className="mb-2">
                <Form.Group as={Col} controlId="formGridEmail" md="3">
                  <Form.Label>
                    Cantidad Suscripciones{" "}
                    {this.state.suscripcionesList.length || ""}
                  </Form.Label>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridEmail" md="3">
                  <Form.Label>
                    Porcentaje Distribuido %{" "}
                    {Math.round(
                      this.state.suscripcionesList.reduce(
                        (total, item) =>
                          total +
                          parseFloat((item as ItemSuscriptor).porcentaje + ""),
                        0
                      )
                    )}
                  </Form.Label>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridEmail" md="3">
                  <Form.Label>
                    Porcentaje Distribuido Inactivo % {console.log("RECORRIDO")}{" "}
                    {
                      this.state.suscripcionesList
                        .filter(
                          (e: ItemSuscriptor) =>
                            (e as ItemSuscriptor).estadoSuscriptor !== "A"
                        )
                        .reduce(
                          (total, item) =>
                            total +
                            parseFloat(
                              (item as ItemSuscriptor).porcentaje + ""
                            ),
                          0
                        )
                      /*Math.round(this.state.suscripcionesList.filter(i=>i. !=="A")
                    .reduce((total, item) => total + parseFloat((item as ItemSuscriptor).porcentaje + ""), 0))*/
                    }
                  </Form.Label>
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group
                  md="3"
                  as={Col}
                  controlId="formGridState"
                  form="nuevoMultiForm"
                >
                  <Form.Label>Tipo Aforo</Form.Label>
                  <Form.Control
                    name="tipoAforo"
                    value={this.state.tipoAforo}
                    readOnly
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Vigencia Desde</Form.Label>
                  <Form.Control
                    placeholder="Vigencia"
                    type="date"
                    name="vigenciaDesde"
                    value={vigenciaDesde}
                    required
                    readOnly
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Vigencia Final</Form.Label>
                  <Form.Control
                    placeholder="Vigencia"
                    type="date"
                    name="vigenciaFinal"
                    value={vigenciaFinal}
                    required
                    readOnly
                  />
                </Form.Group>
                <Form.Group
                  md="3"
                  as={Col}
                  controlId="formGridEmail"
                  className="sm-2"
                >
                  <Form.Label>Fecha creación</Form.Label>
                  <Form.Control
                    placeholder="creación"
                    type="date"
                    name="fechaCreacion"
                    value={this.state.fechaCreacion}
                    disabled
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group md="2" as={Col} controlId="afo_estado">
                  <Form.Label>Estado</Form.Label>
                  <Form.Control
                    name="afo_estado"
                    value={this.state.afo_estado}
                    readOnly
                  />
                </Form.Group>
                <Form.Group md="3" as={Col} controlId="formGridStatedsitribuc">
                  <Form.Label>Tipo Distribución</Form.Label>
                  <Form.Control
                    name="nombreTipoDistribucion"
                    value={this.state.nombreTipoDistribucion}
                    readOnly
                  />
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group
                  md="8"
                  as={Col}
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Observaciones</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="observaciones"
                    value={observaciones}
                    required
                    readOnly
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group md="2" as={Col} controlId="mafv_factor">
                  <Form.Label>Factor</Form.Label>
                  <Form.Control
                    name="mafv_factor"
                    value={this.state.mafv_factor}
                    type="text"
                    placeholder="0.000"
                    required
                    disabled
                  />
                </Form.Group>
              </Form.Row>
            </div>
          )}
        </Form>
        <hr />
        <hr />
        <Button
          variant="primary"
          className="mr-5"
          type="submit"
          name="detalle_registro_aforo"
          onClick={this.changeAccordionStatus}
        >
          {" "}
          {detalle_registro_aforo ? "--" : "+"}
        </Button>
        Detalle Registros Visitas
        {detalle_registro_aforo && (
          <div>
            <BootstrapTable
              id="AforosrealizadosTablez"
              className="table table-striped"
              data={this.state.aforos_realizados}
              keyField="numeroVisita"
              columns={this.state.columnsRealizados}
              bootstrap4
              striped={true}
              hover={true}
              pagination={paginationFactory({})}
              cellEdit={cellEditFactory({ mode: "click", blurToSave: true })}
              caption={<CapElementVisitasRealizadas />}
            />

            <h5>Visitas Pendientes</h5>
            <BootstrapTable
              id="AforosPendientesTable"
              classes={"redHead"}
              data={this.state.aforos_pendientes}
              keyField="idAforo"
              columns={this.state.columnsPendientes}
              bootstrap4
              striped={true}
              hover={true}
              pagination={paginationFactory({})}
              cellEdit={cellEditFactory({ mode: "click", blurToSave: true })}
            />
          </div>
        )}
        <hr />
        <Button
          variant="primary"
          className="mr-5"
          type="submit"
          name="consolidado_aforos"
          onClick={this.changeAccordionStatus}
        >
          {" "}
          {consolidado_aforos ? "--" : "+"}
        </Button>
        Consolidado Aforo
        {consolidado_aforos && (
          <div>
            <h5>{}</h5>
            <Row>
              <Col>
                <div className="row justify-content-center">
                  <H1>
                    {this.state.aforos_consolidados.length > 1
                      ? "Comparativo Aforos"
                      : "Consolidado Aforo"}{" "}
                  </H1>
                </div>
              </Col>
            </Row>
            <Row className="mb-3">
              {this.state.aforos_consolidados && this.state.aforos_consolidados.map((k) => {
                return (
                  <Col>
                    <Card>
                      <Card.Header>
                        <Card.Title>Tipo: {k.tipoAforo}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          Numero Aforo: {k.numAforo}
                        </Card.Subtitle>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col>
                            <BootstrapTable
                              id="AforosConsolidadoTable"
                              data={k.detalles == undefined ? [] : k.detalles}
                              keyField="mes"
                              columns={this.state.columnsConsolidadosx}
                              bootstrap4
                              striped={true}
                              hover={true}
                              pagination={paginationFactory({})}
                              //cellEdit={cellEditFactory({ mode: 'click', blurToSave:true })}
                            />
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
              {this.state.aforos_consolidados.length > 1 ? (
                <Col>
                  <Card>
                    <Card.Header>
                      <Card.Title>Resultado Diferencias</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        Tabla Comparativa
                      </Card.Subtitle>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col>
                          <div className="row justify-content-center">
                            <BootstrapTable
                              id="AforosConsolidadoTable"
                              data={this.state.aforos_consolidados}
                              keyField="mes"
                              columns={this.state.columnsConsolidadosx2}
                              bootstrap4
                              striped={true}
                              hover={true}
                              pagination={paginationFactory({})}
                              //cellEdit={cellEditFactory({ mode: 'click', blurToSave:true })}
                            />
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              ) : (
                <div></div>
              )}
            </Row>
            {this.state.liquidaciones && this.state.liquidaciones.length > 0 && (
              <Row className="mb-3">
                <Col>
                  <Card>
                    <Card.Header>
                      <Card.Title>Liquidaciones</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <div className="table-responsive">
                        <table className="table table-sm table-hover">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Valor Total</th>
                              <th>Individual</th>
                              <th>Cobro</th>
                              <th>Visitas</th>
                              <th>Unidades Independientes</th>
                              <th>Acción</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.liquidaciones.map((l: any, i: number) => (
                              <tr key={i}>
                                <td>{l.liafocoIderegistro || ""}</td>
                                <td>
                                  {l.liafocoValortotal != null 
                                    ? this.formatearMoneda(l.liafocoValortotal)
                                    : ""}
                                </td>
                                <td>
                                  {l.liafocoIndividual != null 
                                    ? this.formatearMoneda(l.liafocoIndividual)
                                    : ""}
                                </td>
                                <td >
                                  <span 
                                    className={`badge badge-pill ${l.liafocoCobro ? 'badge-success' : 'badge-secondary'}`}
                                    style={{ fontSize: '0.9rem', padding: '0.5em 1em' }}
                                  >
                                    {l.liafocoCobro ? "Sí" : "No"}
                                  </span>
                                </td>
                                <td>{l.liafocoVisitas || ""}</td>
                                <td>{l.liafocoUnidadesIndependientes || ""}</td>
                                
                                <td>
                                  <Button
                                    size="sm"
                                    variant={l.liafocoCobro ? "outline-secondary" : "outline-success"}
                                    onClick={() => this.cambiarEstadoCobro(l.liafocoIderegistro, l.liafocoCobro)}
                                    title={l.liafocoCobro ? "Cambiar a No Cobro" : "Cambiar a Cobro"}
                                  >
                                    {l.liafocoCobro ? "No cobrar" : "Cobrar"}
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}
            <Row>
              <Col>
                <Card>
                  <Card.Header>
                    <Card.Title>Conceptos</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col>
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th scope="col">Factor Produccion</th>
                              <th scope="col">TAFNA</th>
                              <th scope="col">Tipo Aforo</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th scope="row">{this.state.mafv_factor}</th>
                              <th scope="row">
                                {this.state.aforos_consolidados
                                  ? this.state.aforos_consolidados[0]["tafna"]
                                  : ""}
                              </th>
                              <th scope="row">
                                {this.state.aforos_consolidados
                                  ? this.state.aforos_consolidados[0][
                                      "tipoAforo"
                                    ]
                                  : ""}
                              </th>
                            </tr>
                          </tbody>
                        </table>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        )}
        <hr />
        <Button
          variant="primary"
          className="mr-5"
          type="submit"
          name="info_reporte"
          onClick={this.changeAccordionStatus}
        >
          {" "}
          {info_reporte ? "--" : "+"}
        </Button>
        Reporte Liquidacion
        {info_reporte && (
          <div>
            <Card>
              {this.mostrarAlerta()}
              <Card.Header>Reportes Liquidacion</Card.Header>
              <Card.Body>
                <Row>
                  <Col>
                    <div className="form-group">
                      <label>Id Aforo</label>
                      <input
                        className="form-control"
                        disabled
                        name="idAforo"
                        value={this.state.aforos_consolidados[0]?.numAforo || ""}
                        type="number"
                      />
                    </div>
                  </Col>
                  <Col>
                    <div className="form-group">
                      <label>Codigo Suscripcion</label>
                      <input
                        className="form-control"
                        onChange={(e) => this.cambioValorBusqueda(e)}
                        name="pcodigo"
                        value={this.state.busqueda.pcodigo}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="form-group">
                      <label>Fecha Inicial</label>
                      <input
                        className="form-control"
                        onChange={(e) => this.cambioValorBusqueda(e)}
                        name="fechaInicio"
                        value={this.state.busqueda.fechaInicio}
                        type="date"
                        placeholder=""
                      />
                    </div>
                  </Col>
                  <Col>
                    <div className="form-group">
                      <label>Fecha Final</label>
                      <input
                        className="form-control"
                        onChange={(e) => this.cambioValorBusqueda(e)}
                        name="fechaFinal"
                        value={this.state.busqueda.fechaFinal}
                        type="date"
                        placeholder=""
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="form-group">
                      <label>PQRS</label>
                      <input
                        className="form-control"
                        onChange={(e) => this.cambioValorBusqueda(e)}
                        name="pqrs"
                        value={this.state.busqueda.pqrs}
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </Col>
                  <Col>
                    <div className="form-group">
                      <label>Tercero</label>
                      <AsyncTypeahead
                        id="basic-typeahead-single"
                        labelKey="ter_nomcompleto"
                        onChange={(e) => this.cambioValorTercero(e)}
                        options={this.state.terceros}
                        placeholder="Elegir tercero..."
                        selected={this.state.terceroSeleccion}
                        minLength={3}
                        isLoading={this.state.cargandoTercero}
                        onSearch={this.buscarTercero}
                      />
                    </div>
                  </Col>
                  <Col>
                    <div className="form-group">
                      <label>Aforador</label>
                      <select
                        onChange={(e) => this.cambioValorBusqueda(e)}
                        className="form-control"
                        name="terAforador"
                        value={this.state.busqueda.terAforador}
                      >
                        <option> </option>
                        {this.state.aforadores.map((t: any, i: number) => {
                          return (
                            <option key={i} value={t.id}>
                              {" "}
                              {t.object}
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
                      <br></br>
                      <Button
                        disabled={!this.state.effectivePermissions?.VIEW}
                        variant="primary"
                        onClick={this.generarReporteDetalle}
                      >
                        Detallado Visitas
                      </Button>
                    </div>
                  </Col>
                  <Col>
                    <div className="form-group">
                      <br></br>
                      <Button
                        disabled={!this.state.effectivePermissions?.VIEW}
                        variant="primary"
                        onClick={this.generarReporteLiquidacion}
                      >
                        Liquidacion
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        )}
        <ModalDetallesEditar
          columnsData={[
            "Tipo recipiente",
            "Dimensiones",
            "Cantidad recipientes",
            "Equivalencia (m3)",
            "Peso",
            this.state.claseSuscripcion.toUpperCase() === "INDIVIDUAL" ? "Total" : "Total (Asignación Usuario)",
            "Observaciones",
          ]}
          data={this.state.detalleSelected || []}
          columnTotal={["TOTALES"]}
          dataTotal={this.state.Totales}
          observaciones={this.state.observacionesSelect}
          handleModalClose={this.handleModalClose}
          showModal={this.state.showModal}
        />
        <ModalSlideFotos
          dia={this.state.datosFotos.dia}
          semana={this.state.datosFotos.semana}
          data={{}}
          idVisita={this.state.datosFotos.idDmaf}
          fechaEjecucion={this.state.datosFotos.fechaEjecucion}
          observaciones={this.state.datosFotos.observaciones}
          showModalConceptos={this.state.ShowModalSlideFotos}
          handleModalConceptosClose={() => {
            this.setState({ ShowModalSlideFotos: false });
          }}
        ></ModalSlideFotos>
      </div>
    );
  }
}

const mapToStateToprops = (state) => {
  return {
    selectsMulti: state.selectsMulti,
    selects: state.selects,
  };
};
const mapToDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ loadTiposAforoMulti }, dispatch),
  };
};

export default connect(mapToStateToprops, mapToDispatchToProps)(Visualizar);
