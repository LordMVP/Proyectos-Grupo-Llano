/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('carteraController', function ($scope, $http) {
    $scope.info = {nombreCiclo: "" ,reporte: "" };
    $scope.generarReporteBase = function () {
        $scope.$broadcast('show-errors-check-validity');        
        if ($scope.reporte.$valid) {
            $scope.info.nombreCiclo =  $("#ciclo option:selected").text();
            $scope.info.reporte = "1";
            $http.post("generarReporteInteresBase", $scope.info).then(function (response) {
                downloadFileDirect(response.data); 
            });
        }
    };
    $scope.generarReporteInteres = function () {
        $scope.$broadcast('show-errors-check-validity');        
        if ($scope.reporte.$valid) {
            $scope.info.nombreCiclo =  $("#ciclo option:selected").text();
            $scope.info.reporte = "2";
            $http.post("generarReporteInteresBase", $scope.info).then(function (response) {
                downloadFileDirect(response.data); 
            });
        }
    };
});
