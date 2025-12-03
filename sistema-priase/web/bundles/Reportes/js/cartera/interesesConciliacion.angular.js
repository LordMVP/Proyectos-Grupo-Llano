
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors', 'angularModalService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.factory('modelo', function () {
    return {
        ciclosSeleccionados: [],
        temporal: []
    };
});


app.controller('InteresesConciliacionController', function ($scope, $http, ModalService, modelo) {
    $scope.modelo = modelo;
    $scope.init = function () {
    };



    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarReporteInteresesConciliacion", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };

    $scope.init();

});

