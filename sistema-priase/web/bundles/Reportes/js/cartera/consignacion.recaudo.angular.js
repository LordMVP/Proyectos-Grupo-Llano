/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller("ConsignacionRecaudoController", function ($scope, $http) {
    $scope.info = {formato: "xlsx"};
    
    $http.get("../recaudos/getJsonMediosPagoUsuario").then(function (response) {
        $scope.metodosPago = response.data.mediosPago;
    });
    
    
    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarReporteConsignacionRecaudo", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };
});
