/**
 * Archivo de control para generar el reporte de rangos de consumo de gas del año actual
 * @author AppFuture
 * @version 1.0.0
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('rangosConsumoController', function ($scope, $http) {
    
   
    var fecha = new Date();
    var ano = fecha.getFullYear();
    var mes = fecha.getMonth();
    if (mes < 10) {
        $scope.mes = "0" + (mes + 1);
    }
    else {
        $scope.mes = (mes + 1) + "";
    }
    $scope.anno = ano;
    
    

    /**
     * Consulta los ciclos activos
     */
    $http.get("../util/getJsonMercados").then(function (response) {
        $scope.mercados = response.data.mercados;
    });


    this.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post('generar_reporte_rangos', {periodo: $scope.periodo, mercado: $scope.mercado, anno: $scope.anno}).then(function success(response) {
                downloadFileDirect(response.data);
            });
        }
    };
    
    this.generarReporte2 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post('generar_costos_ingresos', {periodo: $scope.periodo, mercado: $scope.mercado, anno: $scope.anno}).then(function success(response) {
                downloadFileDirect(response.data);
            });
        }
    };
});