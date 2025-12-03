import React, { Component, Fragment } from "react";
import connect from "react-redux/es/connect/connect";
import "react-table/react-table.css";
import "./TablaDetalleFuturo.scss";
import Table from "react-table";
import selectTableHOC from "react-table/lib/hoc/selectTable";
import Button from "react-bootstrap/Button";
import {
  CONCEPTO_NOTA,
  PROGRAMAS,
} from "../../../../global/constantes";
import CheckBoxTable from "../../../Utils/components/CheckBoxTable";

import { ModalConfirmacionGenerico } from "../FormDetalleSuscripcion/Modales/ModalConfirmacionGenerico";

//Actions Redux
import { saveItem } from "../../../../store/actions/Items";
import {
  consultaGet,
  saveConsultaGet,
  postServiceR,
  savePostService,
} from "../../../../store/actions/Utils";
import { downloadFiles } from "../../../../store/servicios/DownloadFiles";

import RUTAS_API from "../../../../global/rutas_api";

import PropTypes from "prop-types";

const SelectTable = selectTableHOC(Table);

export class TablaDetalleFuturo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //Variables de manejo de la información de la tabla
      listaMarcacionTarifaSeleccionada: [],
      keyField: "idSuscripcion",
      selectAll: false,
      selection: [],
      //pages: 0,
      listaMarcacionTarifaState: this.props.listaMarcacionTarifa,
      page: 0,
      openModalConfirMarcaFuturo: false,
      mensaje: "",
      tituloModal: "",
      errorMarcacion: false,
    };
  }

  componentDidMount() {
    this.setState({ selectAll: false, selection: [] });
  }

  downloadFile(nameFile, formatFile) {
    const params = {
      listaSuscripciones: this.props.listaOriginal.toString(),
      typeFile: formatFile,
    };
    const ruta = RUTAS_API.DOWNLOADFILES.LIQUIDACIONESFUTURO;

    downloadFiles(ruta, nameFile, params, formatFile);
  }

  /**
   * Método encargado de actualizar el componente cada vez que se realice una consulta diferente o una consulta con otros
   * datos en el formulario de búsqueda de detalles de suscripción
   *
   * @param {*} prevProps props previas
   */
  componentDidUpdate(prevProps) {
    if (prevProps.listaMarcacionTarifa !== this.props.listaMarcacionTarifa) {
      this.setState({
        listaMarcacionTarifaState: this.props.listaMarcacionTarifa.data.data,
        pages: this.props.listaMarcacionTarifa.data.paginas,
        //selection: [],
        selectAll: false, //this.state.pages == 1 ? 1 : this.state.page
      });
    }
    /*if (prevProps.listaMarcacionTarifaR !== this.props.listaMarcacionTarifaR) {
      this.setState({
        listaMarcacionTarifaState: this.props.listaMarcacionTarifaR.data.data,
        page: 0,
        selection: [],
        selectAll: false, //this.state.pages == 1 ? 1 : this.state.page
      });
    }*/
  }

  /**
   * Método encargado de almacenar en una lista los objetos seleccionados individualmente
   */
  toggleSelection = (key, shift, row) => {
    // start off with the existing state
    let selection = [...this.state.selection];
    const keyIndex = selection.indexOf(key);
    if (!shift) {
      // check to see if the key exists
      if (keyIndex >= 0) {
        // it does exist so we will remove it using destructing
        selection = [
          ...selection.slice(0, keyIndex),
          ...selection.slice(keyIndex + 1),
        ];
        this.setState({ selectAll: false });
      } else {
        // it does not exist so add it
        selection.push(key);
      }
      // update the state
      this.setState({ selection }, () =>
        this.validateSelectAll(this.state.listaMarcacionTarifaState)
      );
    }
  };

  /**
   * Método encargado de almacenar en una lista los objetos seleccionados por medio del select all
   */
  toggleAll = () => {
    const { keyField } = this.state;
    const selectAll = !this.state.selectAll;
    let selection = [...this.state.selection];

    if (selectAll) {
      // we need to get at the internals of ReactTable
      const wrappedInstance = this.checkboxTable.getWrappedInstance();
      // the 'sortedData' property contains the currently accessible records based on the filter and sort
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      // we just push all the IDs onto the selection array
      currentRecords.forEach((item) => {
        console.log(
          "🚀 ~ file: TablaDetalleFuturo.js ~ line 117 ~ TablaDetalleFuturo ~ currentRecords.forEach ~ item",
          item
        );
        console.log(
          "🚀 ~ file: TablaDetalleFuturo.js ~ line 119 ~ TablaDetalleFuturo ~ currentRecords.forEach ~ item._original[seCruza]",
          item._original["seCruza"]
        );
        if (!item._original["seCruza"]) {
          if (!selection.includes(`select-${item._original[keyField]}`)) {
            selection.push(`select-${item._original[keyField]}`);
          }
        }
      });
    } else if (!selectAll) {
      // we need to get at the internals of ReactTable
      const wrappedInstance = this.checkboxTable.getWrappedInstance();
      // the 'sortedData' property contains the currently accessible records based on the filter and sort
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      // we just push all the IDs onto the selection array
      currentRecords.forEach((item) => {
        if (!item._original["seCruza"]) {
          console.log(
            "🚀 ~ file: TablaDetalleFuturo.js ~ line 132 ~ TablaDetalleFuturo ~ currentRecords.forEach ~ item",
            item
          );
          //selection.push(`select-${item._original[keyField]}`);
          const keyIndex = selection.indexOf(
            `select-${item._original[keyField]}`
          );
          selection = [
            ...selection.slice(0, keyIndex),
            ...selection.slice(keyIndex + 1),
          ];
        }
      });
    }
    this.setState({ selectAll, selection }, () =>
      console.log(
        "Lista al seleccionar uno en toggleAll: ",
        this.state.selection
      )
    );
  };

  /**
   * Método encargado de validar si una fila está seleccionada o no por medio de su identificador
   *
   * @param {*} key identificador único de la fila
   */
  isSelected = (key) => {
    return this.state.selection.includes(`select-${key}`);
  };

  /**
   * Método encargado de crear la columna de filas seleccionables y cambiar el estilo al ser seleccionada
   */
  rowFn = (state, rowInfo, column, instance) => {
    const { selection } = this.state;
    return {
      onClick: (e, handleOriginal) => {
        console.log("It was in this row:", rowInfo);
        if (handleOriginal) {
          handleOriginal();
        }
      },
      style: {
        background:
          rowInfo &&
          selection.includes(`select-${rowInfo.original.idSuscripcion}`) &&
          "rgba(51, 122, 183, 0.3)",
      },
    };
  };

  /**
   * Método encargado de hacer la consulta paginada cada que se hace clic en el botón anterior o siguiente del paginador
   *
   * @param {*} page Página que se desea consultar en el servicio
   * @param {*} pageSize Número de registros que se van a mostrar por página
   */
  consultaMarcacionTarifa = async (page, pageSize) => {
    const {
      tipoNota,
      vigenciaDesde,
      vigenciaHasta,
      listaOriginal,
    } = this.props;
    let conceptoNota = this.validarConceptoNota(tipoNota);
    const params = {
      listaSuscripciones: listaOriginal,
      conceptoNota,
      vigenciaDesde,
      vigenciaHasta,
      pagina: page,
      tamanoPagina: pageSize,
    };

    this.props.savePostService(undefined, "listaMarcacionTarifa");
    const listaMarcacionTarifa = await this.props.postServiceR(
      RUTAS_API.DETALLE_SUSCRIPCION.CONSULTA_MARCACION_TARIFA,
      params,
      {},
      "listaMarcacionTarifa"
    );
    if (!!listaMarcacionTarifa.data) {
      this.setState(
        {
          listaMarcacionTarifaState: listaMarcacionTarifa.data,
          paginas: listaMarcacionTarifa.paginas,
        },
        () => this.validateSelectAll(this.state.listaMarcacionTarifaState)
      );
    }
    /*if (!!this.props.listaMarcacionTarifa.data || !!this.props.listaMarcacionTarifaR.data) {
      if (!!this.props.listaMarcacionTarifaR.data) {
        this.setState({
          listaMarcacionTarifaState: this.props.listaMarcacionTarifaR.data.data,
          paginas: this.props.listaMarcacionTarifaR.data.paginas,
        }, () => this.validateSelectAll(this.state.listaMarcacionTarifaState));
      } else {
        this.setState({
          listaMarcacionTarifaState: this.props.listaMarcacionTarifa.data.data,
          paginas: this.props.listaMarcacionTarifa.data.paginas,
        }, () => this.validateSelectAll(this.state.listaMarcacionTarifaState));
      }
    }*/
  };

  confirmarCambios = async () => {
    const { tipoNota, vigenciaDesde, vigenciaHasta } = this.props;
    const { selection } = this.state;
    let listaOriginal = this.validarLista(selection);

    let conceptoNota = this.validarConceptoNota(tipoNota);

    const params = {
      listaSuscripciones: listaOriginal,
      vigenciaDesde,
      vigenciaHasta,
      conceptoNota,
    };

    await this.props.postServiceR(
      RUTAS_API.COSU_CONSUSCRIP.MARCACION_TARIFA,
      params,
      {},
      "listaMarcacionDeshabitado"
    );
    if (this.props.listaMarcacionDeshabitadoR.data.length > 0) {
      this.setState({
        openModalConfirMarcaFuturo: true,
        mensaje:
          "Se aplicaron correctamente los cambios para las suscripciones seleccionadas",
        errorMarcacion: false,
        tituloModal: "Resultado de la marcación a futuro",
      });
    } else {
      this.setState({
        openModalConfirMarcaFuturo: true,
        mensaje:
          "Tenemos inconvenientes con el servicio en este momento, por favor intente de nuevo más tarde",
        errorMarcacion: true,
        tituloModal: "Resultado de la marcación a futuro",
      });
    }
  };

  validarConceptoNota = (tipoNota) => {
    let conceptoNota;
    if (tipoNota == PROGRAMAS.DESCUENTO_DESHABITADO) {
      conceptoNota = CONCEPTO_NOTA.DESCUENTO_POR_DESHABITADO;
    } else if (tipoNota == PROGRAMAS.DESCUENTO_PUERTA_PUERTA) {
      conceptoNota = CONCEPTO_NOTA.DESCUENTO_PUERTA_PUERTA;
    }
    return conceptoNota;
  };

  /**
   * Método encargado de validar los elementos seleccionados para que no se repitan en la lista una vez se daclic en el de seleccionar todos
   *
   * @param {*} lista lista de objetos actuales consultados según la página
   */
  validateSelectAll = (lista) => {
    const selection = this.state.selection;
    const originalList = [];
    lista.forEach((item) => {
      if (!item.seCruza) {
        originalList.push(`select-${item.idSuscripcion}`);
      }
    });
    var result = originalList.every(function (val) {
      return selection.indexOf(val) >= 0;
    });
    this.setState({ selectAll: result }, () =>
      console.log(
        "Lista al seleccionar uno en toggleSelection: ",
        this.state.selection
      )
    );
  };

  /**
   * Método encargado de retornar una lista limpia de los id de suscripción seleccionados
   * en la tabla de resultados de la aplicación
   *
   * @param {*} listaSuscripSeleccionadas
   */
  validarLista = (listaSuscripSeleccionadas) => {
    let listaReplace = [];
    listaSuscripSeleccionadas.forEach((item) => {
      item = item.replace("select-", "");
      listaReplace.push(item);
    });
    return listaReplace;
  };

  closeModal = () => {
    this.setState({ openModalConfirMarcaFuturo: false });
  };

  cancelarMarcacion = () => {
    let returnPage = this.props.returnPage;
    this.props.saveItem(returnPage + 1, "returnPage");
    this.props.saveItem(false, "pintarTablaMarcacion");
    this.props.saveItem(true, "banderaDeshahTabla");
  };

  render() {
    //const { paginas } = this.props;

    const {
      listaMarcacionTarifaState,
      selection,
      openModalConfirMarcaFuturo,
      mensaje,
      errorMarcacion,
      tituloModal,
      paginas,
    } = this.state;

    const columns = [
      {
        Header: "ID de suscripción",
        accessor: "idSuscripcion",
        minWidth: 140,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Tipo de uso",
        accessor: "tipoUso",
        minWidth: 160,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Código anterior",
        accessor: "codigoAnterior",
        minWidth: 140,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Fecha desde",
        accessor: "periodoDesde",
        minWidth: 140,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Fecha hasta",
        accessor: "periodoHasta",
        minWidth: 140,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Ciclo",
        accessor: "ciclo",
        minWidth: 230,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Empresa alterna",
        accessor: "empresaAlterna",
        minWidth: 210,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Estrato",
        accessor: "estrato",
        minWidth: 70,
        Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Acción de marcación",
        accessor: "accionDeMarcacion",
        minWidth: 360,
        headerClassName: "headerTableTextStyle",
      },
    ];

    return (
      <Fragment>
        <h2>Tabla de resultados</h2>
        <div className="mb-4">
          <Button
            className={"margin-r"}
            variant="primary"
            onClick={() =>
              this.downloadFile("suscripciones_reliquidadas_futuro", "xls")
            }
            disabled={
              !!!this.props.listaOriginal &&
              this.props.listaOriginal.length === 0
            }
          >
            Exportar Excel
          </Button>

          <Button
            className={"margin-r"}
            variant="primary"
            onClick={() =>
              this.downloadFile("suscripciones_reliquidadas_futuro", "pdf")
            }
            disabled={
              !!!this.props.listaOriginal &&
              this.props.listaOriginal.length === 0
            }
          >
            Exportar PDF
          </Button>

          <Button
            variant="primary"
            onClick={() =>
              this.downloadFile("suscripciones_reliquidadas_futuro", "csv")
            }
            disabled={
              !!!this.props.listaOriginal &&
              this.props.listaOriginal.length === 0
            }
          >
            Exportar CSV
          </Button>
        </div>
        <div className="mb-4">
          <Button
            variant="primary"
            onClick={this.confirmarCambios}
            disabled={!!selection && selection.length > 0 ? false : true}
          >
            Confirmar cambios
          </Button>
          <Button
            className="ml-3"
            variant="danger"
            onClick={this.cancelarMarcacion}
          >
            Cancelar
          </Button>
        </div>
        <SelectTable
          SelectInputComponent={(props) => {
            return <CheckBoxTable {...props} paramDisabled="seCruza" />;
          }}
          data={
            !!listaMarcacionTarifaState
              ? listaMarcacionTarifaState
              : !!this.props.listaMarcacionTarifaStateR
                ? this.props.listaMarcacionTarifaStateR.data.data
                : []
          }
          pages={paginas}
          columns={columns}
          filterable={false}
          sortable={false}
          ofText="de"
          nextText="Siguiente"
          pageText="Página"
          previousText="Anterior"
          noDataText="No se encontraron resultados"
          loadingText="Cargando..."
          rowsText="Filas"
          keyField={"idSuscripcion"}
          ref={(r) => (this.checkboxTable = r)}
          toggleSelection={this.toggleSelection}
          selectAll={this.state.selectAll}
          selectType="checkbox"
          toggleAll={this.toggleAll}
          isSelected={this.isSelected}
          getTrProps={this.rowFn}
          defaultPageSize={10}
          showPageJump={false}
          manual // this would indicate that server side pagination has been enabled
          page={this.state.page}
          onPageChange={(page) => this.setState({ page })}
          onFetchData={(state, instance) => {
            this.consultaMarcacionTarifa(state.page, state.pageSize);
          }}
          showPageSizeOptions={true}
        />
        {openModalConfirMarcaFuturo && (
          <ModalConfirmacionGenerico
            tituloModal={tituloModal}
            error={errorMarcacion}
            mensaje={mensaje}
            closeModal={this.closeModal}
          />
        )}
      </Fragment>
    );
  }
}

TablaDetalleFuturo.propTypes = {
  listaMarcacionTarifa: PropTypes.array,
};

const mapStateToProps = (state) => ({
  banderaDeshahTabla: state.Items.banderaDeshahTabla,
  tipoNota: state.Items.tipoNota,
  vigenciaDesde: state.Items.vigenciaDesde,
  vigenciaHasta: state.Items.vigenciaHasta,
  listaOriginal: state.Items.listaOriginal,
  listaMarcacionTarifaR: state.Utils.listaMarcacionTarifa,
  listaMarcacionDeshabitadoR: state.Utils.listaMarcacionDeshabitado,
  pintarTablaMarcacion: state.Items.pintarTablaMarcacion,
  newPage: state.Items.newPage,
  returnPage: state.Items.returnPage,
});

const mapDispatchToProps = {
  saveItem,
  consultaGet,
  saveConsultaGet,
  postServiceR,
  savePostService,
};

const RTablaDetalleFuturo = connect(
  mapStateToProps,
  mapDispatchToProps
)(TablaDetalleFuturo);

export default RTablaDetalleFuturo;
