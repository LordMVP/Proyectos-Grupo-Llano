/**
 * @fileOverview Archivo de control para devolucion recaudo
 * @author AppFuture
 * @requires devolucion.modelo.js
 * @version 1.0.0
 */

var app = angular.module('myApp', ['httpModule','ui.bootstrap.showErrors','ngTable']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('devolucionesController', function ($scope, $http,NgTableParams) {    
    $scope.info = {fechaInicio:null,fechaFinal:null,valorBusqueda:null};
    $scope.columnas = null;
    
    /*$http.post("../table/devoluciones/getColumns").then(function (response) {
        $scope.columnas = response.data.columnas;
    });*/
    
    function getData(params) {
        $scope.selected =null;
        return $http.post("../table/devoluciones/getData", {count: params.count(), page: params.page(), extra: $scope.info}).then(function (response) {
            params.total(response.data.total);
            $scope.total=response.data.total;
            return response.data.data;
        });
    };
    
    /**
     * Inicio modificacion Julian Poveda 
     */
    
    /*$scope.reload = function () {
        if(($scope.info.fechaInicio && !$scope.info.fechaFinal) || (!$scope.info.fechaInicio && $scope.info.fechaFinal)){
            __dom.lanzarAlerta('Para una busqueda por fecha debe ingresar los dos valores tanto fecha de inicio como fecha final.', 'Error');
            return;
        }
        $scope.ngTable.reload();
    };*/
    
    $scope.buscarDevoluciones = function () {
        /*if((!$scope.info.fechaInicio || !$scope.info.fechaFinal)){
            __dom.lanzarAlerta('Para una busqueda por fecha debe ingresar los dos valores tanto fecha de inicio como fecha final.', 'Error');
            return;
        }else{*/
            $http.post("../cartera/buscarDevoluciones", $scope.info).then(function (response) {
                $scope.columnas = response.data.columnas;
            });
            
            /*$http.post("../table/devoluciones/buscarDevoluciones", $scope.info).then(function (response) {
                $scope.columnas = response.data.columnas;
            });*/
        //}
        //$scope.ngTable.reload();
        return $scope.columnas;
    };
    
    /**
     * Fin modificacion Julian Poveda
     */
    
    
    
    var parameters = {count: '5'};
    var settings = {counts: [], getData: getData};
    $scope.ngTable = new NgTableParams(parameters, settings);    
    
    $scope.seleccionarFila = function (item) {
        $scope.selected = item;
        var id = item.recaudo_id;
        $("#tr_" + id).addClass("row-selected").siblings().removeClass("row-selected");
        $("#ck_" + id).attr("checked", "true");
    };
    
    
    $scope.datosBusquedad = {};
    $scope.recaudoSeleccionado = {};
    $scope.buscarDevolucion = function () {
        $scope.dialogoBuscar = showDialog('divBuscar', 'Buscar devoluciones', {'Buscar': $scope.procesarBusquedad}, 550);
    };

    $scope.generarReporte = function () {
        var recaudo = $scope.selected.recaudo_id;        
        alert($scope.selected.recaudo_id);
        if (recaudo !== null) {
            $http.post("generarReporteDevolucion/" + recaudo).then(function (response) {
                downloadFile(response.data);
            });
        }
    };

});

$(document).ready(function () {
    $('#module').css('display', 'block');
});

