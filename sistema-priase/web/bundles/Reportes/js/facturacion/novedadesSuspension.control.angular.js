
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('facturacionController', function ($scope, $http) {

    var date = moment(); //Get the current date    
    $scope.info = {fechaInicial: null, fechaFinal: null, tipoSuspension: '-1', tipoUso: '-1', novedad: '-1', tipoReporte: '1',motivo:'-1'};
    $scope.info.fechaFinal = date.format("YYYY-MM-DD"); //2014-07-10
    $http.get("../util/getJsonTiposUso").then(function (response) {
        $scope.tiposUso = response.data.tiposUso;
    });

    $http.get("../util/getJsonTiposSuspension").then(function (response) {
        $scope.tiposSuspension = response.data.datos;
    });

    $http.get("../util/getJsonNovedadesSuspension").then(function (response) {
        $scope.novedadesSuspension = response.data.datos;
    });
    
    $http.get("../util/getJsonMotivosSuspension").then(function (response) {
        $scope.motivosSuspension = response.data.datos;
    });
    
    $http.get("../util/getJsonMotivosReconexion").then(function (response) {
        $scope.motivosReconexion = response.data.datos;
    });

    $http.get("../util/getJsonNovedadesReconexion").then(function (response) {
        $scope.novedadesReconexion = response.data.datos;
    });

    $scope.actualizarPeriodos = function () {
        $http.get("../util/getJsonPeriodosCiclo/" + $scope.info.ciclo).then(function (response) {
            $scope.periodos = response.data.periodos;
        });
    };

    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            var report = $scope.info.tipoReporte === '1' ? 'generarNovedadesSuspensiones' : 'generarNovedadesReconexiones';
            $http.post(report, $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });

        }
    };
    $scope.generarReporteNovedades = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            var report = $scope.info.tipoReporte === '1' ? 'generarNovedadesSS' : 'generarNovedadesReconexiones';
            $http.post(report, $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });

        }
    };

});


