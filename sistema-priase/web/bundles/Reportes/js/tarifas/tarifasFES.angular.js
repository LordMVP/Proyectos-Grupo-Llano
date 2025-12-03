/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
   $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('TarifasFESController', function ($scope, $http) {
   
   $scope.generarReporte = function () {
     $scope.$broadcast('show-errors-check-validity');
     if ($scope.reporte.$valid) {
           $http.post("generarTarifasFES", $scope.info).then(function (response) { 
                var infDoc = atob(response.data.content);
                response.data.content = btoa(infDoc.substring(0, infDoc.length-1));	
                downloadFile(response.data);
           });
       }
   };
});