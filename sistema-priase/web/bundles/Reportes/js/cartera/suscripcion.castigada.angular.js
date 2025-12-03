/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('SuscripcionController', function ($scope, $http) {
    $scope.info = {formato: "pdf"};
    //$scope.info = {fechaInicial:null,fechaFinal:null};
    
    //$http.get("../util/getJsonProyectos").then(function(response){
      //  $scope.municipios = response.data.proyectos;
    //});
    //$http.get("../util/getJsonEstadosVenta").then(function(response){
      //  $scope.estadosVenta = response.data.items;
    //});
    
    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarSuscripcionCastigada", $scope.info).then(function (response) {
                downloadFileDirect(response.data);//downloadFile(response.data); --cambio jepoveda
            });
        }
    };
    
    
    
    $scope.generarReporteCastigoAgrupado = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarSuscripcionCastigadaAgrupada", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };
    
    $scope.generarMorososSSPD = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarMorososSSPD", $scope.info).then(function (response) {
                downloadFileDirect(response.data);//downloadFile(response.data); --cambio jepoveda
            });
        }
    };
});
