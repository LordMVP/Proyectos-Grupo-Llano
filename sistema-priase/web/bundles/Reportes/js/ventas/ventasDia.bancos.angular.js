/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller("VentasDiaBancosController", function ($scope, $http) {
    $scope.info = {fechaConsulta1:null,fechaConsulta2:null,estado:null,facturado:null};
    
    $http.get("../util/getJsonBancosGeneral").then(function(response){
        $scope.bancos = response.data.bancos;
    });
    
    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarReporteVentasDias", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
    $scope.generarReporte2 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarReporteVentasBancos", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
});
