/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors', 'ngTable']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('DuplicadoController', function ($scope, $http, NgTableParams) {
   //$scope.info = {formato: "pdf"};
   $scope.total=-1;   
   $scope.years = [2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030];
   $scope.columnas = [];
    var parameters = {count: '5',paginationMaxBlocks: 13,paginationMinBlocks: 2}; 

    $scope.buscarPeriodos = function () {
            $scope.nofound = false;

            $http.post("../facturacionReportes/buscarDuplicadoFacturaPeriodo", $scope.info).then(function (response) {
                $scope.agrupados = response.data.columnas;
                $scope.nofound = $scope.columnas.length === 0;
                $scope.ngTable = new NgTableParams(parameters, {counts: [], dataset: $scope.agrupados});
            }); 
    }; 
    
    $scope.actualizarAnno = function () {
        $http.get("../util/getJsonUsuarioAnno/" + $scope.info.idSuscripcion).then(function (response) {
            $scope.annos = response.data.annos;
        });
    };
    
    $scope.actualizarSuscripcion = function () {
            $scope.info.idSuscripcion = 0;
    };
    
 $scope.seleccionarFila = function (item) {
        $scope.selected = item;
        var id = item.ide;
        $("#tr_" + id).addClass("row-selected").siblings().removeClass("row-selected");
        $("#ck_" + id).attr("checked", "true");
    };
    
    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarDuplicadoLocal", $scope.info).then(function (response) { 
                downloadFile(response.data);
            });
            
        }
    };
    
    $scope.generarReporte2 = function (tipo) {
        $scope.idtipo = tipo;
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
        $http.post("generarDuplicadoLocalPeriodo",{'ide':$scope.selected.ide,'idSuscripcion':$scope.info.idSuscripcion, 'idTipo':$scope.idtipo}).then(function (response) {
            downloadFile(response.data);
            });
        }
    };
    
    $scope.generarReporte3 = function (tipo) {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
        $http.post("generarDuplicadoVariasSuscripciones",{'idSuscripciones':$scope.info.idSuscripciones}).then(function (response) {
            downloadFile(response.data);
            });
        }
    };

});
