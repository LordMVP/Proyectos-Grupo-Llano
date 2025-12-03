/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller("CentralesController", function ($scope, $http) {
    $scope.info = {formato: "pdf"};

    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarCentralesRiesgoExcel", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
                //downloadFile(response.data);
            });
        }
    };
    
    $scope.generarReporte2 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarCentralesRiesPositivo", $scope.info).then(function (response) {
                console.log(response.data) ;
                downloadFileDirect(response.data);
                //downloadFile(response.data);
            });
        }
    };
});
