/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * @author AppFuture
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});


app.controller('ProvisionCarteraControllerAngular', function ($scope, $http) {
    $scope.init = function () {

    };

    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarProvisionCartera", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };




    $scope.init();

});
