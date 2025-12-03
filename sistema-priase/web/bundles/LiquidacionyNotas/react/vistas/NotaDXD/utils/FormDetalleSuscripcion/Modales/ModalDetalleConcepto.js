import React, { Component, Fragment } from "react";
import connect from "react-redux/es/connect/connect";
import Modal from "react-bootstrap4-modal";
import { Button, Form, Col, Table } from "react-bootstrap";
import RUTAS_API from "../../../../../global/rutas_api";
import { consultaGet } from "../../../../../store/actions/Utils";
import { saveItem } from "../../../../../store/actions/Items";
import { PROGRAMAS } from "../../../../../global/constantes";

import "react-table/react-table.css";
import "../FormDetalleSuscripcion.scss";

class RModalDetalleConcepto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datosDetallados: [],
    };
  }

  componentDidMount() {
    this.llamarConceptos();
  }

  /**
   * Método encargado de obtener los conceptos por cada suscripción reliquidada
   */
  llamarConceptos = async () => {
    const { numeroFactura } = this.props;
    const params = {
      facIderegistro: numeroFactura,
    };
    await this.props.consultaGet(
      RUTAS_API.DETALLE_SUSCRIPCION
        .CONSULTA_CONCEPTOS_SUSCRIPCIONES_RELIQUIDADAS,
      params,
      {},
      "listaDeConceptos"
    );
    if (!!this.props.listaDeConceptos) {
      this.setState({ datosDetallados: this.props.listaDeConceptos.data });
    }
  };

  /**
   * Método encargado de validar el tipo de nota y definir las cabeceras de las columnas de la tabla
   * de conceptos
   * @returns 
   */
  validarColumnas = () => {
    const { tipoNota } = this.props;
    let nota;
    if (tipoNota == PROGRAMAS.DESCUENTO_DESHABITADO) {
      nota = "deshabitado";
    } else if (tipoNota == PROGRAMAS.DESCUENTO_PUERTA_PUERTA) {
      nota = "puerta a puerta";
    } else if (tipoNota == PROGRAMAS.CAMBIO_ESTRATO) {
      nota = "estrato";
    } else if (tipoNota == PROGRAMAS.CAMBIO_TIPOUSO) {
      nota = "tipo de uso";
    } else if (tipoNota == PROGRAMAS.AFORO_EXTRAORDINARIO) {
      nota = "aforo extraordinario";
    }

    return (
      <tr>
        <th>Concepto</th>
        <th>Tarifa final facturada</th>
        <th>Tarifa final {nota}</th>
        <th>Total dscto. {nota}</th>
      </tr>
    );
  };

  /**
   * Método encargado de validar el título del modal según el tipo de nota
   * @returns 
   */
  validarTitulo = () => {
    const { tipoNota } = this.props;
    let nota;
    if (tipoNota == PROGRAMAS.DESCUENTO_DESHABITADO) {
      nota = "por descuento deshabitado";
    } else if (tipoNota == PROGRAMAS.DESCUENTO_PUERTA_PUERTA) {
      nota = "por descuento puerta a puerta";
    } else if (tipoNota == PROGRAMAS.CAMBIO_ESTRATO) {
      nota = "por cambio de estrato";
    } else if (tipoNota == PROGRAMAS.CAMBIO_TIPOUSO) {
      nota = "por cambio de tipo de uso";
    } else if (tipoNota == PROGRAMAS.AFORO_EXTRAORDINARIO) {
      nota = "por aforo extraordinario";
    }

    return (
      <h2 className="modal-title">
        Detalle del descuento retroactivo {nota}
      </h2>
    );
  }

  render() {
    const { closeModal } = this.props;
    const { datosDetallados } = this.state;
    return (
      <Fragment>
        <Modal
          visible={true}
          onClickBackdrop={closeModal}
          dialogClassName="modal-lg"
        >
          <div className="modal-header">
            {this.validarTitulo()}
          </div>
          {datosDetallados.length > 0 ? (
            <div className="modal-body">
              <div>
                <Form.Row>
                  <Form.Group as={Col} md="4">
                    <Form.Label>
                      <strong>Suscripción: </strong>
                      {datosDetallados[0].idSuscripcion}
                    </Form.Label>
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label>
                      <strong>Tercero: </strong>
                      {datosDetallados[0].nombreTercero}
                    </Form.Label>
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label>
                      <strong>Dirección: </strong>
                      {datosDetallados[0].direccion}
                    </Form.Label>
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} md="4">
                    <Form.Label>
                      <strong>Num. documento: </strong>
                      {datosDetallados[0].documentoTercero}
                    </Form.Label>
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label>
                      <strong>Documento: </strong>
                      {datosDetallados[0].documento}
                    </Form.Label>
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label>
                      <strong>Tipo de documento: </strong>
                      {datosDetallados[0].tipoDocumento}
                    </Form.Label>
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label>
                      <strong>Periodo: </strong>
                      {datosDetallados[0].periodo}
                    </Form.Label>
                  </Form.Group>
                </Form.Row>
              </div>
              <Table striped hover>
                <thead>{this.validarColumnas()}</thead>
                <tbody>
                  {datosDetallados.map((concepto, index) => (
                    <tr key={`concep-${index}`}>
                      <td>{concepto.nombreConcepto}</td>
                      <td>{concepto.tarifaFinalFacturada}</td>
                      <td>{concepto.tarifaFinalDescuento}</td>
                      <td>{concepto.totalDescuento}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="modal-body">No se encontraron datos</div>
          )}
          <div className="modal-footer">
            <Button variant="primary" onClick={closeModal}>
              Regresar al listado
            </Button>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  listaDeConceptos: state.Utils.listaDeConceptos,
  tipoNota: state.Items.tipoNota,
});

const mapDispatchToProps = {
  consultaGet,
  saveItem,
};

export const ModalDetalleConcepto = connect(
  mapStateToProps,
  mapDispatchToProps
)(RModalDetalleConcepto);