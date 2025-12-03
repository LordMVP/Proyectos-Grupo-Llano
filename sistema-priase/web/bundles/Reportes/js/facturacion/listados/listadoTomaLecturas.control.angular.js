/**
 * @fileOverview Archivo de control para devolucion recaudo
 * @author AppFuture
 * @requires devolucion.modelo.js
 * @version 1.0.0
 */

var app = angular.module('myApp', ['httpModule', 'ngAnimate']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('facturacionController', function ($scope, $http) {
    $scope.ocultarTabla = false;
    $scope.tercero = null;
    $scope.meses = null;
    $scope.annos = null;
    $scope.ciclo = -1;
    $scope.tipoUso = -1;
    
    
    $http.get("../util/getConsultarPeriodos").then(function (response) {
        $scope.meses = response.data.periodos;
    });
    
    
     $http.get("../util/getJsonListarAnos").then(function (response) {
        $scope.annos = response.data.anos;
    });
        

    $scope.buscarTercero = function (tipo) {
        if (tipo === 1) {
            $scope.search = $scope.searchCodigo;
        }
        if (tipo === 2) {
            $scope.search = $scope.searchNombre;
        }
        
        $http.get("../util/buscarTerceroInfo/" + $scope.search + "/" + tipo).then(function (response) {
            $scope.terceros = response.data.terceros;
            $scope.ocultarTabla = false;
            $scope.tercero = null;
        });        
    };

    $scope.generarReporte = function (tipo) {
        var tipoUso = -1;
        var ciclo = -1;        
        if ($scope.tipoUso >= 0) {
            tipoUso = $scope.tiposUso[$scope.tipoUso].f1;
        }
        if ($scope.ciclo >= 0) {
            ciclo = $scope.ciclos[$scope.ciclo].cic_ideregistro;
        }
        $http.post("generarReporteBatallonFac", {tipo: tipo, tercero: $scope.tercero.tercero_id, 
                tipoUso: tipoUso, ciclo: ciclo, mesPeriodo: $scope.mesPeriodo, annoPeriodo: $scope.annoPeriodo}).then(function (response) {
            downloadFile(response.data);
        });
    };
    
    $scope.updateTipoUso = function (ciclo) {
        $scope.tiposUso = $scope.ciclos[ciclo].tipo_usos;
    };

    $scope.seleccionarTercero = function (tercero) {
        $scope.tercero = tercero;
        $scope.ocultarTabla = true;
        $scope.ciclos = JSON.parse($scope.tercero.ciclos);
        //$scope.tiposUso = JSON.parse($scope.tercero.tipo_usos);
    };


    $scope.cargarPeriodosCiclo = function () {
        if ($scope.ciclo !== -1)
            $http.get("../util/getJsonPeriodosCiclo/" + $scope.ciclo).then(function (response) {
                $scope.periodos = response.data.periodos;
            });
    };


});


