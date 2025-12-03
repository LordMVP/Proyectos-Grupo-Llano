import React from "react";

const ColsTablaDetalleSusTipoUso = [
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
    Header: "Factura",
    accessor: "facNumero",
    minWidth: 140,
    headerClassName: "headerTableTextStyle",
  },
  {
    Header: "Periodo",
    accessor: "perNombre",
    minWidth: 140,
    headerClassName: "headerTableTextStyle",
  },
  {
    Header: "Tipo Uso Anterior",
    accessor: "tipoUsoAnterior",
    minWidth: 140,
    Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
    headerClassName: "headerTableTextStyle",
  },
  {
    Header: "Tipo Uso Actual",
    accessor: "tipoUso",
    minWidth: 140,
    Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
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
    Header: "Estrato",
    accessor: "estrato",
    minWidth: 70,
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

export default ColsTablaDetalleSusTipoUso;
