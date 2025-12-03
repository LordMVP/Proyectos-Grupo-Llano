
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('ventasController', function ($scope, $http) {
    $scope.info = {fechaInicial:null,fechaFinal:null,liquidacion:null};
    
    
    $http.get("../util/getJsonLiquidacionesMinas").then(function(response){
        $scope.liquidaciones = response.data.items;
    });
    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarReporteMinisterioMinascsv", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };

});


