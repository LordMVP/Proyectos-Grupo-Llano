import React, { Component, Fragment } from 'react';
import connect from "react-redux/es/connect/connect";
import { Button, Form, Col, Nav, Row } from "react-bootstrap";
import RUTAS_API from "../../global/rutas_api";
import { consultaGetAprovechamiento, saveConsultaGet, savePostService, postServiceR, saveConsultaGetAprovechamiento, } from "../../store/actions/Utils";
import { RTablaConceptosLiquidacion } from "./utils/TablaConceptosLiquidacion/TablaConceptosLiquidacion"
import { PROGRAMAS } from '../../global/constantes'
import ModalCambioDatos from "./utils/Modals/ModalCambioDatos"
import Select from 'react-select'
import { prepairDataSelect, prepairIdParam } from '../../vistas/Utils/StandarMethods'
import { messageService } from './utils/Services/serviceLiquidacion.service';
import { saveItem } from '../../store/actions/Items'


class ParamLiquidacionInt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      terceros: [],
      liquidacionesV: "",
      liquidacion: "",
      municipiosV: [],
      conceptosV: "",
      concepto: "",
      listaConceptosAprov: [],
      documentoId: "",
      documento: "",
      tipoDocId: "",
      tipoDocumento: "",
      porcentaje: 100.00,
      mostrarTabla: 1,
      search: "",
      openModalInsertar: false,
      validated: false,
      objetoParamConcepto: "",
      conceptosAprov: "",
      conceptosIncenAprov: "",
      listaConceptosIncenAprov: [],
      banderaAprovechamiento: false,
      banderaIncenAprovechamiento: false,
      proyectoLlacom: null,
      tercerosNombreV: "",
      terIdRegistro: "",
      aproPadre: "1",
      adic: false,
      banAdicionar: false,
    }
  }

  componentDidMount() {
    this.obtenerParametrosAprovechamiento();
    this.obtenerTercerosPorNombre();
    !!!this.props.liquidaciones && this.listLiquidacionesAprov();
    this.validarPermisosUsuario();
  }

  componentDidUpdate() {

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
   * Método encargado de consultar lista de terceros alcaldías
   */
  obtenerTercerosPorNombre = async () => {
    await this.props.consultaGetAprovechamiento(
      RUTAS_API.TER_TERCERO.CONSULTA_APROVECHADORES_INCENTIVO_POR_NOMBRE,
      {},
      {},
      "listaTerceros"
    );
  }

  /**
   * Método encargado de consultar las liquidaciones con su documento y tipo de documento correspondiente
   */
  listLiquidacionesAprov = () => {
    this.props.consultaGetAprovechamiento(
      RUTAS_API.COLI_CONLIQUIDA_APROVECHAMIENTO.CONSULTA_LIQUIDACIONES,
      {},
      {},
      "liquidacionesList"
    );
  };

  /**
   * Metodo encargado de consultar el area de prestación según un tercero seleccionado
   * @param {*} terIderegistro
   */
  listMunicipios = (terIderegistro) => {
    const param = { terIderegistro: terIderegistro }
    this.props.consultaGetAprovechamiento(
      RUTAS_API.COLI_CONLIQUIDA_APROVECHAMIENTO.CONSULTA_MUNICIPIOS,
      param,
      {},
      "municipiosList"
    );
  };

  /**
   * Metodo encargado de consultar los conceptos asociados a una liquidacion seleccionada
   * @param {*} uniLiquidacion
   */
  listConceptos = async (uniLiquidacion) => {
    const param = { uniLiquidacion: uniLiquidacion }
    await this.props.consultaGetAprovechamiento(
      RUTAS_API.COLI_CONLIQUIDA_APROVECHAMIENTO.CONSULTA_CON_CONCEPTOS,
      param,
      {},
      "conceptosList"
    );
  }

  /**
   * Metodo encargado de extraer el valor de una liquidacion al ser seleccionada, asi como el documento y tipo de documento
   */
  handleChangeText = (e) => {
    const liquiFil = this.props.liquidaciones.data.find(liquidacion => liquidacion.uniLiquidacion == e.value);
    const evento = prepairIdParam(e)
    this.props.saveConsultaGetAprovechamiento([], "conceptosList");
    this.setState({ liquidacionesV: e });
    this.setState({ liquidacion: e.value })
    this.setState({ documento: liquiFil.docNombre });
    this.setState({ tipoDocumento: liquiFil.tidoNombre });
    this.setState({ documentoId: liquiFil.uniDocumento });
    this.setState({ tipoDocId: liquiFil.uniTipdocument });
    this.listConceptos(evento);
    this.setState({ adic: true })
    this.setState({ porcentaje: 100 });
    this.setState({ municipiosV: "" });
    this.setState({ concepto: "" });
    this.setState({ tercerosNombreV: "" });
    this.props.saveConsultaGetAprovechamiento([], "municipiosList");
  };

  /**
   * Metodo encargado de validar el valor ingresado en el campo de texto para porcentaje
   * @param {*} e
   */
  handleChangePor = (e) => {
    this.start = e.target.selectionStart;
    let val = e.target.value;
    val = val.replace(/([^0-9.]+)/, "");
    val = val.replace(/^(0|\.)/, "");
    const match = /(\d{0,3})[^.]*((?:\.\d{0,2})?)/g.exec(val);
    let value = match[1] + match[2];
    const compare = parseFloat(value)
    if (compare > 100.00) {
      value = "100.00";
    }
    e.target.value = value;
    this.setState({ input: value });
    if (val.length > 0) {
      e.target.value = parseFloat(value).toFixed(2);
      e.target.setSelectionRange(this.start, this.start);
      this.setState({ input: parseFloat(value).toFixed(2) });
    }
    this.setState({ porcentaje: e.target.value })
    this.setState({ adic: true });
  }


  /**
   * Metodo encargado extraer el valor del concepto seleccionado
   * @param {*} e
   */
  handleChangeConcep = (e) => {
    const conceptoSelec = this.props.conceptos.data.find(c => c.uniConcepto == e.value);
    this.setState({ conceptosV: e.value })
    this.setState({ concepto: e })
    this.setState({ banderaAprovechamiento: conceptoSelec.aprovechamiento })
    this.setState({ banderaIncenAprovechamiento: conceptoSelec.incentivoAprovechamiento })
    this.setState({ municipiosV: "" });
    this.setState({ tercerosNombreV: "" });
    if (conceptoSelec.aprovechamiento == true) {
      this.setState({ aproPadre: "1" })
      this.validateFormApro();
    } else {
      if (conceptoSelec.incentivoAprovechamiento == true) {
        this.setState({ aproPadre: "2" })
      }
    }
  }

  /**
   * Metodo encargado extraer el valor del municipio seleccionado
   */
  handleChangeMuni = (e) => {
    this.setState({ municipiosV: e })
    this.setState({ proyectoLlacom: e.value })
    this.validateFormIA(e.value);
  }

  /**
   * Metodo encargado de enviar el objeto de insertar una parametrizacion
   * @param {*} e
   */
  submitHandler = async (e) => {
    e.preventDefault()
    e.stopPropagation();
    const { liquidacion, conceptosV, documentoId, tipoDocId, porcentaje, proyectoLlacom, terIdRegistro } = this.state;
    const concepto = {
      uniConcepto: conceptosV,
      uniLiquidacion: liquidacion,
      uniPorcentaje: porcentaje,
      uniDocumento: documentoId,
      uniTipdocument: tipoDocId,
      proyectoLlacom: proyectoLlacom,
      terIderegistro: terIdRegistro,
      coliEstado: "A",
    }
    await this.props.postServiceR(
      RUTAS_API.COLI_CONLIQUIDA_APROVECHAMIENTO.CONSULTA_INSERTAR_CONCEPTO,
      concepto,
      {},
      "objetoConcepto"
    );
    this.setState({ openModalInsertar: true })
  }

  /**
   * Metodo ara extraer el valor al cambiar de pestaña aprovechamiento-incentivo aprovechamiento
   * @param {*} eventKey
   */
  handleSelect = (eventKey) => {
    const mostrarTabla = eventKey
    this.setState({ mostrarTabla });
    if (eventKey == 1 && this.state.aproPadre != 1) {
      this.setState({ aproPadre: "1" })
      messageService.sendMessage("1");
    } else if (eventKey == 2 && this.state.aproPadre != 2) {
      this.setState({ aproPadre: "2" })
      messageService.sendMessage("2");
    }
  }

  /**
   * Metodo para aceptar inserción de nuevo registro
   */
  aceptarRegistroEx = () => {
    this.limpiarForm();
    this.setState({ openModalInsertar: false })
    this.setState({ banAdicionar: false })
    const mostrarTabla = this.state.aproPadre
    this.setState({ mostrarTabla });
    messageService.sendMessage(this.state.aproPadre);
  }

  /**
   * Metodo para limpiar valores de las cajas de texto
   */
  limpiarForm = () => {
    this.setState({
      liquidacionesV: "", documento: "",
      tipoDocumento: "", documentoId: "", tipoDocId: "",
      porcentaje: 100, municipiosV: "", concepto: "",
      tercerosNombreV: "", terIdRegistro: "", proyectoLlacom: null, banAdicionar: false
    });
    this.props.saveConsultaGetAprovechamiento([], "municipiosList");
    this.props.saveConsultaGetAprovechamiento([], "conceptosList");
    this.props.saveConsultaGetAprovechamiento([], "tercerosNombre")

  }

  /**
   * Metodo para validar permisos de usuario sobre las diferentes funcionalidades
   */
  validarPermisosUsuario = () => {
    this.props.consultaGetAprovechamiento(
      RUTAS_API.COLI_CONLIQUIDA_APROVECHAMIENTO.CONSULTA_PERMISOS,
      { idPrograma: PROGRAMAS.PAR_LIQ_APROVE },
      {},
      "permisosUsuario"
    )
    
  }

  /**
   * Metodo para extraer el valor de tercero seleccionado
   * @param {*} e
   */
  handleTercero = (e) => {
    this.setState({ tercerosNombreV: e })
    this.setState({ terIdRegistro: e.value })
    this.listMunicipios(e.value);
  }

  /**
   * Metodo para habilitar boton de adicionar y limpiar con datos requeridos
   */
  validateFormApro = () => {
    console.log("Validando Aprovechamiento ");
    if (liquidacion && conceptosV && porcentaje) {
      console.log("Validando Prrovechamiento "+" adicionar ");
      this.setState({ banAdicionar: true })
    }
  }

  validateFormIA = (proyectoLlacom) => {
    console.log("Validando Incentivo Aprovechamiento ");
    if (terIdRegistro && proyectoLlacom) {      
      this.setState({ banAdicionar: true })
     
    }

  }

  render() {
    const {
      liquidacionesV,
      municipiosV,
      documento,
      tipoDocumento,
      mostrarTabla,
      porcentaje,      
      openModalInsertar,
      validated,
      tercerosNombreV,
      concepto,
      banAdicionar
    } = this.state;
    const {
      objetoParamConcepto
    } = this.props;
    const admin =  !!this.props.admin ? ( this.props.admin.data==true ? this.props.admin.data  :false )  : false  
     
    console.log(" RENDERIZANDO :: !!" + !!this.props.admin + "  !!!" + !!! this.props.admin);  
    console.log(" VALOR ADMINNNNNNNNNNNNNNNNNNNNNNNNNNNN  : "+ admin)
    return (
      <Fragment>
        <h2>Parametrización de conceptos de aprovechamiento e incentivo para liquidar pago</h2>
        <Form validated={validated} onSubmit={this.submitHandler}>
          <Form.Row>
            <Form.Group as={Col} md="3">
              <Form.Label>Liquidación</Form.Label>
              <Select
                value={liquidacionesV}
                id={"liquidacion"}
                onChange={this.handleChangeText}
                isSearchable
                options={!!this.props.liquidaciones && prepairDataSelect(this.props.liquidaciones.data, "liqNombre", "uniLiquidacion")}
                placeholder="Seleccione"
                noOptionsMessage={() => "No se encontraron resultados"}
              />
            </Form.Group>
            <Form.Group as={Col} md="3">
              <Form.Label>Documento</Form.Label>
              < Form.Control
                value={documento}
                id={"documentoId"}
                disabled>
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} md="3">
              <Form.Label>Tipo Documento</Form.Label>
              <Form.Control     
                value={tipoDocumento}
                id={"tipoDocId"}
                disabled
              >
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} md="3">
              <Form.Label>Concepto</Form.Label>
              <Select
                value={concepto}
                id={"conceptosV"}
                onChange={this.handleChangeConcep}
                options={!!this.props.conceptos ? prepairDataSelect(this.props.conceptos.data, "conNombre", "uniConcepto") : []}
                isSearchable
                placeholder="Seleccione"
                noOptionsMessage={() => "No se encontraron resultados"}

              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} md="3">
              <Form.Label>Porcentaje concepto</Form.Label>
              <Form.Control
                type="text"
                value={porcentaje}
                required
                id={"porcentaje"}
                onChange={this.handleChangePor}
                onClick={() => {
                  this.setState({ porcentaje: "" })
                }}
                defaultValue={porcentaje}
              >
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} md="3">
              <Form.Label>Tercero Nombres/Apellidos</Form.Label>
              <Select
                value={tercerosNombreV}
                id={"terIdRegistro"}
                onChange={this.handleTercero}
                label="Single select"
                options={!!this.props.tercerosNombre ? prepairDataSelect(this.props.tercerosNombre.data, "terNomcompleto", "terIderegistro") : []}
                placeholder="Digite nombre de tercero"
                isDisabled={!!this.state.banderaAprovechamiento}
                isSearchable
                noOptionsMessage={() => "No se encontraron resultados"}

              />
            </Form.Group>

            <Form.Group as={Col} md="3">
              <Form.Label>Municipio</Form.Label>
              <Select
                value={municipiosV}
                id={"proyectoLlacom"}
                onChange={this.handleChangeMuni}
                options={!!this.props.municipios ? prepairDataSelect(this.props.municipios.data, "proyectoNom", "proyectoLlacom") : []}
                isDisabled={!!this.state.banderaAprovechamiento}
                isSearchable
                placeholder="Seleccione"
                noOptionsMessage={() => "No se encontraron resultados"}
              />
            </Form.Group>
            <Form.Group as={Col} md="3">
              <Form.Label></Form.Label>
              <Form className="inline-form">
             
                { admin==true &&
                  <Button type="submit" disabled={!banAdicionar} >Adicionar</Button>
                }
                <Button className="ml-2" onClick={this.limpiarForm} disabled={!banAdicionar} >Limpiar</Button>
              </Form>
            </Form.Group>
          </Form.Row>
          <Form.Row>
          </Form.Row>
        </Form>
        <Row>
          <Col xs={6}>
            <Nav justify variant="pills" defaultActiveKey="1" activeKey={!!this.props.mostrarTablaStateR ? this.props.mostrarTablaStateR : mostrarTabla} onSelect={this.handleSelect}>
              <Nav.Item>
                <Nav.Link eventKey="1">Aprovechamiento</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="2">Incentivo Aprovechamiento</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col xs={6}></Col>
        </Row>
        <RTablaConceptosLiquidacion mostrarTabla={mostrarTabla} />
        {openModalInsertar && <ModalCambioDatos
          aceptarModal={this.aceptarRegistroEx}
          mensaje={objetoParamConcepto.data == true ? "Registro exitoso" : "Registro ya existe en el sistema"}
          titulo={"Confirmación"}
          aceptarOption={true}
          cancelar={false}
        />}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  parametrosAprovechamiento: state.Utils.parametrosAprovechamiento,
  tercerosNombre: state.Utils.listaTerceros,
  liquidaciones: state.Utils.liquidacionesList,
  municipios: state.Utils.municipiosList,
  conceptos: state.Utils.conceptosList,
  objetoParamConcepto: state.Utils.objetoConcepto,
  admin: state.Utils.permisosUsuario  ,
  mostrarTablaStateR: state.Items.mostrarTablaStateR
   
}
);

const mapDispatchToProps = {
  consultaGetAprovechamiento,
  saveConsultaGet,
  savePostService,
  postServiceR,
  saveConsultaGetAprovechamiento,
  saveItem
};

export const ParamLiquidacion = connect(
  mapStateToProps,
  mapDispatchToProps
)(ParamLiquidacionInt);
