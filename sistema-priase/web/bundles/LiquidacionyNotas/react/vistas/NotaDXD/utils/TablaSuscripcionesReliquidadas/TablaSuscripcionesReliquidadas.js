import React, { Component, Fragment } from "react";
import connect from "react-redux/es/connect/connect";
import "react-table/react-table.css";
import "./TablaSuscripcionesReliquidadas.scss";
import Table from "react-table";
import selectTableHOC from "react-table/lib/hoc/selectTable";
import Button from "react-bootstrap/Button";
import {
  CONCEPTO_NOTA,
  PROGRAMAS,
  ERRORES_PQR,
} from "../../../../global/constantes";
import { ModalDetalleConcepto } from "../FormDetalleSuscripcion/Modales/ModalDetalleConcepto";
import TablaConceptosDeuda from "../FormDetalleSuscripcion/Modales/TablaConceptosDeuda";
import ModalCambioDatos from "../FormDetalleSuscripcion/Modales/ModalCambioDatos";
import { ModalConfirmacionGenerico } from "../FormDetalleSuscripcion/Modales/ModalConfirmacionGenerico";
import ConfirmarAplicacionNota from "../FormDetalleSuscripcion/Modales/ConfirmarAplicacionNota";

//Actions Redux
import { saveItem } from "../../../../store/actions/Items";
import { downloadFiles } from "../../../../store/servicios/DownloadFiles";
import {
  consultaGet,
  saveConsultaGet,
  postServiceR,
  savePostService,
} from "../../../../store/actions/Utils";

import RUTAS_API from "../../../../global/rutas_api";

import PropTypes from "prop-types";

const SelectTable = selectTableHOC(Table);

