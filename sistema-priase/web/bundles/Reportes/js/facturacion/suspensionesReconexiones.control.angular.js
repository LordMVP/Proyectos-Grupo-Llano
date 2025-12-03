
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('facturacionController', function ($scope, $http) {

    $scope.info = {periodo: null, ciclo: null, tipo: null,proyecto: null ,idmotivo:null};
    $http.get("../util/getJsonCiclosActivos").then(function (response) {
        $scope.ciclos = response.data.ciclos;
    });

    $scope.actualizarPeriodos = function () {
        $http.get("../util/getJsonPeriodosCiclo/" + $scope.info.ciclo).then(function (response) {
            $scope.periodos = response.data.periodos;
        });
    };
    
    $http.get("../util/getJsonProyectos").then(function (response) {
        $scope.proyectos = response.data.proyectos;
    });
    
    $scope.actualizarMotivos = function () {
        $http.get("../util/getJsonMotivo/" + $scope.info.tipo).then(function (response) {
            $scope.resultados = response.data.resultados;
        });
    };

    $scope.generarReporte = function ($jornada) {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $scope.info.jornada = $jornada;
            $http.post("generarReporteSuspensionesReconexionesRTR", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
    
    $scope.generarReporte2 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarListaSuspensionesRTR", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };
    
    $scope.generarReporte3 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarListaReconexionesRTR", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };
    
    $scope.generarReporte4 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarReporteSuspensionesReconexionesMora", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
    $scope.generarReporte5 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarReporteSusyRxTarde", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
   

});


