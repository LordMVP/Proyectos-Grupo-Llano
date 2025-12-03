import React, { Component, Fragment } from "react";
import connect from "react-redux/es/connect/connect";
import "react-table/react-table.css";
import "./TablaDetalleSucripcion.scss";
import { consultaGet } from "../../../../store/actions/Utils";
import Table from "react-table";
import selectTableHOC from "react-table/lib/hoc/selectTable";
import { FormProcesarDetalle } from "../FormProcesarDetalle/FormProcesarDetalle";
import { saveItem } from "../../../../store/actions/Items";
import RUTAS_API from "../../../../global/rutas_api";

import PropTypes from "prop-types";

const SelectTable = selectTableHOC(Table);

export class TablaDetalleSuscripcion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //Variables de manejo de la información de la tabla
      listaDetalleSuscripcionSeleccionada: [],
      keyField: "idSuscripcion",
      selectAll: false,
      selection: [],
      //pages: 0,
      listaDetalleSuscripcionState: this.props.listaDetalleSuscripcion,
      page: 0,
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
        page: 0 /*selection: []*/,
        selection: [],
        selectAll: false,
      });
    }
    if (prevProps.returnPage !== this.props.returnPage) {
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
        //selection: [],
        //selectAll: false, //this.state.pages == 1 ? 1 : this.state.page
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
        //selection.push(`select-${item._original[keyField]}`);
        const keyIndex = selection.indexOf(
          `select-${item._original[keyField]}`
        );
        selection = [
          ...selection.slice(0, keyIndex),
          ...selection.slice(keyIndex + 1),
        ];
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
  consultaDetalleSuscripcion = async (page, pageSize) => {
    const {
      idSuscripcion,
      nombresApellidosTercero,
      documentoTercero,
      ciclo,
      documento,
      tipoDocumento,
      codAntSuscripcion,
      numCatastral,
      fechaDesde,
      fechaHasta,
    } = this.props;
    const params = {
      idSuscripcion: idSuscripcion,
      nombreTercero: nombresApellidosTercero,
      documentoTercero: documentoTercero,
      ciclo: ciclo,
      documento: documento,
      tipoDocumento: tipoDocumento,
      pagina: page,
      tamanoPagina: pageSize,
      numCatastral: numCatastral,
      codAntSuscripcion: codAntSuscripcion,
      fechaDesde: fechaDesde,
      fechaHasta: fechaHasta,
    };
    this.props.saveItem(true, "rrellamarServicio");
    this.props.saveItem(pageSize, "pageSize");
    await this.props.consultaGet(
      RUTAS_API.DETALLE_SUSCRIPCION.CONSULTA_DETALLE_SUSCRIPCION,
      params,
      {},
      "detallesSuscripcion"
    );
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

  /**
   * Método encargado de validar los elementos seleccionados para que no se repitan en la lista una vez se daclic en el de seleccionar todos
   *
   * @param {*} lista lista de objetos actuales consultados según la página
   */
  validateSelectAll = (lista) => {
    const selection = this.state.selection;
    const originalList = [];
    lista.forEach((item) => {
      originalList.push(`select-${item.idSuscripcion}`);
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

  render() {
    const { banderaDeshahTabla } = this.props;
    const { listaDetalleSuscripcionState, selection, pages } = this.state;

    const columns = [
      {
        Header: "ID de suscripción",
        accessor: "idSuscripcion",
        minWidth: 140,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Código",
        accessor: "codigo",
        minWidth: 140,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Estado",
        accessor: "estado",
        minWidth: 65,
        Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Tipo de uso",
        accessor: "tipoUso",
        minWidth: 170,
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
        Header: "Nombres",
        accessor: "nombreCompletoTercero",
        minWidth: 240,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Documento",
        accessor: "documentoTercero",
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Dirección",
        accessor: "direccion",
        minWidth: 160,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Barrio",
        accessor: "barrio",
        minWidth: 190,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Catastral",
        accessor: "catastral",
        minWidth: 170,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Ciclo",
        accessor: "ciclo",
        minWidth: 230,
        headerClassName: "headerTableTextStyle",
      },
    ];

    return (
      <Fragment>
        <div className="pb-4">
          <FormProcesarDetalle
            listaSuscripSeleccionadas={selection}
          />
        </div>
        {!!banderaDeshahTabla && (
          <SelectTable
            data={listaDetalleSuscripcionState}
            pages={pages}
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
            showPageJump={false}
            defaultPageSize={10}
            manual // this would indicate that server side pagination has been enabled
            showPageSizeOptions={true}
            page={this.state.page}
            onPageChange={(page) => this.setState({ page: page })}
            onFetchData={(state, instance) => {
              this.consultaDetalleSuscripcion(state.page, state.pageSize);
            }}
          />
        )}
      </Fragment>
    );
  }
}

TablaDetalleSuscripcion.propTypes = {
  listaDetalleSuscripcion: PropTypes.array,
};

const mapStateToProps = (state) => ({
  banderaDeshahTabla: state.Items.banderaDeshahTabla,
  tipoNota: state.Items.tipoNota,
  rrellamarServicio: state.Items.rrellamarServicio,
  listaDetalleSuscripcionS: state.Utils.listaDetalleSuscripcion,
  detalleData: state.Utils.detallesSuscripcion,
  newPage: state.Items.newPage,
  returnPage: state.Items.returnPage,
});

const mapDispatchToProps = { saveItem, consultaGet };

const RTablaDetalleSuscripcion = connect(
  mapStateToProps,
  mapDispatchToProps
)(TablaDetalleSuscripcion);

export default RTablaDetalleSuscripcion;