export class TablaSuscripcionesReliquidadas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //Variables de manejo de la información de la tabla
      listaSuscripcionesReliquidadasSeleccionada: [],
      keyField: "numeroFactura",
      selectAll: false,
      selection: [],
      listaSuscripcionesReliquidadasState: this.props
        .listaSuscripcionesReliquidadas,
      page: 0,
      openModalConceptosSuscripcion: false,
      numeroFactura: "",
      confirmarAplicacion: false,
      modalAviso: false,
      modalError: false,
      mensaje: "",
    };
  }

  /**
   * Método encargado de limpiar las lista de suscripciones seleccionadas y el check de select all
   * cada vez que se monte el componente
   */
  componentDidMount() {
    this.setState({ selectAll: false, selection: [] });
  }

  /**
   * Método encargado de conseguir el id de suscripción con base en los números de facturas seleccionados
   */
  abstraerId = () => {
    let resultadoDetallesSuscripcion =
      !!this.props.detallesSuscripcion.data &&
      this.props.detallesSuscripcion.data.data;
    let listaIdSuscip = [];
    for (let i = 0; i < this.props.listaOriginal.length; i++) {
      const idSuscripcion = resultadoDetallesSuscripcion.filter(
        (item) => item.facNumero == this.props.listaOriginal[i]
      );
      listaIdSuscip = [...listaIdSuscip, ...idSuscripcion];
    }
    let listaServicioSuscripcion = listaIdSuscip.map((item) => {
      return item.idSuscripcion;
    });
    return listaServicioSuscripcion;
    /*
    this.props.listaOriginal.forEach(original => {
      const idSuscripcion = resultadoDetallesSuscripcion.filter(
        (item) => item.facNumero == original
      );
      listaIdSuscip = [...listaIdSuscip, ...idSuscripcion];
    });

    let listaServicioSuscripcion = listaIdSuscip.map((item) => {
      return item.idSuscripcion;
    });
    return listaServicioSuscripcion;*/
  };

  /**
   * Método encargado de actualizar el componente cada vez que se realice una consulta diferente o una consulta con otros
   * datos en el formulario de búsqueda de detalles de suscripción
   *
   * @param {*} prevProps props previas
   */
  componentDidUpdate(prevProps) {
    if (
      prevProps.listaSuscripcionesReliquidadas !==
      this.props.listaSuscripcionesReliquidadas
    ) {
      this.setState({
        listaSuscripcionesReliquidadasState: this.props
          .listaSuscripcionesReliquidadas.data.data,
        pages: this.props.listaSuscripcionesReliquidadas.data.paginas,
        //selection: [],
        selectAll: false, //this.state.pages == 1 ? 1 : this.state.page
      });
    }
  }

  downloadFile(nameFile, formatFile) {
    const { tipoNota, listaOriginal, accionARealizar } = this.props;
    const lista = (tipoNota === PROGRAMAS.CAMBIO_ESTRATO || tipoNota === PROGRAMAS.CAMBIO_TIPOUSO || tipoNota === PROGRAMAS.AFORO_EXTRAORDINARIO || tipoNota === PROGRAMAS.ADICION_ELIMINACION_DEUDA) && this.abstraerId();
    const params = {
      listaSuscripciones:
        tipoNota === PROGRAMAS.CAMBIO_ESTRATO || tipoNota === PROGRAMAS.CAMBIO_TIPOUSO || tipoNota === PROGRAMAS.AFORO_EXTRAORDINARIO || tipoNota === PROGRAMAS.ADICION_ELIMINACION_DEUDA
          ? lista.toString()
          : listaOriginal.toString(),
      typeFile: formatFile,
    };
    const paramsDYP = {
      ...params,
      tipoNota:
        tipoNota == PROGRAMAS.DESCUENTO_DESHABITADO
          ? "deshabitados"
          : "puerta a puerta",
    };
    const paramsConTipoNota = {
      ...params,
      tipoNota: tipoNota
    };
    const paramsDeuda = {
      ...paramsConTipoNota,
      accionRealizar: accionARealizar,
      eliminarSuscripcion: !!this.props.eliminarSuscripcion ? this.props.eliminarSuscripcion : false,
    };

    let ruta;
    let parametrosSolicitud;

    switch (tipoNota) {
      case PROGRAMAS.CAMBIO_ESTRATO:
        ruta = RUTAS_API.DOWNLOADFILES.LIQUIDACIONESTRATOS;
        parametrosSolicitud = params;
        break;
      case PROGRAMAS.CAMBIO_TIPOUSO:
        ruta = RUTAS_API.DOWNLOADFILES.LIQUIDACIONESTIPOUSO;
        parametrosSolicitud = paramsConTipoNota;
        break;
      case PROGRAMAS.AFORO_EXTRAORDINARIO:
        ruta = RUTAS_API.DOWNLOADFILES.LIQUIDACIONESAFORO;
        parametrosSolicitud = paramsConTipoNota;
        break;
      case PROGRAMAS.ADICION_ELIMINACION_DEUDA:
        ruta = RUTAS_API.DOWNLOADFILES.LIQUIDACIONESDEUDA;
        parametrosSolicitud = paramsDeuda;
        break;
      default:
        ruta = RUTAS_API.DOWNLOADFILES.LIQUIDACIONESSIMULACION;
        parametrosSolicitud = paramsDYP;
        break;
    }
    downloadFiles(
      ruta,
      nameFile,
      parametrosSolicitud,
      formatFile
    );
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
      this.validateSelectAll(this.state.listaSuscripcionesReliquidadasState)
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
      // the 'sortedData' property contains the currently accessible records based on the filter and sort
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      // we just push all the IDs onto the selection array
      currentRecords.forEach((item) => {
        if (!selection.includes(`select-${item._original[keyField]}`)) {
          selection.push(`select-${item._original[keyField]}`);
        }
      });
    } else if (!selectAll) {
      // we need to get at the internals of ReactTable
      const wrappedInstance = this.checkboxTable.getWrappedInstance();
      // the 'sortedData' property contains the currently accessible records based on the filter and sort
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      // we just push all the IDs onto the selection array
      currentRecords.forEach((item) => {
        const keyIndex = selection.indexOf(
          `select-${item._original[keyField]}`
        );
        selection = [
          ...selection.slice(0, keyIndex),
          ...selection.slice(keyIndex + 1),
        ];
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
          selection.includes(`select-${rowInfo.original.numeroFactura}`) &&
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
  consultaSuscripcionesReliquidadas = async (page, pageSize) => {
    const { tipoNota, listaOriginal } = this.props;

    const lista = (tipoNota === PROGRAMAS.CAMBIO_ESTRATO || tipoNota === PROGRAMAS.CAMBIO_TIPOUSO || tipoNota === PROGRAMAS.AFORO_EXTRAORDINARIO || tipoNota === PROGRAMAS.ADICION_ELIMINACION_DEUDA) && this.abstraerId();
    const params = {
      listaSuscripciones:
        tipoNota === PROGRAMAS.CAMBIO_ESTRATO || tipoNota === PROGRAMAS.CAMBIO_TIPOUSO || tipoNota === PROGRAMAS.AFORO_EXTRAORDINARIO || tipoNota === PROGRAMAS.ADICION_ELIMINACION_DEUDA ? lista : listaOriginal,
      pagina: page,
      tamanoPagina: pageSize,
      tipoNota: tipoNota,
    };

    this.props.savePostService(undefined, "listaSuscripcionesReliquidadas");
    await this.props.postServiceR(
      RUTAS_API.DETALLE_SUSCRIPCION.CONSULTA_SUSCRIPCIONES_RELIQUIDADAS,
      params,
      {},
      "listaSuscripcionesReliquidadas"
    );
    if (
      !!this.props.listaSuscripcionesReliquidadas ||
      !!this.props.listaSuscripcionesReliquidadasR.data
    ) {
      if (!!this.props.listaSuscripcionesReliquidadasR.data) {
        this.setState(
          {
            listaSuscripcionesReliquidadasState: this.props
              .listaSuscripcionesReliquidadasR.data.data,
            paginas: this.props.listaSuscripcionesReliquidadasR.data.paginas,
          },
          () =>
            this.validateSelectAll(
              this.state.listaSuscripcionesReliquidadasState
            )
        );
      }
    }
  };

  /**
   * Método encargado de hacer el llamado al popUp de creación de nota, cuando están seleccionadas
   * las suscripciones a confirmar
   */
  confirmarCambios = () => {
    this.setState({ confirmarAplicacion: true });
  };

  /**
   * Método encargado de validar el tipo de nota que se quiere generar
   * Ej: Descuento por deshabitado, descuento puerta a puerta, etc.
   *
   * @param {*} tipoNota
   */
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
      originalList.push(`select-${item.numeroFactura}`);
    });
    var result = originalList.every(function (val) {
      return selection.indexOf(val) >= 0;
    });
    this.setState({ selectAll: result });
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

  /**
   * Método encargado de actualizar el número de factura seleccionado, para abrir el modal
   * de detalle de conceptos y que se carguen los detalles
   *
   * @param {*} numeroFactura
   */
  cargarConceptosSuscripcion = (numeroFactura, suscripcion) => {
    const { tipoNota } = this.props;
    this.setState({ numeroFactura: numeroFactura, suscripcion: suscripcion });

    if (tipoNota == PROGRAMAS.ADICION_ELIMINACION_DEUDA) {
      this.setState({ openModalConceptosDeuda: true });
    } else {
      this.setState({ openModalConceptosSuscripcion: true });
    }

  };

  /**
   * Método encargado de cerrar el modal de consulta del detalle de conceptos por suscripción
   */
  closeModal = () => {
    this.setState({ openModalConceptosSuscripcion: false, openModalConceptosDeuda: false });
  };

  /**
   * Método encargado de cerrar el modal de confirmar aplicación nota
   */
  cerrarModal = () => {
    this.setState({ confirmarAplicacion: false });
    if (!!this.props.pqr && this.state.PQRSaveSi) {
      if (
        this.props.responeLiquidarNota.status == 200 &&
        this.props.responseNewNotNota.status == 200 &&
        this.props.newVisitasSol.status == 200
      ) {
        if (!!this.props.responeLiquidarNota.data.codResp) {
          const mensaje = this.props.responeLiquidarNota.data.error.split("|");
          let mensajeError;
          for (let i = 0; i < mensaje.length; i++) {
            mensajeError = mensaje[i] + "\n";
          }
          this.setState({
            modalError: true,
            mensaje: mensajeError,
          });
        } else {
          this.setState({ modalAviso: true });
        }
      } else {
        this.setState({
          modalError: true,
          mensaje: "Error al confirmar la nota, intente mas tarde",
        });
      }
    } else {
      if (
        this.props.responeLiquidarNota.status == 200 &&
        this.props.responseNewNotNota.status == 200
      ) {
        if (!!this.props.responeLiquidarNota.data.codResp) {
          const mensaje = this.props.responeLiquidarNota.data.error.split("|");

          let mensajeError = "";
          for (let i = 0; i < mensaje.length; i++) {
            mensajeError = mensajeError + mensaje[i] + "\n";
          }
          this.setState({
            modalError: true,
            mensaje: mensajeError,
          });
        } else {
          this.setState({ modalAviso: true });
        }
      } else {
        this.setState({
          modalError: true,
          mensaje: "Error al confirmar la nota, intente mas tarde",
        });
      }
    }
  };

  cerrarModalAviso = () => {
    this.setState({ modalAviso: false });
  };

  cerrarModalError = () => {
    this.setState({ modalError: false });
  };

  cancelarReliquidacion = async () => {
    const { tipoNota } = this.props;

    const params = {
      tipoNota: tipoNota,
    };

    await this.props.consultaGet(
      RUTAS_API.LIQUIDACION.CANCELAR_RELIQUIDACION,
      params,
      {},
      "respuestaCancelar"
    );

    if (
      !!this.props.respuestaCancelar &&
      this.props.respuestaCancelar.data.codResp ==
      ERRORES_PQR.CODIGO_RESPUESTA_EXITOSA
    ) {
      let returnPage = this.props.returnPage;
      this.props.saveItem(returnPage + 1, "returnPage");
      this.props.saveItem(false, "pintarTablaReliquidadas");
      this.props.saveItem(true, "banderaDeshahTabla");
    } else {
      this.setState({
        modalError: true,
        mensaje:
          "Ocurrió un error en el servicio, por favor intente de nuevo más tarde",
      });
    }
  };

  reloadWindows = () => {
    location.reload();
  };

  render() {
    const { columns } = this.props;

    const {
      listaSuscripcionesReliquidadasState,
      selection,
      openModalConceptosSuscripcion,
      numeroFactura,
      confirmarAplicacion,
      modalAviso,
      modalError,
      mensaje,
      paginas,
      openModalConceptosDeuda,
      suscripcion
    } = this.state;

    const columnsWithBtn = [
      ...columns,
      {
        Header: "Ver detalle",
        Cell: (row) => {
          return (
            <div style={{ textAlign: "center" }}>
              <Button
                variant="primary"
                onClick={() =>
                  this.cargarConceptosSuscripcion(row.original.numeroFactura, row.original.idSuscripcion)
                }
              >
                Detalle
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
        <h2>Tabla de suscripciones reliquidadas</h2>
        <div className="mb-4">
          <Button
            className={"margin-r"}
            variant="primary"
            onClick={() =>
              this.downloadFile("suscripciones_reliquidadas", "xls")
            }
            disabled={
              !!this.props.listaSuscripcionesReliquidadasR &&
              !!this.props.listaSuscripcionesReliquidadasR.data.data &&
              this.props.listaSuscripcionesReliquidadasR.data.data.length === 0
            }
          >
            Exportar Excel
          </Button>
          <Button
            className={"margin-r"}
            variant="primary"
            onClick={() =>
              this.downloadFile("suscripciones_reliquidadas", "pdf")
            }
            disabled={
              !!this.props.listaSuscripcionesReliquidadasR &&
              !!this.props.listaSuscripcionesReliquidadasR.data.data &&
              this.props.listaSuscripcionesReliquidadasR.data.data.length === 0
            }
          >
            Exportar PDF
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              this.downloadFile("suscripciones_reliquidadas", "csv")
            }
            disabled={
              !!this.props.listaSuscripcionesReliquidadasR &&
              !!this.props.listaSuscripcionesReliquidadasR.data.data &&
              this.props.listaSuscripcionesReliquidadasR.data.data.length === 0
            }
          >
            Exportar CSV
          </Button>
        </div>
        <div className="mb-4">
          <Button
            className={"margin-r"}
            variant="primary"
            onClick={this.confirmarCambios}
            disabled={!!selection && selection.length > 0 ? false : true}
          >
            Confirmar cambios
          </Button>
          <Button variant="danger" onClick={this.cancelarReliquidacion}>
            Cancelar
          </Button>
        </div>
        <SelectTable
          data={
            !!listaSuscripcionesReliquidadasState
              ? listaSuscripcionesReliquidadasState
              : !!this.props.listaSuscripcionesReliquidadasR
                ? this.props.listaSuscripcionesReliquidadasR.data.data
                : []
          }
          pages={paginas}
          columns={columnsWithBtn}
          filterable={false}
          sortable={false}
          ofText="de"
          nextText="Siguiente"
          pageText="Página"
          previousText="Anterior"
          noDataText="No se encontraron resultados"
          loadingText="Cargando..."
          rowsText="Filas"
          keyField={"numeroFactura"}
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
            this.consultaSuscripcionesReliquidadas(state.page, state.pageSize);
          }}
          showPageSizeOptions={true}
        />
        {openModalConceptosSuscripcion && (
          <ModalDetalleConcepto
            numeroFactura={numeroFactura}
            closeModal={this.closeModal}
          />
        )}
        {openModalConceptosDeuda && (
          <TablaConceptosDeuda
            numeroFactura={numeroFactura}
            suscripcion={suscripcion}
            closeModal={this.closeModal}
          />
        )}
        {confirmarAplicacion && (
          <ConfirmarAplicacionNota
            closeModal={this.cerrarModal}
            selection={selection}
            listaSuscripcion={listaSuscripcionesReliquidadasState}
          />
        )}
        {!!modalAviso && (
          <ModalCambioDatos
            cerrarModal={this.cerrarModalAviso}
            aceptarModal={this.reloadWindows}
            mensaje={"Nota confirmada exitosamente"}
            titulo={"Aviso"}
            aceptarOption={true}
            closeOption={false}
          />
        )}
        {!!modalError && (
          <ModalConfirmacionGenerico
            closeModal={this.cerrarModalError}
            tituloModal={"Aviso"}
            mensaje={mensaje}
            error={true}
          />
        )}
      </Fragment>
    );
  }
}

