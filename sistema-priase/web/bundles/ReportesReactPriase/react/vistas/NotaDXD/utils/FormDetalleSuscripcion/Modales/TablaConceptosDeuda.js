import React, { Component, Fragment } from "react";
import "../../../../Utils/components/ComponentsStyles.scss";

//Table
import ReactTable from "react-table";

//Components
import { Button, Form, Col } from "react-bootstrap";
import Modal from "react-bootstrap4-modal";

//Store && Redux
import connect from "react-redux/es/connect/connect";
import { saveItem } from "../../../../../store/actions/Items";
import { saveConsultaGet, consultaGet, postServiceR } from "../../../../../store/actions/Utils";

//Constants
import RUTAS_API from "../../../../../global/rutas_api";

class TablaConceptosDeudaR extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.llamarConceptos();
  }

  llamarConceptos = async () => {
    const { numeroFactura, tipoNota } = this.props;
    const params = {
      facIderegistro: numeroFactura,
      tipoNota: tipoNota,
    };

    await this.props.consultaGet(
      RUTAS_API.DETALLE_SUSCRIPCION
        .CONSULTA_DETALLE_CONCEPTOS_FACTURA_DEUDA,
      params,
      {},
      "listaDeConceptos"
    );
    if (!!this.props.listaDeConceptos) {
      this.setState({ datosDetallados: this.props.listaDeConceptos.data.listaConceptos });
    }
  };

  abstraerTotalElemntos = (data, parametro) => {
    const { accionARealizar } = this.props;
    let dataTotal = data;
    let listaFiltrada = [];
    if (parametro == "saldo") {
      listaFiltrada = dataTotal.map((item) => {
        if (accionARealizar == 1) {
          return item["valorAdicionar"] + item["valorEmitido"];
        } else {
          return 0;
        }
      });
    } else {
      listaFiltrada = dataTotal.map((item) => {
        return item[parametro];
      });
    }
    return listaFiltrada;
  };

  calculatedTotals(data) {
    let totalSum = 0;
    for (let i = 0; i < data.length; i++) {
      totalSum = totalSum + (!!data[i] ? parseFloat(data[i]) : 0);
    }
    return totalSum.toFixed(2);
  }

  render() {
    const { listaDeConceptos, numeroFactura, closeModal, accionARealizar, suscripcion } = this.props;
    const {
      datosDetallados,
    } = this.state;

    const columnsWithForm = [
      {
        Header: "Conceptos Afectados",
        accessor: "nombreConcepto",
        minWidth: 140,
        headerClassName: "headerTableTextStyle",
        Footer: "Totales",
      },
      {
        Header: "Valor Emitido",
        accessor: "valorEmitido",
        minWidth: 80,
        headerClassName: "headerTableTextStyle",
        Footer: () => {
          let valoreSelect = this.abstraerTotalElemntos(
            !!datosDetallados ? datosDetallados : [],
            "valorEmitido"
          );
          return this.calculatedTotals(valoreSelect);
        },
      },
      {
        Header: () => { return accionARealizar == 1 ? "Valor inclusión" : "Valor eliminado" },
        accessor: "valorAdicionar",
        Cell: (row) => <div>{accionARealizar == 1 ? parseFloat(row.value) : parseFloat(row.original.valorEmitido)}</div>,
        minWidth: 80,
        headerClassName: "headerTableTextStyle",
        Footer: () => {
          let valoreSelect = this.abstraerTotalElemntos(
            !!datosDetallados ? datosDetallados : [],
            "valorAdicionar"
          );
          return this.calculatedTotals(valoreSelect)
        },
      },
      {
        Header: "Valor real aplicado",
        accessor: "saldo",
        Cell: (row) => <div>{accionARealizar == 1 ? parseFloat(row.original.valorEmitido) + parseFloat(row.original.valorAdicionar) : 0}</div>,
        minWidth: 80,
        headerClassName: "headerTableTextStyle",
        Footer: () => {
          let valoreSelect = this.abstraerTotalElemntos(
            !!datosDetallados ? datosDetallados : [],
            "saldo"
          );
          return this.calculatedTotals(valoreSelect);
        },
      },
    ];
    return (
      <Fragment>
        <Modal
          visible={true}
          dialogClassName="modal-lg-custom">
          <div className="modal-header">
            <h2 className="modal-title">
              Detalle de valores por concepto
            </h2>
          </div>
          {!!datosDetallados && datosDetallados.length > 0 ? (
            <div className="modal-body">
              <div>
                <Form.Row>
                  <Form.Group as={Col} md="4">
                    <Form.Label>
                      <strong>Factura: </strong>
                      {numeroFactura}
                    </Form.Label>
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label>
                      <strong>Id. suscripción: </strong>
                      {suscripcion}
                    </Form.Label>
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Button variant="primary" onClick={closeModal}>
                      Regresar al listado
                    </Button>
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} md="4">
                    <Form.Label>
                      <strong>Documento: </strong>
                      {listaDeConceptos.data.documento}
                    </Form.Label>
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label>
                      <strong>Tipo de documento: </strong>
                      {listaDeConceptos.data.tipoDocumento}
                    </Form.Label>
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label>
                      <strong>Dirección: </strong>
                      {listaDeConceptos.data.direccion}
                    </Form.Label>
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      <strong>Código anterior: </strong>
                      {listaDeConceptos.data.codigoAnterior}
                    </Form.Label>
                  </Form.Group>
                </Form.Row>
              </div>
              <hr style={{ borderTop: "1px solid #007bff" }} />
              <div>
                <ReactTable
                  data={!!datosDetallados ? datosDetallados : []}
                  columns={columnsWithForm}
                  sortable={false}
                  ofText="de"
                  nextText="Siguiente"
                  pageText="Página"
                  previousText="Anterior"
                  noDataText="No se encontraron resultados"
                  loadingText="Cargando..."
                  rowsText="Filas"
                  defaultPageSize={5}
                  showPageJump={false}
                />
              </div>
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
      </Fragment >
    );
  }
}
const mapStateToProps = (state) => ({
  totalEmitidR: state.Items.totalEmitido,
  tipoNota: state.Items.tipoNota,
  listaDeConceptos: state.Utils.listaDeConceptos,
  mostrarModalConceptoEditable: state.Items.mostrarModalConceptoEditable,
  guardarConceptos: state.Utils.guardarConceptos,
  accionARealizar: state.Items.AccionARealizar,
});

const mapDispatchToProps = {
  consultaGet,
  saveItem,
  saveConsultaGet,
  postServiceR,
};

const TablaConceptosDeuda = connect(mapStateToProps, mapDispatchToProps)(TablaConceptosDeudaR);

export default TablaConceptosDeuda;
