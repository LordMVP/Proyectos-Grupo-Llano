/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('ProvisionGeneralController', function ($scope, $http) {
   // $scope.info = {fechaInicial:null,fechaFinal:null,estado:null,municipio:null};
    
    //$http.get("../util/getJsonProyectos").then(function(response){
      //  $scope.municipios = response.data.proyectos;
    //});
    //$http.get("../util/getJsonEstadosVenta").then(function(response){
      //  $scope.estadosVenta = response.data.items;
    //});
    $scope.info = {periodo: null, ciclo: null};
    $http.get("../util/getJsonCiclosActivos").then(function (response) {
        $scope.ciclos = response.data.ciclos;
    });

    $scope.actualizarPeriodos = function () {
        $http.get("../util/getJsonPeriodosCiclo/" + $scope.info.ciclo).then(function (response) {
            $scope.periodos = response.data.periodos;
        });
    };
    
    
    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("GenerarFacongas", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };
    
    $scope.generarReporte2 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("GenerarFacongasVillavo", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };
    
    $scope.generarReporte3 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarFacongasMunicipios", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };
    
    $scope.generarReporte4 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarFacongasExcel", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };
    
    $scope.generarReporte5 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarFacongasConsolidados", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };
    
    /*$scope.generarReporte7 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarFacongasIndustrial", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };*/
    
    /*$scope.generarReporte6 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarFacongasMercados", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };*/
    
    $scope.generarReporteUnico = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarFacongasUnico", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };

});
