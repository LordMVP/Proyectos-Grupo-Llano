/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('ContribucionController', function ($scope, $http) {
    
    $scope.info = {periodo: null, ciclo: null};
    $http.get("../util/getJsonCiclosActivos").then(function (response) {
        $scope.ciclos = response.data.ciclos;
    });
    
    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarContribucionMes", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
});
