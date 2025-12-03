/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors', 'ui.bootstrap', 'ngAnimate', 'ngTable']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller("RecaudoFinMesController", function ($scope, $http, NgTableParams) {
    
    
    $scope.info = {mediosPago: null, lista:null};
        
    $http.get("../util/getJsonMediosPagos").then(function (response) {
        $scope.mediosPago = response.data.medospagos;
    });
    
       
    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        
        if(($scope.info.mediosPago === null) || ($scope.info.mediosPago.length === 0)){
            $scope.info.lista = "";
        }else{
            $scope.info.lista = $scope.info.mediosPago.toString();
        }
        
        $scope.info.mediosPago = "";
        
        if ($scope.reporte.$valid) {
            $http.post("generarReporteRecaudoFinMes", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
        
    };
});
