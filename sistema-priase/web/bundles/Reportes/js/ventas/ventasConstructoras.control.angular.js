/**
 * @fileOverview Archivo de control para devolucion recaudo
 * @author AppFuture
 * @requires devolucion.modelo.js
 * @version 1.0.0
 */

var app = angular.module('myApp', ['httpModule', 'ngTable', 'ui.bootstrap']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('ventasController', function ($scope, $http, $q, NgTableParams) {
    $scope.total=-1;
    $scope.info = {documento: null, constructora_id: null, contrato: null};
    $http.post("../constructoraTable/getColumns").then(function (response) {
        $scope.columnas = response.data.columnas;
    });

    function getData(params) {
        $scope.selected =null;
        return $http.post("../constructoraTable/getInfo", {count: params.count(), page: params.page(), extra: $scope.info}).then(function (response) {
            params.total(response.data.total);
            $scope.total=response.data.total;
            return response.data.data;
        });
    };

    $scope.reload = function () {
        $scope.ngTable.reload();
    };

    var parameters = {count: '5',paginationMaxBlocks: 13,paginationMinBlocks: 2};
    var settings = {counts: [], getData: getData};
    $scope.ngTable = new NgTableParams(parameters, settings);

    $scope.seleccionarFila = function (item) {
        $scope.selected = item;
        var id = item.numero_orden;
        $("#tr_" + id).addClass("row-selected").siblings().removeClass("row-selected");
        $("#ck_" + id).attr("checked", "true");
    };

    $scope.buscarAu = function (term) {
        return $http({
            url: "../util/findJsonConstructoraByName",
            method: 'post',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $.param({nombre: term})
        }).then(function (response) {
            return response.data.resultados;
        });
    };

    
    $scope.generarReporte = function () {
        $http.post("generarReporteConstructora",{'numeroOrden':$scope.selected.numero_orden}).then(function (response) {
            downloadFile(response.data);
        });
    };
    
    $scope.generarReporte2 = function () {
        $http.post("generarReporteConstructoraDetalle",{'numeroOrden':$scope.selected.numero_orden}).then(function (response) {
            downloadFile(response.data);
        });
    };

});


