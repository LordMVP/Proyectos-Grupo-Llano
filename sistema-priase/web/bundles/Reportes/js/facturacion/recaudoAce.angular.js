/**
 * Archivo de control para hacer el reporte de recaudos de Ace seguros
 * @author Appfuture
 * @version 1.0.0
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('recaudoAceController', function ($scope, $http) {

    /**
     * Consulta los periodos por ciclo
     */
    $http.get("../util/getJsonListarAnos").then(function (response) {
        $scope.anos = response.data.anos;
    });
    
       /**
     * Consulta las empresas
     */
    $http.get("../util/consultarEmpresaGeneral").then(function (response) {
            $scope.empresas = response.data.empresas;
        });
    
   

    /**
     * Consulta los periodos por ciclo
     */
    /*$http.get("../util/getJsonPeriodos").then(function (response) {
        $scope.periodos = response.data.periodos;
    });*/


    /**
     * Consulta los periodos por año
     */
    $scope.cargarPeriodosAno = function () {
        console.log($scope.info.anos);
        $http.post("../util/getConsultarPeriodosPorAnoGeneral", $scope.info).then(function (response) {
            $scope.periodos = response.data.periodos;
        });
    };
    
    
     /**
     * Consulta los periodos por Ace Seguros
     */
    $scope.cargarPeriodosAnoAce = function () {
        console.log($scope.info.anos);
        $http.post("../util/getConsultarPeriodosPorAnoAce", $scope.info).then(function (response) {
            $scope.periodos = response.data.periodos;
        });
    };
    
        
    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post('generar_reporte_recaudo_ace',
                    $scope.info
                    ).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
});