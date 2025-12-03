/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller("TarifasControllerAngular", function ($scope, $http) {
    $scope.info = {formato: "xlsx"};
    
    ///mercados
    $http.get("../util/getJsonMercados").then(function (response) {
        $scope.mercados = response.data.mercados;
    });
    
    ///periodo
    $http.get("../util/consultaPeriodosTarifas").then(function (response) {
        $scope.periodo = response.data.periodo;
    });
    
    
    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarTarifaValidar", {periodo: $scope.periodo, mercado: $scope.mercado}).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
});
