/**
 * Archivo para hacer la gestión al momento de generar el reporte del resumen 
 * de los creditos que se han desembolsado
 * @author Appfuture
 * @version 1.0.0
 */
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('extractoCreditosController', function ($http, $scope) {
    $scope.infoEnviar = {
        idperiodo: $scope.idciclo
    };
    $http.get("../util/getJsonCiclosActivos").then(function (response) {
        $scope.ciclos = response.data.ciclos;
    });
    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            var combo = document.getElementById('txtciclo');
            $scope.infoEnviar = {
                idciclo: $scope.idciclo,
                nombreciclo: combo.options[combo.selectedIndex].text ,
                fechacorte: $scope.fechacorte ,
                idfinanciacion: $scope.idfinanciacion 
            };      
            $http.post("reporte_extracto_creditos", $scope.infoEnviar).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
});