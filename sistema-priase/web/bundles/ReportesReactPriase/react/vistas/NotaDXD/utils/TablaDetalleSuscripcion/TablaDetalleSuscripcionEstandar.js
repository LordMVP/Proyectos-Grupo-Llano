import React, { Component, Fragment } from "react";
import connect from "react-redux/es/connect/connect";
import "react-table/react-table.css";
import "./TablaDetalleSucripcion.scss";
import Table from "react-table";
import selectTableHOC from "react-table/lib/hoc/selectTable";
import { FormProcesarDetalle } from "../FormProcesarDetalle/FormProcesarDetalle";
import { consultaGet, saveConsultaGet } from "../../../../store/actions/Utils";
import CheckBoxTable from "../../../Utils/components/CheckBoxTable";
import RUTAS_API from "../../../../global/rutas_api";
import { PROGRAMAS } from "../../../../global/constantes";
import PropTypes from "prop-types";
import { saveItem } from "../../../../store/actions/Items";
import { ModalConfirmacionGenerico } from "../FormDetalleSuscripcion/Modales/ModalConfirmacionGenerico";
import Button from "react-bootstrap/Button";
import { PlusCircle } from 'react-bootstrap-icons';
import EditTable from "../../../Utils/components/EditTable";

const SelectTable = selectTableHOC(Table);

