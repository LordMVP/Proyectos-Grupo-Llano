/**
 * @fileOverview Archivo de control para devolucion recaudo
 * @author AppFuture
 * @requires devolucion.modelo.js
 * @version 1.0.0
 */

var app = angular.module('myApp', ['httpModule', 'ngTable']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('FinanciacionController', function ($scope, $http, $q, NgTableParams) {
    $scope.total = -1;
    $scope.isReload = false;
    $scope.info = {numero_orden: null, constructora_id: null, contrato: null, suscripcion: null, codigo_anterior: null};
    $scope.infoEnviar = {numeroFinanciacion: null};
    $http.post("../financiacionesTable/getColumns").then(function (response) {
        $scope.columnas = response.data.columnas;
    });

    function getData(params) {
        $scope.selected = null;
        var page = params.page();
        if ($scope.isReload) {
            page = 1;
            $scope.isReload = false;
          
        }
        return $http.post("../financiacionesTable/getInfo", {count: params.count(), page: page, extra: $scope.info}).then(function (response) {
            params.total(response.data.total);
            $scope.total = response.data.total;
            return response.data.data;
        });
    }
    ;

    $scope.reload = function () {
        $scope.isReload = true;
        $scope.ngTable.reload();        
    };

    var parameters = {count: '5', paginationMaxBlocks: 13, paginationMinBlocks: 2, };
    var settings = {counts: [], getData: getData};
    $scope.ngTable = new NgTableParams(parameters, settings);


    $scope.seleccionarFila = function (item) {
        $scope.selected = item;
        var id = item.numero_financiacion;
        $("#tr_" + id).addClass("row-selected").siblings().removeClass("row-selected");
        $("#ck_" + id).attr("checked", "true");
    };


    $scope.generarReporte = function () {
        $http.post("generarReporteEstadoCuentaFinanciacion", {'numeroFinanciacion': $scope.selected.numero_financiacion}).then(function (response) {
            downloadFile(response.data);
        });
    };
    
           $scope.generarReporte2 = function () {
        $http.post("generarReporteEstadoCuentaFinanciacion2", {'numeroFinanciacion': $scope.selected.numero_financiacion}).then(function (response) {
           downloadFileDirect(response.data);
        });
    };
    
    $scope.generarSaldo = function () {    
          if (!!$scope.fechaCorte ) {
                $scope.infoEnviar.fechaCorte = $scope.fechaCorte;
                $scope.infoEnviar.numeroFinanciacion = $scope.selected.numero_financiacion ;   
                $http.post("generarReporteSaldoFinanciacion", $scope.infoEnviar).then(function (response) 
                {
                    downloadFile(response.data);
                });                
            }              
            else
            {
                __dom.lanzarAlerta("La fecha de corte es obligatoria para este reporte. " ,"Error de Parametros ");
                return;                
            }  
       
    };

});


