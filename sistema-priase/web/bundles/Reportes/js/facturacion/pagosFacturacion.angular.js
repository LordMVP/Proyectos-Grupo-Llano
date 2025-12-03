/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * @author AppFuture
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});


app.controller('PagosFacturacionControllerAngular', function ($scope, $http) {
    $scope.init = function () {

    };

    $scope.info = {municipio: null, tipo:1};

    /**
     * Consulta las municipios por perfil 
     */
    $http.get("../util/getJsonProyectos").then(function (response) {
        $scope.municipios = response.data.proyectos;
    });


    /**
     * Consulta los ciclos activos
     */
    $http.get("../util/getJsonListarAnos").then(function (response) {
        $scope.anos = response.data.anos;
    });
   
    /**
     * Periodos de año
     */
    $scope.cargarPeriodos = function (){
        $http.post("../util/getConsultarPeriodosPorAno", $scope.info).then(function (response) {
            $scope.periodos = response.data.periodos;
        });
    };

    $scope.generarReporte = function ($tipo) {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $scope.info.tipo = $tipo;
            $http.post("generarpagosfacturacion", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };

    $scope.generarReporte2 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarRecaudosfacturacion", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
    
    
    $scope.generarReporte3 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarRecaudosFacturacionConciliacion", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };




    $scope.init();

});
