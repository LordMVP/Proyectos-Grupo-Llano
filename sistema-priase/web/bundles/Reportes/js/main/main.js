/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    $('#module').css('display', 'block');
   
    ajustarDatepicker();
    $(".dataTable").each(function(i,item){
        $(item).DataTable();
    });
});
var http = angular.module("httpModule", []);

http.factory('ajaxInterceptor', function () {
    var responseInterceptor = {
        response: function (response) {
            __dom.ocultarCargador();
            return response;
        },
        responseError: function (response) {
            __dom.ocultarCargador();
            response.statusText = "Error en la ejecucion del reporte";
            __app.controlarError(response);
            return response;
        },
        request: function (config) {
            __dom.mostrarCargador();
            return config;
        }
    };
    return responseInterceptor;
});

http.config(function ($httpProvider, $interpolateProvider) {
    $httpProvider.interceptors.push('ajaxInterceptor');
});

var INTEGER_REGEXP = /^\-?\d+$/;
function ajustarDatepicker() {
    $(".datepicker").each(function (i, item) {
        $.datepicker.setDefaults($.datepicker.regional.es);
        var datePicker = $(item).datepicker({
            dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
            dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"],
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true
        });
        datePicker.mask('9999-99-99');
        return datePicker;
    });
}

function downloadFile(response) {
    if (!response.error && response.noContent) {
        __dom.lanzarAlerta("El informe generado no contiene informacion para los parametros sumistrados", "Informacion");
        return;
    }
    if(response.error){
        __app.controlarError(response);
    }
    var link = document.createElement('a');
    link.href = "data:application/" + response.format + ";base64," + response.content;
    link.download = response.fileName;
    link.click();
}

function downloadFileDirect(response) {     
    if(response.size <=0 || response.size <= 500){
         __dom.lanzarAlerta("El informe generado no contiene informacion para los parametros sumistrados", "Informacion");
        return;
    }
    else{
    var link = document.createElement('a');
    var text = document.createTextNode("Descargar reporte");
    link.href = "../admin/download/"+response.id;    
    link.target = "_blank";
    link.style = 'display:none';
    link.appendChild(text);
    document.body.appendChild(link);
    link.click();
    }
    //$("#result").append(link);
}
function downloadFileDirectBySize(response,size) {     
    if(response.size < size){
         __dom.lanzarAlerta("El informe generado no contiene informacion para los parametros sumistrados", "Informacion");
        return;
    }
    else{
    var link = document.createElement('a');
    var text = document.createTextNode("Descargar reporte");
    link.href = "../admin/download/"+response.id;    
    link.target = "_blank";
    link.style = 'display:none';
    link.appendChild(text);
    document.body.appendChild(link);
    link.click();
    }
    //$("#result").append(link);
}

function appendPdf(response, panel) {
    if (response.format === 'pdf') {
        var data = "data:application/pdf;base64," + response.content;
        var iframe = $("<object>");
        $(iframe).attr("type", "application/pdf");
        $(iframe).attr("data", data);
        $(iframe).attr("width", "100%");
        $(iframe).attr("height", "100%");
        $("#" + panel).html(iframe);
    }
}

function appendHtml(response, panel) {
    if (response.format === 'pdf') {
        var data = "data:application/pdf;base64," + response.content;
        var iframe = $("<object>", {
            type: "application/pdf",
            //src: "pdfjs/web/viewer.html?file="+data,
            data: data,
            //width: '100%',
            //height: '350px'
        });
        $(iframe).attr("data", data);
        $(iframe).attr("width", "100%");
        $(iframe).attr("height", "100%");

        $("#" + panel).append(iframe);
    }
}

function showDialog(id, title, buttons, width) {
    var vWidth = width === null ? 550 : width;
    var dialog = $("#" + id).dialog({
        modal: true,
        width: vWidth,
        position: {my: "center", at: "top+30%", of: "body"},
        title: title,
        buttons: buttons
    });
    return dialog;
}

function showPDfJS(content) {
    var pdf = atob(content);
    PDFJS.getDocument({data: pdf}).then(function getPdfHelloWorld(pdf) {
        // Fetch the first page.
        pdf.getPage(1).then(function getPageHelloWorld(page) {
            var scale = 1.5;
            var viewport = page.getViewport(scale);
            // Prepare canvas using PDF page dimensions.
            var canvas = document.getElementById('the-canvas');
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            // Render PDF page into canvas context.
            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            page.render(renderContext);
        });
    });
}
