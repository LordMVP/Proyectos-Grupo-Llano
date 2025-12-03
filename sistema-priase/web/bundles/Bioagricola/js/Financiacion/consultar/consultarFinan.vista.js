/**
 * @fileOverview Archivo de vista y control para importar pagos a las financiaciones
 * @author rsagudelo
 * @requires importar.control.js
 * @requires importar.modelo.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace consultarVista
 * @type {Object}
 */
var that = null;
/** @namespace */
var consultarVista = {

    data: null,
    /** Inicializa el programa para importar pagos a las financiaciones especiales, y asigna listeners a controles
     * @returns {void}
     **/
    init: function () {
        that = consultarVista;
        $('#btnConsultar').on('click', that.consultarDatos);
    },
 
    /**
     * Consulta el progreso del proceso de cargar pagos a las financiaciones
     * @returns {void}
     */
    consultarDatos: function () 
    {
        var data = {
            CodUsuario: $('#txtCodUsuario').val(),
            IdFinanciacion: $('#txtIdFinanciacion').val()
        };
        $('#divResultados').hide();
        $('#divPagos').hide();
        $('#divAmortizaciones').hide();
        $('#divTerceros').hide();
        $('#divComandos, #divPanelContenedor').show();
        consultarControl.consultarDatos(that.onConsultarCompleto, data); 
    },
    /**
     * Consulta el resultado de la importanción de pagos a las financiaciones realizada
     * @param {Object} data - Información enviada por el servidor con los pagos subidos correctamente y las que no se pudieron cargarse
     */
    onConsultarCompleto: function (data) {
         switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(data.mensaje , __app.mensajes.atencion);
                break;
            case 1: 
                $('#divResultados').show();
                fillTable('tblFinanciaciones', 'formatoFinanciaciones', data.financiaciones, ' Financiaciones del Usuario ' + data.CodUsuario );
                if(data.pagos.length > 0)
                {
                    $('#divPagos').show();
                    fillTable('tblPagos', 'formatoPagos', data.pagos, 'Pagos Financiacion ' );
                }
                if(data.amortizaciones.length > 0)
                {
                    $('#divAmortizaciones').show();
                    fillTable('tblAmortizaciones', 'formatoAmortizaciones', data.amortizaciones, 'Amortizaciones' );
                }
                if(data.terceros.length > 0)
                {
                    $('#divTerceros').show();
                    fillTable('tblTerceros', 'formatoTerceros', data.terceros, 'Distribucion de Terceros' );
                }
            break;
            case 2: 
                $('#divResultados').show();
                fillTable('tblFinanciaciones', 'resumenFinanciaciones', data.financiaciones, ' Resumen Financiaciones ' + data.CodUsuario );

                $('#divPagos').show();
                fillTable('tblPagos', 'resumenPagos', data.pagos, 'Resumen Pagos' );

                $('#divAmortizaciones').show();
                fillTable('tblAmortizaciones', 'resumenAmortizaciones', data.amortizaciones, 'Resumen Amortizaciones' );

                $('#divTerceros').show();
                fillTable('tblTerceros', 'resumenTerceros', data.terceros, 'Resumen Distribucion de Terceros' );
                
            break;
        }          
        return;
   
    },
    /**
     * Limpia el formulario y elimina la información de la importación.
     * @returns {void}
     */
    limpiarFormulario: function () {
        $('#select').val('-1');
        $('#txtArchivo').fileinput('clear');
    },

};
consultarVista.init();
