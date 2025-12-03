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

    //$scope.info = {proyecto: 'all', tipoInstalacion: 'all'};

    $http.post('obtenerCicloPeriodoActual').then(function (response) {
        if (response.data.codigoRespuesta !== -1) {
            $scope.info = response.data.info;
        }
    });

    $scope.generarReporte = function () {
        $http.post("generarReporteFacturacion", $scope.info).then(function (response) {
            downloadFile(response.data);
        });
    };

});