export class TablaDetalleSuscripcionEstandarR extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      listaDetalleSuscripcionSeleccionada: [],
      keyField: "facNumero",
      selectAll: false,
      selection: [],
      //pages: 0,
      listaDetalleSuscripcionState: this.props.listaDetalleSuscripcion,
      page: 0,
      modalTablaDeuda: false,
      numeroFactura: "",
    };
  }

  componentDidMount() {
    this.setState({ selection: [], selectAll: false });
  }

  /**
   * Método encargado de actualizar el componente cada vez que se realice una consulta diferente o una consulta con otros
   * datos en el formulario de búsqueda de detalles de suscripción
   *
   * @param {*} prevProps props previas
   */
  componentDidUpdate(prevProps) {
    if (prevProps.newPage !== this.props.newPage) {
      this.setState({
        page: 0,
        selection: [],
        selectAll: false,
      });
    }
    if (!!this.props.returnPage && prevProps.returnPage !== this.props.returnPage) {
      this.setState({
        page: 0,
      });
    }
    if (prevProps.detalleData !== this.props.detalleData) {
      this.setState({
        listaDetalleSuscripcionState: !!this.props.detalleData.data
          ? this.props.detalleData.data.data
          : [],
        pages: !!this.props.detalleData.data
          ? this.props.detalleData.data.pages
          : 1,
      });
    }
  }

  /**
   * Método encargado de almacenar en una lista los objetos seleccionados individualmente
   */
  toggleSelection = (key, shift, row) => {
    // start off with the existing state
    let selection = [...this.state.selection];
    const keyIndex = selection.indexOf(key);

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
      this.validateSelectAll(this.state.listaDetalleSuscripcionState)
    );
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
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      currentRecords.forEach((item) => {
        if (!item._original["disabled"]) {
          if (!selection.includes(`select-${item._original[keyField]}`)) {
            selection.push(`select-${item._original[keyField]}`);
          }
        }
      });
    } else if (!selectAll) {
      const wrappedInstance = this.checkboxTable.getWrappedInstance();
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      currentRecords.forEach((item) => {
        if (!item._original["disabled"]) {
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
    this.setState({ selectAll, selection });
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
        if (handleOriginal) {
          handleOriginal();
        }
      },
      style: {
        background:
          rowInfo &&
          selection.includes(`select-${rowInfo.original.facNumero}`) &&
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
  consultaDetalleSuscripcion = async (page, pageSize) => {
    const {
      idSuscripcion,
      nombreTercero,
      documentoTercero,
      ciclo,
      documento,
      tipoDocumento,
      codAntSuscripcion,
      numCatastral,
      fechaDesde,
      fechaHasta,
      tipoNota,
      fechaPqr,
      numeroPqr,
      primerLlamado,
      accionARealizar,
    } = this.props;
    const params = {
      idSuscripcion: idSuscripcion,
      nombreTercero: nombreTercero,
      documentoTercero: documentoTercero,
      ciclo: ciclo,
      documento: documento,
      tipoDocumento: tipoDocumento,
      numCatastral: numCatastral,
      codAntSuscripcion: codAntSuscripcion,
      pagina: page,
      tamanoPagina: pageSize,
      fechaDesde: fechaDesde,
      fechaHasta: fechaHasta,
    };

    const paramsAforo = {
      ...params,
      fechaPqr: fechaPqr,
      tipoNota: tipoNota,
      numeroPqr: numeroPqr,
    }

    const paramsDeuda = {
      ...params,
      tipoNota: tipoNota,
      paginador: primerLlamado,
      accionARealizar: accionARealizar,
    }

    this.props.saveItem(true, "rrellamarServicio");
    this.props.saveItem(pageSize, "pageSize");

    if (this.props.tipoNota == PROGRAMAS.CAMBIO_ESTRATO) {
      await this.props.consultaGet(
        RUTAS_API.DETALLE_SUSCRIPCION.CONSULTA_DETALLE_SUSCRIPCION_ESTRATO,
        params,
        {},
        "detallesSuscripcion"
      );
    } else if (this.props.tipoNota == PROGRAMAS.CAMBIO_TIPOUSO) {
      await this.props.consultaGet(
        RUTAS_API.DETALLE_SUSCRIPCION.CONSULTA_DETALLT_SUSCIPCION_TIPO_USO,
        params,
        {},
        "detallesSuscripcion"
      );
    } else if (this.props.tipoNota == PROGRAMAS.AFORO_EXTRAORDINARIO) {
      this.props.saveConsultaGet(undefined, "detallesSuscripcion");
      await this.props.consultaGet(
        RUTAS_API.DETALLE_SUSCRIPCION.CONSULTA_DETALLE_SUSCIPCION_AFORO,
        paramsAforo,
        {},
        "detallesSuscripcion"
      );
      if (!!this.props.detalleData && this.props.detalleData.data.data.length <= 0 && !this.props.popUpActivo) {
        this.props.saveItem(true, "popUpActivo");
        this.setState({ modalError: true, mensajeError: "No existen Aforos de referencia para poder proceder con la reliquidación", tituloModalError: "No existen aforos de referencia" });
      }
    } else if (this.props.tipoNota == PROGRAMAS.ADICION_ELIMINACION_DEUDA) {
      await this.props.consultaGet(
        RUTAS_API.DETALLE_SUSCRIPCION.CONSULTA_DETALLE_DEUDA,
        paramsDeuda,
        {},
        "detallesSuscripcion"
      );
      this.props.saveItem(true, "primerLlamado");
    }
    this.chargeDataState(page);
  };

  chargeDataState = (page) => {
    if (!!this.props.detalleData) {
      this.setState(
        {
          listaDetalleSuscripcionState: this.props.detalleData.data.data,
          pages: this.props.detalleData.data
            .pages /*, selectAll: false, pages: respuesta.data.pages*/,
          page: page
        },
        () => {
          this.validateSelectAll(this.state.listaDetalleSuscripcionState);
        }
      );
    }
  };

  cerrarModalError = () => {
    this.setState({ modalError: false, modalTablaDeuda: false });
    this.props.saveItem(false, "mostrarModalConceptoEditable");
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
      if (!item.repiteEstrato) {
        originalList.push(`select-${item.facNumero}`);
      }
    });
    var result = originalList.every(function (val) {
      return selection.indexOf(val) >= 0;
    });
    this.setState({ selectAll: result });
  };

  cargarConceptosPorFacturaDeuda = (numeroFactura, rowInfo) => {
    this.setState({ rowInfo: rowInfo, numeroFactura: numeroFactura })
    this.props.saveItem(true, "mostrarModalConceptoEditable");
  }

  render() {
    const { banderaDeshahTabla, tipoNota, columnsTable, accionARealizar, mostrarModalConceptoEditable } = this.props;
    const {
      pages,
      listaDetalleSuscripcionState,
      selection,
      modalError,
      mensajeError,
      tituloModalError,
      numeroFactura,
      rowInfo,
    } = this.state;

    const columnsWithBtn = [
      ...columnsTable,
      {
        Header: "Adicionar",
        Cell: (row) => {
          return (
            <div style={{ textAlign: "center" }}>
              <Button
                variant="primary"
                onClick={() => {
                  this.cargarConceptosPorFacturaDeuda(row.original.facNumero, row)
                }
                }
              >
                <PlusCircle />
              </Button>
            </div>
          );
        },
        minWidth: 170,
        headerClassName: "headerTableTextStyle",
      },
    ];

    return (
      <Fragment>
        <div className="pb-4">
          <FormProcesarDetalle
            listaSuscripSeleccionadas={selection} suscripcion={this.props.idSuscripcion}
          />
        </div>
        {!!banderaDeshahTabla && (
          <SelectTable
            SelectInputComponent={(props) => {
              return <CheckBoxTable {...props} paramDisabled="disabled" />;
            }}
            data={listaDetalleSuscripcionState}
            pages={pages}
            columns={(accionARealizar == 1 && tipoNota == PROGRAMAS.ADICION_ELIMINACION_DEUDA) ? columnsWithBtn : columnsTable}
            filterable={false}
            sortable={false}
            ofText="de"
            nextText="Siguiente"
            pageText="Página"
            previousText="Anterior"
            noDataText="No se encontraron resultados"
            loadingText="Cargando..."
            rowsText="Filas"
            keyField={"facNumero"}
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
            showPageSizeOptions={true}
            page={this.state.page}
            onPageChange={(page) => this.setState({ page: page })}
            onFetchData={(state, instance) => {
              this.consultaDetalleSuscripcion(state.page, state.pageSize);
            }}
          />
        )}
        {!!modalError && (
          <ModalConfirmacionGenerico
            closeModal={this.cerrarModalError}
            tituloModal={tituloModalError}
            mensaje={mensajeError}
            error={true}
          />
        )}
        {!!mostrarModalConceptoEditable && (
          <EditTable numeroFactura={numeroFactura}
            rowInfo={rowInfo}
            closeModal={this.cerrarModalError} />
        )}
      </Fragment>
    );
  }
}

TablaDetalleSuscripcionEstandarR.propTypes = {
  listaDetalleSuscripcion: PropTypes.array,
};

const mapStateToProps = (state) => ({
  banderaDeshahTabla: state.Items.banderaDeshahTabla,
  tipoNota: state.Items.tipoNota,
  detalleData: state.Utils.detallesSuscripcion,
  rrellamarServicio: state.Items.rrellamarServicio,
  newPage: state.Items.newPage,
  returnPage: state.Items.returnPage,
  popUpActivo: state.Items.popUpActivo,
  accionARealizar: state.Items.AccionARealizar,
  mostrarModalConceptoEditable: state.Items.mostrarModalConceptoEditable,
  primerLlamado: state.Items.primerLlamado,
});

const mapDispatchToProps = {
  consultaGet,
  saveItem,
  saveConsultaGet,
};

const TablaDetalleSuscripcionEstandar = connect(
  mapStateToProps,
  mapDispatchToProps
)(TablaDetalleSuscripcionEstandarR);

export default TablaDetalleSuscripcionEstandar;
