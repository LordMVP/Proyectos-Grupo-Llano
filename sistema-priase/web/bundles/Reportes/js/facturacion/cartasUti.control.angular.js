
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('facturacionController', function ($scope, $http) {

    var date = moment(); //Get the current date    
    $scope.info = {fechaInicial: '',fechaFinal:'', proyecto: '-1', tipoUso: '-1', ciclo: '-1', ruta: null, estado:'A'};
    

    $http.get("../util/getJsonTiposUso").then(function (response) {
        $scope.tiposUso = response.data.tiposUso;
    });

    $scope.cambiarCiclo = function () {
        $http.get("../util/getJsonRutasCiclo/"+$scope.info.ciclo).then(function (response) {
            $scope.rutas = response.data.rutas;
        });
    };


    /* $http.get("../util/getJsonNovedadesSuspension").then(function (response) {
     $scope.novedadesSuspension = response.data.datos;
     });      */


    $scope.generarReporte = function (formato) {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            var report = 'generarReporteCartasUti';
            $scope.info.formato = formato;
            var pro= $scope.info.proyecto;
            pro=pro.join();
            console.log(pro);
            $scope.info.proyecto=pro;
            $http.post(report, $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });

        }
    };
    
    $scope.generarReporte1 = function (formato) {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            var report = 'marcarNotificacion';
            $scope.info.formato = formato;
            var pro= $scope.info.proyecto;
            pro=pro.join();
            console.log(pro);
            $scope.info.proyecto=pro;
            $http.post(report, $scope.info).then(function (response) {
                //downloadFileDirect(response.data);
                console.log(response)
            });

        }
    };

});
