
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('FacturacionController', function ($scope, $http) {

    $scope.info = {};
    var fecha = new Date();
    var ano = fecha.getFullYear();
    var mes = fecha.getMonth();
    if (mes < 10) {
        $scope.info.mes = "0" + (mes + 1);
    }
    else {
        $scope.info.mes = (mes + 1) + "";
    }
    $scope.info.anno = ano;


    $scope.generarReporte = function (format) {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $scope.info.format=format;
            $http.post("generarReporteFacturacionEmitida", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };

});


