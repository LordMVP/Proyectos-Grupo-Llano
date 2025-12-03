/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('VariablesCalController', function ($scope, $http) {
    
    $http.get("../util/getJsonMercadosActivos").then(function (response) {
        $scope.mercados = response.data.mercados;
    });

    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarReporteVariablesCalculo", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
});
