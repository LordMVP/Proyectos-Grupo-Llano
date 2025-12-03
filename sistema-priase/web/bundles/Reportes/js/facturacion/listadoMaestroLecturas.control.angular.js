
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('facturacionController', function ($scope, $http) {

    $scope.info = {consumo: 0, operador: '>='};
    var fecha = new Date();
    var ano = fecha.getFullYear();
    var mes = fecha.getMonth();
    $scope.info.anno = ano;
    $scope.info.mes = (mes+1)+"";
    
    $http.get("../util/getJsonTiposUso").then(function (response) {
        $scope.tiposUso = response.data.tiposUso;
    });

    $http.get("../util/getJsonProyectos").then(function (response) {
        $scope.proyectos = response.data.proyectos;
    });

    $http.get("../util/getJsonNovedades").then(function (response) {
        $scope.novedades = response.data.novedades;
    });
    
    $http.get("../util/getJsonCiclosActivos").then(function (response) {
        $scope.ciclos = response.data.ciclos;
    });

    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarMaestroLecturas", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };

});


