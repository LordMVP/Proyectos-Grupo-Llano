
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('ventasController', function ($scope, $http) {
    $scope.info = {estrato:null,municipio:null,tipouso:null};
    
    $http.get("../util/getJsonProyectos").then(function(response){
        $scope.municipios = response.data.proyectos;
    });
    $http.get("../util/getJsonTiposUso").then(function(response){
        $scope.tipouso = response.data.tiposUso;
    });
    
   
    $scope.generarReporteScoring = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarReporteScoringSerfigas", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };

});


