/**
 * Archivo de contorl de recaudos de las financiaciones
 * @author AppFuture
 * @version 1.0.0
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']);
app.controller('recaudoFinanciacionController', function ($scope, $http) {
    this.validarFechaFinal = function () {
        var fechaInicio = new Date($scope.fechaInicio.replace(/-/g, '/'));
        var fechaFin = new Date($scope.fechaFin.replace(/-/g, '/'));
        $('#fechaFinal').datepicker('option', 'minDate', fechaInicio);

        if (fechaFin < fechaInicio) {
            $scope.fechaFin = '';
        }
    }
    this.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post('generar_reporte_recaudos', {fechaInicio: $scope.fechaInicio, fechaFin: $scope.fechaFin}).then(function success(response) {
                downloadFileDirect(response.data);
            });
        }
    }
});
