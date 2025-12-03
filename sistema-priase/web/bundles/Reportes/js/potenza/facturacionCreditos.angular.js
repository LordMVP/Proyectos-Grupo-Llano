/**
 * Archivo para hacer la gestión al momento de generar el reporte del resumen 
 * de los creditos que se han desembolsado
 * @author Appfuture
 * @version 1.0.0
 */
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('facturacionCreditosController', function ($http, $scope) {
    $scope.infoEnviar = {
        idperiodo: $scope.idperiodo
    };

    $http.get("../util/getJsonCiclosActivos").then(function (response) {
        $scope.ciclos = response.data.ciclos;
    });
    /**
     * Consulta los periodos por ciclo
     */
    $scope.actualizarPeriodos = function () {
        $http.get("../util/getJsonPeriodosCiclo/" + $scope.idciclo).then(function (response) {
            $scope.periodos = response.data.periodos;
            $scope.idperiodo = null;
        });
    };

    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            var combo = document.getElementById('txtperiodo');
            $scope.infoEnviar = {
                idperiodo: $scope.idperiodo,
                nombreperiodo: combo.options[combo.selectedIndex].text
            };
            if (!!$scope.idconvenio && $scope.idconvenio !== '-1') {
                $scope.infoEnviar.idconvenio = $scope.idconvenio;
            }
            $http.post("reporte_facturacion_creditos", $scope.infoEnviar).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
    $scope.generarFormatoFC = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            var combo = document.getElementById('txtperiodo');
            $scope.infoEnviar = {
                idperiodo: $scope.idperiodo,
                nombreperiodo: combo.options[combo.selectedIndex].text
            };
            if (!!$scope.idconvenio && $scope.idconvenio !== '-1') {
                $scope.infoEnviar.idconvenio = $scope.idconvenio;
            }
            if (!!$scope.idfinanciacion && $scope.idfinanciacion !== '') {
                $scope.infoEnviar.idfinanciacion = $scope.idfinanciacion;
                //alert ('Hola');
            }
            $http.post("reporte_Factura_Computador", $scope.infoEnviar).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
});