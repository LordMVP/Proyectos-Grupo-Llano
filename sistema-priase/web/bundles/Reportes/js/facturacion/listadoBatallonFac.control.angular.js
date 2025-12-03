
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap','ngTable']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});




app.controller('facturacionController', function ($scope, $http,NgTableParams) {

    $scope.terceros = [];
    var initialParams = {count: 5};
    var initialSettings = {counts: [],paginationMaxBlocks: 13,paginationMinBlocks: 2,dataset: $scope.terceros};
    $scope.ngTable = new NgTableParams(initialParams, initialSettings);
    
    $scope.buscarTerceroNombre = function () {
        $http.get("../util/buscarTerceroNombre/" + $scope.nombreTercero).then(function (response) {
            $scope.terceros = response.data.terceros;
            $scope.ngTable.reload();            
        });
    };

    $scope.buscarTerceroDocumento = function () {
        $http.get("../util/buscarTerceroDocumento/" + $scope.documentoTercero).then(function (response) {
            $scope.tercero = response.data.tercero;
        });
    };

    $scope.cargarPeriodosCiclo = function () {
        if ($scope.ciclo !== -1)
            $http.get("../util/getJsonPeriodosCiclo/" + $scope.ciclo).then(function (response) {
                $scope.periodos = response.data.periodos;
            });
    };
    $scope.generarReporte = function () {
        $http.post("generarListadoLecturasSuscriptor", $scope.suscriptor).then(function (response) {
            downloadFile(response.data);
        });
    };

});



