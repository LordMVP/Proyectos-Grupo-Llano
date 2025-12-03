/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('informacionBioController', function ($scope, $http) {
   
    $scope.info = {periodo: null, idciclo: null};
     $http.get("../util/getJsonCiclosGeneral").then(function (response) {
        $scope.ciclos = response.data.ciclos;
    });
    
     $http.get("../util/getJsonProyecto").then(function (response) {
        $scope.proyectos = response.data.proyectos;
    });
   
    $scope.actualizarPeriodos = function () {
        $http.get("../util/getJsonPeriodosCicloActivos/" + $scope.info.idciclo).then(function (response) {
            $scope.periodos = response.data.periodos;
            
        });
    };
    
    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("BioHomologadosFacturaActivo", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
    
    $scope.generarReporte2 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarGasNuevosBio", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    }; 
   

});
