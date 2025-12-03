/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller("FinanciacionController", function ($scope, $http) {
    $scope.info = {formato: "pdf",tipoUso:'-1',codigoProyecto:'-1'};
    $scope.filtrosEspeciales = '0';
    $scope.generarReporte = function (tipo) {
        $scope.info.tipoReporte = tipo;
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarFinanciacionConcepto", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
                //downloadFile(response.data);
            });
        }
    };
});
