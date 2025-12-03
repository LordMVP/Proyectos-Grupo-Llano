/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller("EstadoCuentaController", function ($scope, $http) {
    $scope.info = {formato: "pdf"};
    $scope.procesarBusquedad = function (format) {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $scope.info.format = format;
            $http.post('generarReporteEstadoCuenta', $scope.info).then(function (response) {
                if ($scope.download) {
                    downloadFile(response.data);
                } else if (!$scope.download && response.data.format === 'pdf') {
                    appendPdf(response.data, "resultado");
                }
            });
        }
    };
    
    $scope.procesarBusquedad2 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post('generarReporteEstadoCuentaXlsx', $scope.info).then(function (response) {
                if ($scope.download) {
                    downloadFile(response.data);
                } else if (!$scope.download && response.data.format === 'xlsx') {
                    appendPdf(response.data, "resultado");
                }
            });
        }
    };
    
    
});
