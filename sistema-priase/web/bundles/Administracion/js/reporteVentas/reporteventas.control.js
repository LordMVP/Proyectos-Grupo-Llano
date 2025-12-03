var reporteVentasControl = {
    consultarFinanciaciones: function (data, completado) {
        __cnn.ajax({
            'url': '../../../venta/financiacion/contrato/consultarEmpresas',
            'data': data,
            'completado': completado
        });
    },
    generarReporte: function (data, completado) {
        __cnn.ajax({
            'url': '../../../venta/financiacion/reporteventasexterno/procesar',
            'data': data,
            'completado': completado
        });
    }
}