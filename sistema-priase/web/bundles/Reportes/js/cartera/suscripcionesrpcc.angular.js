
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('SuscripcionesRpCcController', function ($scope, $http) {
    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarReporteSuscripcionesRpCc", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
});
