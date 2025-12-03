
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('carteraController', function ($scope, $http) {

    var date = moment(); //Get the current date    
    $scope.info = {fechaInicial: null, fechaFinal: null, proyecto: '-1', tipoUso: '-1',ciclo:'-1',tipoReporte:'1'};
    
    
    $http.get("../util/getJsonTiposUso").then(function (response) {
        $scope.tiposUso = response.data.tiposUso;
    });
    
   /* $http.get("../util/getJsonNovedadesSuspension").then(function (response) {
        $scope.novedadesSuspension = response.data.datos;
    });      */
    

    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            var report ='generarReporteSuspensionesReconexionesConsolidado';
            $http.post(report, $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });

        }
    };

});


