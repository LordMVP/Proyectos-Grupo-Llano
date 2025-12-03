const ColsTablaSuscripsRTipoUso = [
    {
        Header: "ID de suscripción",
        accessor: "idSuscripcion",
        minWidth: 150,
        headerClassName: "headerTableTextStyle",
    },
    {
        Header: "Número de factura",
        accessor: "numeroFactura",
        minWidth: 160,
        headerClassName: "headerTableTextStyle",
    },
    {
        Header: "Tipo de uso anterior",
        accessor: "tipoUsoAnterior",
        minWidth: 200,
        headerClassName: "headerTableTextStyle",
    },
    {
        Header: "Tipo de uso",
        accessor: "tipoUso",
        minWidth: 200,
        headerClassName: "headerTableTextStyle",
    },
    {
        Header: "Código anterior",
        accessor: "codigoAnterior",
        minWidth: 140,
        headerClassName: "headerTableTextStyle",
    },
    {
        Header: "Periodo",
        accessor: "periodo",
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
        //Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
        headerClassName: "headerTableTextStyle",
    },
    {
        Header: "Tarifa final facturada",
        accessor: "tarifaFinalFacturada",
        minWidth: 180,
        headerClassName: "headerTableTextStyle",
    },
    {
        Header: "Tarifa final tipo uso",
        accessor: "tarifaFinalDescuento",
        minWidth: 180,
        headerClassName: "headerTableTextStyle",
    },
    {
        Header: "Total descuento tipo uso",
        accessor: "totalDescuento",
        minWidth: 180,
        headerClassName: "headerTableTextStyle",
    },
];

export default ColsTablaSuscripsRTipoUso;