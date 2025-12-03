/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller("RecaudosWereController", function ($scope, $http) {
    $scope.info = {formato: "pdf" ,opc: 0  };
    $scope.generarReporte = function (opcc) {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $scope.info.opc = opcc ; 
            $http.post("generarReporteIncompletosWERE", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };
});
