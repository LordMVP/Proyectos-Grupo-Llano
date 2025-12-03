/**
 * @fileOverview Archivo de control para devolucion recaudo
 * @author AppFuture
 * @requires devolucion.modelo.js
 * @version 1.0.0
 */

var app = angular.module('myApp', ['httpModule']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('facturacionController', function ($scope, $http) {
    
    $scope.info = {proyecto: 'all', tipoInstalacion: 'all'};
    
    $scope.buscarPeriodos = function () {
        $http.get("buscarPeriodosCiclo/" + $scope.info.ciclo).then(function (response) {
            $scope.periodos = response.data.periodos;
        });
    };

    $scope.generarReporte = function () {
        if ($scope.formReporte.$valid) {
            $http.post("generarReporteFacturacion",$scope.info).then(function (response) {
                downloadFile(response.data);
            });
        } else {
            $scope.formReporte.$submitted = true;
        }

    };

});


