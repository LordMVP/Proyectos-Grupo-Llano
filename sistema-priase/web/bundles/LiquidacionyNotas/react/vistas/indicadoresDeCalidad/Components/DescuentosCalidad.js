import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";

import { Button, Form, Col } from "react-bootstrap";

import { consultaGet } from "../../../store/actions/Utils";
import RUTAS_API from "../../../global/rutas_api";
import SimpleTable from "../../Utils/components/SimpleTable";
import { ModalConfirmacionGenerico } from "../../NotaDXD/utils/FormDetalleSuscripcion/Modales/ModalConfirmacionGenerico";

const columns = [
  "conNombreIndicador",
  "periodo",
  "totalDescuento",
  "totalInteresCorriente",
  "totalInteresMoratorio",
];

const headers = [
  "Indicador",
  "Periodo",
  "Total Descuentos",
  "Total Interes Corriente",
  "Total Interes Mora",
];

const totals = {
  conNombreIndicador: "Total descuentos",
  periodo: false,
  totalDescuento: true,
  totalInteresCorriente: true,
  totalInteresMoratorio: true,
};

class DescuentosCalidadR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      periodo: "",
      idPeriodo: "",
      value: "",
      openModal: false,
    };
  }

  changeValue = (value) => {
    this.setState({ value });
  };

  async componentDidMount() {
    await this.consultaPeriodo();
    this.procesoHabilitado();
  }

  consultaPeriodo = async () => {
    await this.props.consultaGet(
      RUTAS_API.INDICADOR_CALIDAD.PERIODO,
      {},
      {},
      "periodoR"
    );
    this.setState({
      periodo: this.props.periodoActual.data[0].nombrePeriodo,
      idPeriodo: this.props.periodoActual.data[0].idPeriodo,
    });
  };

  procesoHabilitado = () => {
    this.props.consultaGet(
      RUTAS_API.INDICADOR_CALIDAD.HABILITAR_DESCUENTO,
      { idPeriodo: this.state.idPeriodo },
      {},
      "habilitarDescuento"
    );
  };

  closeErrorModal = () => {
    this.setState({ openModal: false, openModalError: false, openModalEjecucion: false });
  };

  handleSubmit = async () => {
    const { tipoNota } = this.props;

    await this.props.consultaGet(
      RUTAS_API.LIQUIDACION.CONSULTA_PROCESO_DESCUENTO_CALIDAD,
      { tipoNota: tipoNota },
      {},
      "descuentoEnEjecucion"
    );

    if (typeof this.props.descuentoEnEjecucion.data === 'boolean' && !!this.props.descuentoEnEjecucion.data) {
      this.setState({ openModalEjecucion: true })
    } else if (this.props.descuentoEnEjecucion.data.length == 0) {
      this.setState({ openModalError: true })
    } else {
      await this.props.consultaGet(
        RUTAS_API.DESCUENTO_CALIDAD.APLICAR_DESCUENTO,
        {},
        {},
        "descCalidad"
      );
      if (!!this.props.descCalidadResult) {
        if (this.props.descCalidadResult.data.listaTotalPorIndicador.length == 0) {
          this.setState({ openModalError: true });
        } else if (this.props.descCalidadResult.data.codResp == -1) {
          this.setState({ openModal: true });
        }
      }
    }

  };

  handleMock = () => {
    this.setState({ openModal: true });
  };

  render() {
    const { habilitarDescuento, periodoActual, descCalidadResult } = this.props;
    const { openModal, openModalError, openModalEjecucion } = this.state;
    return (
      <div className="centerRow">
        {openModal && (
          <ModalConfirmacionGenerico
            tituloModal={"Error al procesar periodos"}
            mensaje={!!descCalidadResult && descCalidadResult.data.error}
            //mensaje={mockData.error}
            error={true}
            closeModal={this.closeErrorModal}
          />
        )}
        {openModalError && (
          <ModalConfirmacionGenerico
            tituloModal={"Error al procesar descuento"}
            mensaje={"Ocurrió un error en el servicio, por favor intente de nuevo más tarde"}
            error={true}
            closeModal={this.closeErrorModal}
          />
        )}
        {openModalEjecucion && (
          <ModalConfirmacionGenerico
            tituloModal={"Aviso"}
            mensaje={"Ya se encuentra un proceso de descuento en ejecución para la misma empresa, por favor intente de nuevo más tarde"}
            error={true}
            closeModal={this.closeErrorModal}
          />
        )}
        <Form.Group className="divBlueBox">
          <h3 className="modal-title">
            Generación de descuentos de indicadores de calidad
          </h3>
          <Form.Row className="centerElement">
            <Form.Group as={Col} md="6">
              <Form.Label>Periodo a procesar</Form.Label>
              <Form.Control
                id={"periodo"}
                value={!!periodoActual && periodoActual.data[0].nombrePeriodo}
                type="text"
                disabled
              />
            </Form.Group>
          </Form.Row>
          <div style={{ marginTop: "25px" }}>
            {!!descCalidadResult && !!descCalidadResult.data.listaTotalPorIndicador && descCalidadResult.data.listaTotalPorIndicador.length > 0 && (
              <SimpleTable
                columns={columns}
                headers={headers}
                // data={mockData.listaTotalPorIndicador}
                data={
                  !!descCalidadResult
                    ? descCalidadResult.data.listaTotalPorIndicador
                    : []
                }
                totals={totals}
              />
            )}
          </div>
          <Form.Row className="centerElement">
            <Button
              onClick={this.handleSubmit}
              //onClick={this.handleMock}
              disabled={!!habilitarDescuento && !habilitarDescuento.data}
            >
              Procesar
            </Button>
          </Form.Row>
        </Form.Group>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  periodoActual: state.Utils.periodoR,
  habilitarDescuento: state.Utils.habilitarDescuento,
  opcionesTer: state.Utils.opcionesTercero,
  descCalidadResult: state.Utils.descCalidad,
  tipoNota: state.Items.tipoNota,
  descuentoEnEjecucion: state.Utils.descuentoEnEjecucion,
});

const mapDispatchToProps = {
  consultaGet,
};

const DescuentosCalidad = connect(
  mapStateToProps,
  mapDispatchToProps
)(DescuentosCalidadR);

export default DescuentosCalidad;
