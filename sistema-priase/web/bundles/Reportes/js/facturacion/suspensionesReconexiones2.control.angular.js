
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('facturacionController', function ($scope, $http) {

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
            $http.post("generarReporteSuspensionesReconexiones2", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };

});


