var that = null;
var reporteTarifasVista = {
    dialogoActual: null,
    init: function () {

        that = this;
        $('a').click(function (e) {
            console.log("Ingresando a clic para generar nueva ventana");
            $('a#lngeneraexcel').attr('href', '../reporte_tarifas/consultar_xls/?mercado=' + $('#mercado').val() + '&periodo=' + $('#periodo').val());
            console.log($('a#lngeneraexcel').attr('href'));
        });

        $('#btnBuscar').on('click', that.buscar);

    },
    buscar: function () {
        console.log(" Ingreso Buscar");
        Parametros = {};
        Parametros.mercado = $('#mercado').val();
        Parametros.periodo = $('#periodo').val();
        reporteTarifasControl.consultar(Parametros, that.mostrarResultados);
        $('div#divresultados').hide();
    },

    mostrarResultados: function (Data)
    {
        console.log(" Respuesta " + Data.codigoRespuesta);
        if (Data.codigoRespuesta == 1)
        {
            $('div#divResultados').show();
            var Tbl = $("table#tablaTarifas");
            Tbl.dataTable({
                data: Data.tarifas,
                columns: [
                    {'title': 'Mercado', data: 'mercado'},
                    {'title': 'Codigo Concepto', data: 'idconcepto'},
                    {'title': 'Concepto', data: 'concepto'},
                    {'title': 'Rango Inicial', data: 'rangoinicial'},
                    {'title': 'Rango FInal', data: 'rangofinal'},
                    {'title': 'Reingeniería', data: 'valorreingenieria'},
                    {'title': 'Codigo Variable', data: 'codvariable'},
                    {'title': 'Alias Variable', data: 'aliasvariable'},
                    {'title': 'Valor Sistema Tarifas', data: 'valortarifas'}
                ],
                fnRowCallback: function (fila, item, idx) {
                    fila = $(fila);
//                    var link = $('<a>').text(item.nombre).attr({href: item.url});
                },
                language: {
                    url: '/achagua/js/Spanish.json'
                },
                bSort: false,
                destroy: true
            });
        }
        /** Captura la respuesta del servidor cuando se consulta el proceso en ejecución
         * @param {object} data - Respuesta del servidor con información del progreso del proceso en ejecución
         * @returns {void}
         **/
    }
};
reporteTarifasVista.init();
