/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('ConsumoCeroController', function ($scope, $http) {
       
    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        $http.post("generarReporteConsumoCero", $scope.info).then(function (response) {
            downloadFileDirect(response.data);
        });
    };
    
    $scope.generarReporte2 = function () {
        $scope.$broadcast('show-errors-check-validity');
        $http.post("generarReporteConsumoCeroMes", $scope.info).then(function (response) {
            downloadFileDirect(response.data);
        });
    };
    
    $scope.generarReporte3 = function () {
        $scope.$broadcast('show-errors-check-validity');
        $http.post("generarReporteConsumoComite", $scope.info).then(function (response) {
            downloadFileDirect(response.data);
        });
    };
    
});
