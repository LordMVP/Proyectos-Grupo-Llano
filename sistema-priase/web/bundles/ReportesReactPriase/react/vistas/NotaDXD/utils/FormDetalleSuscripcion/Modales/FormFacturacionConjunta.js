import React, { Component, Fragment } from "react";
import connect from "react-redux/es/connect/connect";
import Modal from "react-bootstrap4-modal";
import { Button, Form, Col, Container, Row } from "react-bootstrap";
import RUTAS_API from "../../../../../global/rutas_api";
import { consultaGet } from "../../../../../store/actions/Utils";
import { saveItem } from "../../../../../store/actions/Items";
import ModalCambioDatos from "./ModalCambioDatos";

import "react-table/react-table.css";
import "../FormDetalleSuscripcion.scss";

class FormFacturacionConjuntaExp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      empresaId: "",
      numeroMedidor: "",
      codigoAnterior: "",
      modalCambioDatos: false,
    };
  }

  componentDidMount() {
    !this.props.companyList && this.callCompanyList();
  }

  callCompanyList = () => {
    this.props.consultaGet(
      RUTAS_API.EMPRESAS.LIST_EMPRESAS,
      {},
      {},
      "empresasList"
    );
  };

  callIdWhitMeasurer = (empresaId, numeroMedidor, codigoAnterior) => {
    this.props.consultaGet(
      RUTAS_API.DETALLE_SUSCRIPCION.CONSULTA_POR_MEDIDOR,
      { empresaId, numeroMedidor, codigoAnterior },
      {},
      "datallePorMedidor"
    );
  };

  handleSubmit = () => {
    this.callIdWhitMeasurer(
      this.state.empresaId,
      this.state.numeroMedidor,
      this.state.codigoAnterior
    );
  };

  handleChangeText = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleReturnId = () => {
    this.setState({ modalCambioDatos: true });
  };

  reemplazarCambioDatos = () => {
    this.props.saveItem(
      !!this.props.detalle ? this.props.detalle.data[0] : {},
      "IdSuscripcion"
    );
    this.props.saveItem({}, "emptyShot");
    this.props.closeModal();
  };

  changevalue = (nameValue, value) => {
    this.setState({ [nameValue]: value });
  };

  cerrarModalCambioDatos = () => {
    this.setState({ modalCambioDatos: false });
    this.props.closeModal();
  };

  render() {
    const { closeModal, detalle, companyList } = this.props;
    const {
      empresaId,
      numeroMedidor,
      codigoAnterior,
      modalCambioDatos,
    } = this.state;

    return (
      <Fragment>
        {modalCambioDatos && (
          <ModalCambioDatos
            cerrarModal={this.cerrarModalCambioDatos}
            aceptarModal={this.reemplazarCambioDatos}
            mensaje={"¿Desea reemplazar los datos actuales en el filtro de búsqueda?"}
            titulo={"Cambio de datos"}
            aceptarOption={true}
          />
        )}
        <Modal visible={true} onClickBackdrop={closeModal}>
          <div className="modal-header">
            <h5 className="modal-title">
              Búsqueda por datos de Facturación conjunta
            </h5>
          </div>
          <div className="modal-body">
            <div>
              <Form.Row>
                <Form.Group as={Col} md="4">
                  <Form.Label>Empresa</Form.Label>
                  <Form.Control
                    id={"empresaId"}
                    as="select"
                    custom
                    value={empresaId}
                    onChange={this.handleChangeText}
                  >
                    <option value={""}>-- N/A --</option>
                    {!!companyList &&
                      companyList.data.map((company, index) => (
                        <option key={index} value={company.empresaCod}>
                          {company.empresaNom}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>No. Medidor</Form.Label>
                  <Form.Control
                    id={"numeroMedidor"}
                    value={numeroMedidor}
                    onChange={this.handleChangeText}
                    type="number"
                    placeholder="Codigo"
                  />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Cod. Anterior</Form.Label>
                  <Form.Control
                    id={"codigoAnterior"}
                    value={codigoAnterior}
                    onChange={this.handleChangeText}
                    type="number"
                    placeholder="Codigo"
                  />
                </Form.Group>
                <Button
                  className={"button"}
                  disabled={
                    !(
                      (!!numeroMedidor && !!empresaId) ||
                      (!!codigoAnterior && !!empresaId)
                    )
                  }
                  onClick={() => this.handleSubmit()}
                >
                  Buscar
                </Button>
              </Form.Row>
            </div>
            <Container className="form-container">
              <Row>
                <Col>Código</Col>
                <Col>Suscriptor</Col>
                <Col>Suscripción Aseo</Col>
              </Row>
              {!!detalle &&
                detalle.data.map((det, indexDet) => (
                  <Row key={indexDet}>
                    <Col>{det.idSuscripcion}</Col>
                    <Col>{det.nombreCompletoTercero}</Col>
                    <Col>
                      {!!det.suscripcionAseo
                        ? det.suscripcionAseo
                        : "No presenta facturación conjunta"}
                    </Col>
                  </Row>
                ))}

              <Row className="justify-content-md-center">
                <Col className="flex_center" md="auto">
                  <Button
                    className={"button_end"}
                    disabled={
                      !(
                        !!detalle &&
                        !!detalle.data[0] &&
                        !!detalle.data[0].suscripcionAseo
                      )
                    }
                    onClick={this.reemplazarCambioDatos}
                  >
                    Aceptar
                  </Button>
                </Col>
                <Col className="flex_center" md="auto">
                  <Button className={"button_end"} onClick={closeModal}>
                    Cancelar
                  </Button>
                </Col>
              </Row>
            </Container>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    companyList: state.Utils.empresasList,
    detalle: state.Utils.datallePorMedidor,
  };
};

const mapDispatchToProps = {
  consultaGet,
  saveItem,
};

export const FormFacturacionConjunta = connect(
  mapStateToProps,
  mapDispatchToProps
)(FormFacturacionConjuntaExp);