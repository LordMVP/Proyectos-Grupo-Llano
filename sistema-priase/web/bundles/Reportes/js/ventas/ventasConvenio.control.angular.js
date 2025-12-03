
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('ventasController', function ($scope, $http) {
    $scope.info = {fechaInicial:null,fechaFinal:null,estado:null,municipio:null};
    
    $http.get("../util/getJsonProyectos").then(function(response){
        $scope.municipios = response.data.proyectos;
    });
    
    $http.get("../util/getJsonLiquidacionesVentas").then(function(response){
        $scope.liquidaciones = response.data.items;
    });
    
    $http.get("../util/getJsonEstadosVenta").then(function(response){
        $scope.estadosVenta = response.data.items;
    });
    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarVentasConvenio", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };

});


