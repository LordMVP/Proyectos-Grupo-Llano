import React, { Component, Fragment } from "react";
import "./ComponentsStyles.scss";
import 'react-toastify/dist/ReactToastify.css';

//Table
import Table from "react-table";
import selectTableHOC from "react-table/lib/hoc/selectTable";

//Components
import TextBoxG from "./TextBoxG";
import { Button, Form, Col, Row } from "react-bootstrap";
import Modal from "react-bootstrap4-modal";
import { toast } from "react-toastify";

//Store && Redux
import connect from "react-redux/es/connect/connect";
import { saveItem } from "../../../store/actions/Items";
import { saveConsultaGet, consultaGet, postServiceR } from "../../../store/actions/Utils";

//Constants
import RUTAS_API from "../../../global/rutas_api";
import { mock } from "./MockDataEditableTable";

const SelectTable = selectTableHOC(Table);

class EditTableR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectAll: false,
      selection: [],
      keyField: "idConcepto",
      manual: true,
      porcentual: false,
      vDistribuir: 0,
      totalEmitido: 0,
      primeraEntrada: true,
    };
  }

  componentDidMount() {
    console.log("A ver si imprime las propiedades y las recibe bien: ", this.props);
    this.llamarConceptos();
    //this.props.saveItem({ data: mock, status: 200 }, "dataEditableTable");
    //Reemplazar el saveItem de arriba por el servicio de redux, con nombre "dataEditableTable",
  }

  llamarConceptos = async () => {
    const { numeroFactura, tipoNota } = this.props;
    const params = {
      facIderegistro: numeroFactura,
      tipoNota: tipoNota,
    };

    await this.props.consultaGet(
      RUTAS_API.DETALLE_SUSCRIPCION
        .CONSULTA_CONCEPTOS_FACTURA_DEUDA,
      params,
      {},
      "listaDeConceptos"
    );
    if (!!this.props.listaDeConceptos) {
      console.log("🚀 ~ file: EditTable.js ~ line 62 ~ EditTableR ~ llamarConceptos= ~ this.props.listaDeConceptos", this.props.listaDeConceptos)
      this.setState({ datosDetallados: this.props.listaDeConceptos.data.listaConceptos });
    }
  };

  mostrarToast = (mensaje) => {
    const opciones = {
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      pauseOnVisibilityChange: true,
      position: "top-right",
      autoClose: 8000,
      newestOnTop: false,
      rtl: false,
    };

    toast.warning(mensaje, opciones);
  };

  toggleSelection = (key, shift, row) => {
    let selection = [...this.state.selection];
    const keyIndex = selection.indexOf(key);
    if (keyIndex >= 0) {
      let data = this.state.datosDetallados;
      let index = data.findIndex((item) => item.idConcepto == row.idConcepto);
      data[index] = {
        ...data[index],
        porcentaje: 0,
        valorAdicionar: 0,
        saldo: 0,
        input: true,
      };
      this.setState({ datosDetallados: data });
      //this.props.saveItem({ data: data, status: 200 }, "dataEditableTable");
      selection = [
        ...selection.slice(0, keyIndex),
        ...selection.slice(keyIndex + 1),
      ];
      this.setState({ selectAll: false });
    } else {
      selection.push(key);
    }
    this.setState({ selection }, () => {
      this.calculoPorcentual();
      if (this.state.porcentual) {
        //this.distribuirValor(this.state.vDistribuir);
      }
    });
  };

  toggleAll = () => {
    const { keyField } = this.state;
    const selectAll = !this.state.selectAll;
    const selection = [];

    if (selectAll) {
      const wrappedInstance = this.checkboxTable.getWrappedInstance();
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      currentRecords.forEach((item) => {
        selection.push(`select-${item._original[keyField]}`);
      });
      this.setState({ selection }, () => {
        this.calculoPorcentual();
        if (this.state.porcentual) {
          //this.distribuirValor(this.state.vDistribuir);
        }
      });
    } else {
      let data = this.state.datosDetallados;
      //let data = this.props.dataR.data;
      for (let i = 0; i < data.length; i++) {
        data[i] = {
          ...data[i],
          porcentaje: 0,
          valorAdicionar: 0,
          saldo: 0,
          input: true,
        };
      }
      this.setState({ datosDetallados: data });
      //this.props.saveItem({ data: data, status: 200 }, "dataEditableTable");
    }
    this.setState({ selectAll, selection });
  };

  isSelected = (key) => {
    return this.state.selection.includes(`select-${key}`);
  };

  rowFn = (state, rowInfo, column, instance) => {
    const { selection } = this.state;

    return {
      onClick: (e, handleOriginal) => {
        if (handleOriginal) {
          handleOriginal();
        }
      },
      style: {
        background:
          rowInfo &&
          selection.includes(`select-${rowInfo.original.idConcepto}`) &&
          "rgba(51, 122, 183, 0.3)",
      },
    };
  };

  validarLista = (listaSuscripSeleccionadas) => {
    let listaReplace = [];
    listaSuscripSeleccionadas.forEach((item) => {
      item = item.replace("select-", "");
      listaReplace.push(item);
    });
    return listaReplace;
  };

  handleChange = (id, event, parameter) => {
    event.preventDefault();
    //let inputs = this.props.dataR.data;
    let inputs = this.state.datosDetallados;
    let num = parseFloat(event.target.value);
    inputs[id] = {
      ...inputs[id],
      [parameter]: num,
      saldo: !!num ? parseFloat(inputs[id].valorEmitido) + parseFloat(num) : 0,
    };
    this.setState({ datosDetallados: inputs });
    //this.props.saveItem({ data: inputs, status: 200 }, "dataEditableTable");
  };

  handleChangeValue = (checked, nameActual, nameOther) => {
    this.setState({ [nameActual]: !checked, [nameOther]: checked });
  };

  abstraerElemntoSeleccionados = (data, parametro) => {
    let dataTotal = data;
    let listaId = [];
    let seleccionados = this.validarLista(this.state.selection);
    let listaFiltrada = [];
    for (let i = 0; i < seleccionados.length; i++) {
      const parametroExt = dataTotal.filter(
        (item) => item.idConcepto == seleccionados[i]
      );
      listaId = [...listaId, ...parametroExt];
    }
    listaFiltrada = listaId.map((item) => {
      return item[parametro];
    });
    return listaFiltrada;
  };

  calculatedTotals(data) {
    let totalSum = 0;
    for (let i = 0; i < data.length; i++) {
      totalSum = totalSum + (!!data[i] ? parseFloat(data[i]) : 0);
    }
    return totalSum.toFixed(2);
  }

  calculoPorcentual = () => {
    let data = this.state.datosDetallados;
    //let data = this.props.dataR.data;
    let valores = this.abstraerElemntoSeleccionados(data, "valorEmitido");
    let seleccionados = this.validarLista(this.state.selection);
    let total = this.calculatedTotals(valores);
    for (let i = 0; i < valores.length; i++) {
      let result = (valores[i] / total) * 100;
      let index = data.findIndex((item) => item.idConcepto == seleccionados[i]);
      data[index] = {
        ...data[index],
        porcentaje: !!result ? result.toFixed(2) : 0,
        input: false,
      };
    }
    this.setState({ datosDetallados: data });
    //this.props.saveItem({ data, status: 200 }, "dataEditableTable");
  };

  distribuirValor = () => {
    let data = this.state.datosDetallados;
    //let data = this.props.dataR.data;
    const { vDistribuir } = this.state;
    let seleccionados = this.validarLista(this.state.selection);
    let porcentuales = this.abstraerElemntoSeleccionados(data, "porcentaje");

    if (seleccionados.length == 0) {
      this.mostrarToast(
        "Debe seleccionar por lo menos un concepto para distribuir el valor"
      );
    } else if (vDistribuir <= 0 || !vDistribuir) {
      this.mostrarToast(
        "Por favor digite un valor a distribuir"
      );
    } else {
      for (let i = 0; i < porcentuales.length; i++) {
        let result = (vDistribuir * porcentuales[i]) / 100;
        let index = data.findIndex((item) => item.idConcepto == seleccionados[i]);
        let num = parseFloat(result).toFixed(2);
        data[index] = {
          ...data[index],
          valorAdicionar: num,
          saldo: !!vDistribuir ? parseFloat(data[index].valorEmitido) + parseFloat(num) : 0,
        };
      }
      this.setState({ datosDetallados: data });
      //this.props.saveItem({ data, status: 200 }, "dataEditableTable");
    }

  };

  borrarRadio = () => {
    let data = this.state.datosDetallados;
    //let data = this.props.dataR.data;
    for (let i = 0; i < data.length; i++) {
      data[i] = {
        ...data[i],
        valorAdicionar: 0,
        saldo: 0,
      };
    }
    this.setState({ datosDetallados: data });
    //this.props.saveItem({ data: data, status: 200 }, "dataEditableTable");
  };

  procesarConceptos = async () => {
    const { totalAdicionar, selection } = this.state;
    const { rowInfo } = this.props;
    let data = this.state.datosDetallados;
    //let data = this.props.dataR.data;
    let seleccionados = this.validarLista(selection);
    let totalAdicionarR = 0;
    let concepto = {};
    let conceptosModificados = [];
    console.log("🚀 ~ file: EditTable.js ~ line 258 ~ EditTableR ~ totalAdicionar", totalAdicionar)
    console.log("🚀 ~ file: EditTable.js ~ line 260 ~ EditTableR ~ rowInfo ", rowInfo)

    for (let i = 0; i < seleccionados.length; i++) {
      let index = data.findIndex((item) => item.idConcepto == seleccionados[i]);
      concepto = {
        idConcepto: data[index].idConcepto,
        valorAdiciona: data[index].valorAdicionar,
      }
      conceptosModificados.push(concepto);
      totalAdicionarR = totalAdicionarR + parseFloat(data[index].valorAdicionar);
    }

    console.log("🚀 ~ file: EditTable.js ~ line 285 ~ EditTableR ~ conceptosModificados", conceptosModificados)

    rowInfo.original['valorAAjustar'] = parseFloat(totalAdicionarR);
    console.log("RowInfo después de modificarlo: ", rowInfo)

    const { numeroFactura, tipoNota } = this.props;
    const params = {
      listaConceptos: conceptosModificados,
      idFactura: numeroFactura,
      tipoNota: tipoNota,
    };
    console.log("🚀 ~ file: EditTable.js ~ line 322 ~ EditTableR ~ procesarConceptos= ~ params", params)

    await this.props.postServiceR(
      RUTAS_API.DETALLE_SUSCRIPCION
        .GUARDAR_CONCEPTOS_FACTURA_DEUDA,
      params,
      {},
      "guardarConceptos"
    );

    console.log("Quiere procesar los conceptos modificados")
    this.props.saveItem(false, "mostrarModalConceptoEditable")

    /* 
    Acá va el llamado al servicio de guardar de pedro
    */
  }

  setTotalAdcionar = (totalAdicionar) => {
    this.setState({ totalAdicionar: totalAdicionar })
  }

  inputElement = (row) => {
    //const { dataR } = this.props;
    let dataR = this.state.datosDetallados;
    //const { dataR } = this.state.datosDetallados;
    return (
      <div style={{ textAlign: "center" }} key={`div-${row.index}`}>
        <TextBoxG
          md="12"
          id={`Input-${row.index}`}
          key={`Input-${row.index}`}
          value={!!dataR ? dataR[row.index].valorAdicionar : 0}
          onChange={(event) =>
            this.handleChange(row.index, event, "valorAdicionar")
          }
          type="number"
          min={0}
          max={parseFloat(row.original.valorEmitido)}
          disabled={this.state.porcentual || row.original.input}
        />
      </div>
    );
  };

  render() {
    const { dataR, listaDeConceptos, numeroFactura, closeModal } = this.props;
    const {
      selectAll,
      porcentual,
      manual,
      vDistribuir,
      selection,
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
          let valoreSelect = this.abstraerElemntoSeleccionados(
            !!datosDetallados ? datosDetallados : [],
            "valorEmitido"
          );
          return this.calculatedTotals(valoreSelect);
        },
      },
      {
        Header: "Valor a Adicionar",
        accessor: "valorAdicionar",
        Cell: this.inputElement,
        minWidth: 150,
        headerClassName: "headerTableTextStyle",
        Footer: () => {
          let valoreSelect = this.abstraerElemntoSeleccionados(
            !!datosDetallados ? datosDetallados : [],
            "valorAdicionar"
          );
          return this.calculatedTotals(valoreSelect)
        },
      },
      {
        Header: "%",
        Cell: (row) => (
          <div style={{ textAlign: "center" }}>
            {parseFloat(row.original.porcentaje).toFixed(2)}
          </div>
        ),
        minWidth: 40,
        headerClassName: "headerTableTextStyle",
        Footer: () => (selection.length > 0 ? 100 : 0),
        // let valoreSelect = this.abstraerElemntoSeleccionados(
        //   !!dataR ? dataR.data : [],
        //   "porcent"
        // );
        // return this.calculatedTotals(valoreSelect);
      },
      {
        Header: "Saldo",
        accessor: "saldo",
        minWidth: 70,
        headerClassName: "headerTableTextStyle",
        Footer: () => {
          let valoreSelect = this.abstraerElemntoSeleccionados(
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
          dialogClassName="modal-lg-custom"

        >
          <div className="modal-header">
            <h2 className="modal-title">
              Adición de valores por concepto
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
                      <strong>Nombre tercero: </strong>
                      {listaDeConceptos.data.nombreTercero}
                    </Form.Label>
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Button variant="primary" onClick={this.procesarConceptos}>
                      Aplicar aumento de deuda
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
                <Form.Group as={Col} md="12" className={"background-blue p-3"}>
                  <Row>
                    <div className={"col-md-6 flexbox-align-center"}>
                      <label htmlFor="manual" className={"margin-space"}>
                        Distribución manual
                      </label>
                      <input
                        id={"manual"}
                        type="radio"
                        checked={manual}
                        className={"margin-space"}
                        onChange={() => {
                          this.handleChangeValue(manual, "manual", "porcentual");
                          this.setState({ vDistribuir: 0 });
                          this.borrarRadio();
                        }}
                      />
                      <label htmlFor="porcentual" className={"margin-space"}>
                        Distribución porcentual
                      </label>
                      <input
                        id={"porcentual"}
                        type="radio"
                        checked={porcentual}
                        className={"margin-space"}
                        onChange={() => {
                          this.handleChangeValue(porcentual, "porcentual", "manual");
                          this.borrarRadio();
                        }}
                      />
                    </div>
                    <div className={"col-md-6 flexbox-align-center"}>
                      <label htmlFor="vDistribuir" className={"margin-space"}>
                        Valor a distribuir
                      </label>
                      <TextBoxG
                        classfordiv={"no-margin"}
                        md="5"
                        id={"vDistribuir"}
                        value={vDistribuir}
                        min={0}
                        onChange={(event) =>
                          this.setState(
                            { vDistribuir: parseFloat(event.target.value) },
                            /*() => {
                              this.distribuirValor(this.state.vDistribuir);
                            }*/
                          )
                        }
                        type="number"
                        disabled={manual}
                      />
                      <Button variant="primary" onClick={this.distribuirValor}
                        disabled={!porcentual ? true : false}>
                        Distribuir
                      </Button>
                    </div>
                  </Row>
                </Form.Group>
                <SelectTable
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
                  ref={(r) => (this.checkboxTable = r)}
                  toggleSelection={this.toggleSelection}
                  selectAll={selectAll}
                  selectType="checkbox"
                  keyField="idConcepto"
                  defaultPageSize={5}
                  toggleAll={this.toggleAll}
                  isSelected={this.isSelected}
                  getTrProps={this.rowFn}
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
  dataR: state.Items.dataEditableTable,
  totalEmitidR: state.Items.totalEmitido,
  tipoNota: state.Items.tipoNota,
  listaDeConceptos: state.Utils.listaDeConceptos,
  mostrarModalConceptoEditable: state.Items.mostrarModalConceptoEditable,
  guardarConceptos: state.Utils.guardarConceptos,
});

const mapDispatchToProps = {
  consultaGet,
  saveItem,
  saveConsultaGet,
  postServiceR,
};

const EditTable = connect(mapStateToProps, mapDispatchToProps)(EditTableR);

export default EditTable;
