import React, { Component, Fragment } from "react";
import connect from "react-redux/es/connect/connect";
import Modal from "react-bootstrap4-modal";
import { Button, Form, Col } from "react-bootstrap";
import RUTAS_API from "../../../../global/rutas_api";
import { consultaGetAprovechamiento, saveConsultaGet, savePostService, postServiceR, saveConsultaGetAprovechamiento } from "../../../../store/actions/Utils";
import Select from 'react-select'
import { prepairDataSelect } from '../../../../vistas/Utils/StandarMethods'
import { saveItem } from '../../../../store/actions/Items'

class ModalDetalleConceParam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      liquidacionesV: this.props.row.liqNombre,
      liquidacionId: this.props.row.uniLiquidacion,
      documento: this.props.row.docNombre,
      tipoDocumento: this.props.row.tidoNombre,
      documentoId: this.props.row.uniDocumento,
      tipoDocId: this.props.row.uniTipdocument,
      conceptosV: this.props.row.uniConcepto,
      concepto: this.props.row.conNombre,
      porcentaje: this.props.row.uniPorcentaje,
      tercerosNombreV: this.props.row.terNomcompleto,
      terIdRegistro: this.props.row.terIderegistro,
      municipiosV: this.props.row.municipio,
      proyectoLlacom: this.props.row.proyectoLlacom,
      mostrarTabla: 1,
      openModalActualizar: false,
      result: [],
      idSelect: [],
      banderaAproEdicion: false,
      banAdicionar: true,
      banPorcen: true
    }

  }

  componentDidMount() {
    this.cargarListas();
  }


  cargarListas = () => {
    this.listLiquidacionesAprov();
    this.listConceptos(this.state.liquidacionId);
    if (this.state.terIdRegistro != null) {
      this.obtenerTercerosPorNombre(this.state.terIdRegistro);
      this.listMunicipios(this.state.terIdRegistro);
    }
  }

  consultaConceposAprov = async (page, pageSize) => {
    if (!!this.props.listaConceptosAprov.data || !!this.props.listaConceptosAprovR.data) {
      if (!!this.props.listaConceptosAprovR.data) {
        this.setState({
          listaConceptosAprovState: this.props.listaConceptosAprovR.data.content
        })
      } else {
        this.setState({
          listaConceptosAprovState: this.props.listaConceptosAprov.data.content
        })
      }
    }
  }

  /**
   * Método encargado de consultar lista de terceros alcadias
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
  listConceptos = (uniLiquidacion) => {
    const param = { uniLiquidacion: uniLiquidacion }
    this.props.consultaGetAprovechamiento(
      RUTAS_API.COLI_CONLIQUIDA_APROVECHAMIENTO.CONSULTA_CON_CONCEPTOS,
      param,
      {},
      "conceptosList"
    )
  }

  /**
   * Metodo encargado de extraer el valor de una liquidacion al ser seleccionada, asi como el documento y tipo de documento
   */
  handleChangeText = (e) => {
    const liquiFil = this.props.liquidaciones.data.find(liquidacion => liquidacion.uniLiquidacion == e.value);
    this.setState({ liquidacionesV: e });
    this.setState({ liquidacionId: e.value })
    this.setState({ documento: liquiFil.docNombre });
    this.setState({ tipoDocumento: liquiFil.tidoNombre });
    this.setState({ documentoId: liquiFil.uniDocumento });
    this.setState({ tipoDocId: liquiFil.uniTipdocument });
    this.listConceptos(e.value);
    this.setState({ porcentaje: 100 });
    this.setState({ proyectoLlacom: "" });
    this.setState({ concepto: "" });
    this.setState({ terIdRegistro: "" });
    this.setState({ banAdicionar: true })
    this.setState({ banPorcen: true })
  };

  /**
   * Metodo encargado extraer el valor del concepto seleccionado
   * @param {*} e
   */
  handleChangeConcep = (e) => {
    const conceptoSelec = this.props.conceptos.data.find(c => c.uniConcepto == e.value);
    this.setState({ conceptosV: e.value })
    this.setState({ concepto: e })
    this.setState({ banderaAproEdicion: conceptoSelec.aprovechamiento })
    this.setState({ proyectoLlacom: "" });
    this.setState({ terIdRegistro: "" });
    if (conceptoSelec.aprovechamiento == true) {
      //this.setState({ aproPadre: "1" })
      this.validateFormApro();
    }
  }

  /**
 * Metodo para habilitar boton de adicionar y limpiar con datos requeridos
 */
  validateFormApro = () => {
    if (liquidacion && conceptosV && porcentaje) {
      this.setState({ banAdicionar: false })
      //this.setState({ banPorcen:true })
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

  validateFormIA = (proyectoLlacom) => {
    if (terIdRegistro && proyectoLlacom) {
      this.setState({ banAdicionar: false })
      //this.setState({ banPorcen:true })

    }

  }

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
      this.setState({ banPorcen: false })

    }
    this.setState({ porcentaje: e.target.value })
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
   * Metodo encargado de enviar el objeto para actualizar una parametrizacion
   * @param {*} e
   */
  submitHandler = async (e) => {
    e.preventDefault()
    e.stopPropagation();
    const { conceptosV, documentoId, tipoDocId, porcentaje, liquidacionId, terIdRegistro, proyectoLlacom } = this.state;
    const objetoConcepto = {
      coliAprovIderegistro: this.props.row.coliAprovIderegistro,
      terIderegistro: terIdRegistro,
      uniConcepto: conceptosV,
      uniLiquidacion: liquidacionId,
      proyectoLlacom: proyectoLlacom,
      uniPorcentaje: porcentaje,
      uniDocumento: documentoId,
      uniTipdocument: tipoDocId,
      coliEstado: "A"
    }


    await this.props.postServiceR(
      RUTAS_API.COLI_CONLIQUIDA_APROVECHAMIENTO.CONSULTA_INSERTAR_CONCEPTO,
      objetoConcepto,
      {},
      "objetoConcepto"
    );
    this.props.saveItem(false, "cerrarModalEditar");
    this.props.saveItem(true, "openModalActualizar");
    this.props.saveItem(objetoConcepto.terIderegistro, "terIdRegistroValidar");

  }

  /**
   * Metodo para obtener el dato de la lista seleccionado
   */
  obtenerDatoSeleccionado = (id, listado) => {
    return listado.filter(c => c.value == id)
  }

  render() {
    const {
      documento,
      tipoDocumento,
      porcentaje,
      liquidacionId,
      conceptosV,
      terIdRegistro,
      proyectoLlacom,
      banderaAproEdicion,
      banAdicionar,
      banPorcen
    } = this.state;
    const { closeModal } = this.props;

    return (

      <Fragment>
        {
          <Modal visible={true} onClickBackdrop={closeModal} dialogClassName="modal-lg">
            <div className="modal-header">
              <h2 className="modal-title">
                Editar concepto
              </h2>
            </div>
            <div className="modal-body">
              <Form.Group onSubmit={this.submitHandler}>
                <Form.Row>
                  <Form.Group as={Col} md="3">
                    <Form.Label>Liquidación</Form.Label>
                    <Select
                      value={this.obtenerDatoSeleccionado(liquidacionId, prepairDataSelect(this.props.liquidaciones.data, "liqNombre", "uniLiquidacion"))}
                      id={"liquidacionesV"}
                      onChange={this.handleChangeText}
                      isSearchable
                      options={!!this.props.liquidaciones && prepairDataSelect(this.props.liquidaciones.data, "liqNombre", "uniLiquidacion")}
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
                      value={!!this.props.conceptos ? this.obtenerDatoSeleccionado(conceptosV, prepairDataSelect(this.props.conceptos.data, "conNombre", "uniConcepto")) : []}
                      id={"conceptosV"}
                      onChange={this.handleChangeConcep}
                      options={!!this.props.conceptos ? prepairDataSelect(this.props.conceptos.data, "conNombre", "uniConcepto") : []}
                      isSearchable
                      placeholder="Seleccione"
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} md="3">
                    <Form.Label>Porcentaje Concepto</Form.Label>
                    <Form.Control
                      type="text"
                      value={porcentaje}
                      required
                      id={"porcentaje"}
                      onChange={this.handleChangePor}
                      onClick={() => {
                        this.setState({ porcentaje: "" })
                      }}
                    >
                    </Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} md="3">
                    <Form.Label>Tercero </Form.Label>
                    <Select
                      value={!!this.props.tercerosNombre ? this.obtenerDatoSeleccionado(terIdRegistro, prepairDataSelect(this.props.tercerosNombre.data, "terNomcompleto", "terIderegistro")) : []}
                      id={"terIdRegistro"}
                      onChange={this.handleTercero}
                      label="Single select"
                      options={!!this.props.tercerosNombre ? prepairDataSelect(this.props.tercerosNombre.data, "terNomcompleto", "terIderegistro") : []}
                      placeholder="Digite nombre de tercero"
                      isDisabled={terIdRegistro == null || !!banderaAproEdicion ? true : false}
                      isSearchable
                    />
                  </Form.Group>

                  <Form.Group as={Col} md="3">
                    <Form.Label>Municipio</Form.Label>
                    <Select
                      value={!!this.props.municipios ? this.obtenerDatoSeleccionado(proyectoLlacom, prepairDataSelect(this.props.municipios.data, "proyectoNom", "proyectoLlacom")) : []}
                      id={"proyectoLlacom"}
                      onChange={this.handleChangeMuni}
                      options={!!this.props.municipios ? prepairDataSelect(this.props.municipios.data, "proyectoNom", "proyectoLlacom") : []}
                      isDisabled={terIdRegistro == null || !!banderaAproEdicion ? true : false}
                      isSearchable
                      placeholder="Seleccione"
                    />

                  </Form.Group>
                </Form.Row>
                <Form.Row>

                </Form.Row>
                <div className="modal-footer">
                  <Form.Group>
                    <Form className="inline-form" >
                      <Button variant="primary" type="submit" disabled={banAdicionar && banPorcen}>Guardar</Button>
                      <Button className="ml-3" variant="danger" onClick={closeModal} >Cancelar</Button>
                    </Form>
                  </Form.Group>
                </div>
              </Form.Group>
            </div>
          </Modal>
        }
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
  listaConceptosAprovR: state.Utils.listaConceptosAprov,
  objetoParamConcepto: state.Utils.objetoConcepto,
  cerrarModalEditar: state.Items.cerrarModalEditar,
  openModalActualizar: state.Items.openModalActualizar,
  terIdRegistroValidar: state.Items.terIdRegistroValidar
});

const mapDispatchToProps = {
  consultaGetAprovechamiento,
  saveConsultaGet,
  savePostService,
  postServiceR,
  saveConsultaGetAprovechamiento,
  saveItem
};

const RModalDetalleConceParam = connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalDetalleConceParam);

export default RModalDetalleConceParam;