TablaSuscripcionesReliquidadas.propTypes = {
  listaSuscripcionesReliquidadas: PropTypes.array,
};

const mapStateToProps = (state) => ({
  banderaDeshahTabla: state.Items.banderaDeshahTabla,
  tipoNota: state.Items.tipoNota,
  fechaDesde: state.Items.desde,
  fechaHasta: state.Items.hasta,
  listaOriginal: state.Items.listaOriginal,
  listaSuscripcionesReliquidadasR: state.Utils.listaSuscripcionesReliquidadas,
  responeLiquidarNota: state.Utils.liquidarNota,
  responseNewNotNota: state.Utils.newNotNota,
  newVisitasSol: state.Utils.newVisitasSol,
  pqr: state.Utils.listaPqr,
  PQRNumber: state.Items.PQRNumber,
  pintarTablaReliquidadas: state.Items.pintarTablaReliquidadas,
  respuestaCancelar: state.Utils.respuestaCancelar,
  detallesSuscripcion: state.Utils.detallesSuscripcion,
  returnPage: state.Items.returnPage,
  accionARealizar: state.Items.AccionARealizar,
  eliminarSuscripcion: state.Items.eliminarSuscripcion,
});

const mapDispatchToProps = {
  saveItem,
  consultaGet,
  saveConsultaGet,
  postServiceR,
  savePostService,
};

const RTablaSuscripcionesReliquidadas = connect(
  mapStateToProps,
  mapDispatchToProps
)(TablaSuscripcionesReliquidadas);

export default RTablaSuscripcionesReliquidadas;
