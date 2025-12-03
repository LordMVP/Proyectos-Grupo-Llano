/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors', 'ui.bootstrap', 'ngAnimate', 'ngTable']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('NovedadLecturaController', function ($scope, $http, NgTableParams) {
   
   $scope.info = {periodo: null, municipio: null, ruta: null};
    $scope.rutasSeleccionadas = [];
    $scope.rutas = [];
    
    var settings2 = {counts: [], dataset: $scope.rutasSeleccionadas};
    var parameters = {count: '7', paginationMaxBlocks: 13, paginationMinBlocks: 2, sorting: {ideruta: "asc"}};


    $scope.ngTable2 = new NgTableParams(parameters, settings2);
    /*
    $http.get("../util/getJsonRutas").then(function (response) {
        $scope.rutas = response.data.rutas;
        $scope.ngTable = new NgTableParams(parameters, {counts: [], dataset: $scope.rutas});
    });
    */
    $scope.buscarRutas = function () {
        $scope.nofound = false;
        $http.post("buscarRutasPorProyecto", $scope.info).then(function (response) {
            $scope.rutas = response.data.rutas;
            $scope.nofound = $scope.rutas.length === 0;
            $scope.ngTable = new NgTableParams(parameters, {counts: [], dataset: $scope.rutas});
        });

    };

    $http.get("../util/getJsonProyectos").then(function (response) {
        $scope.municipios = response.data.proyectos;
    });

    function removerFromArray(array, object) {
        var index = array.indexOf(object);
        array.splice(index, 1);
    }

    $scope.agregarRuta = function (ruta) {
        $scope.rutasSeleccionadas.push(ruta);
        removerFromArray($scope.rutas, ruta);
        $scope.ngTable2.reload();
        $scope.ngTable.reload();
    };
    $scope.removerRuta = function (ruta) {
        removerFromArray($scope.rutasSeleccionadas, ruta);
        $scope.rutas.push(ruta);
        $scope.ngTable2.reload();
        $scope.ngTable.reload();
    };
 
    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarCambioMedidor", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
       
    $scope.generarReporte2 = function (type) {
        $scope.$broadcast('show-errors-check-validity');
        var url="generarReporteListasRutas";        
        if ($scope.reporte.$valid) {
            $scope.rutasFinales = [];
            if ($scope.todasRutas == 1) {
                $scope.info.ruta = "all";
            } else {
                for (var i = 0; i < $scope.rutasSeleccionadas.length; i++) {
                    $scope.rutasFinales.push($scope.rutasSeleccionadas[i].ideruta);
                }
                if ($scope.rutasFinales.length == 0) {
                    alert("No se han seleccionado rutas");
                    return;
                } else {
                    $scope.info.ruta = $scope.rutasFinales;
                }
            }
            $http.post(url, $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
    
});
