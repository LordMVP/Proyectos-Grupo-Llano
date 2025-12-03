/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict'

var app = angular.module('myApp', ['httpModule']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller("ReportesController",function($scope,$http){
    
    $http.get("getReportsJson").then(function(response){
        $scope.reportes = response.data.reports;
    });
    $scope.seleccionarReporte=function(reporte){
      $scope.reporte=reporte;  
    };
    
});