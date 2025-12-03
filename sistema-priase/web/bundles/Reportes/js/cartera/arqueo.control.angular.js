/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller("ArqueoController", function ($scope, $http) {
    $scope.info = {formato: "pdf", nomcajero: null ,carcajero:null };
        
    $http.get("../util/getJsonMediosPagos").then(function (response) {
        $scope.mediosPago = response.data.medospagos;
    });
    
    
    $http.get("../util/getJsonCajeros").then(function (response) {
        $scope.items = response.data.items;
    });
    
    $scope.generarReporte = function () {
        
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarReporteArqueoCaja", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };
    
    $scope.generarReporte2 = function () {
        
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $scope.info.nomcajero =  $("#idcajero option:selected").text();
            $scope.info.carcajero =  $("#idcajero option:selected").attr ('data-cargo');
            $scope.info.nomproyecto =  $("#codigoProyecto option:selected").attr ('data-proyecto');
            $http.post("generarReporteArqueoCaja2", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };
    
    
    $scope.updateCajeros = function(){
        $http.get("../util/getJsonCajeroMedPago/"+ $scope.info.medioPago).then(function (response) {
            $scope.cajeros2 = response.data.cajeros;
        });    
    };
});
