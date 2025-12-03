/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller("SuspensionesReconexionesController", function ($scope, $http) {
    $scope.info = {formato: "pdf",proyecto: null,tipo: null,idmotivo:null};
    
    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarListaSuspensionesRTR", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
    
    $scope.actualizarMotivos = function () {
        $http.get("../util/getJsonMotivo/" + $scope.info.tipo).then(function (response) {
            $scope.resultados = response.data.resultados;
        });
        
        $http.get("../util/getJsonFiltroSuspension/" + $scope.info.tipo).then(function(response){
            $scope.filtros_suspension = response.data.filtros_suspension;
        });
    };
    
            $scope.isChecked = function(product) {
          var items = $scope.my.profile.items;
          for (var i=0; i < items.length; i++) {
            if (resultado.idmotivo == items[i].id)
              return true;
          }

          return false;
        };
        
    
    $scope.generarReporte2 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarListaReconexionesRTR", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
    
     $scope.nuevaventana=function (){
       
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            window.open('http://stackoverflow.com','_blank');
            $http.post("generarListaReconexionesRTR", $scope.info).then(function (response) {
                downloadFile(response.data);
                
            });
        } 
    };
    
    $scope.generarReporte3 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarListaSuspensionesFacturacion", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
    
    $scope.generarReporte4 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarListaReconexionesFacturacion", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
    
    $scope.generarReporte5 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarListaSuspensionesPagoFacturacion", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
    
});

app.controller('ScrollController', ['$scope', '$location', '$anchorScroll',
  function($scope, $location, $anchorScroll) {
    $scope.gotoBottom = function() {
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('bottom');

      // call $anchorScroll()
      $anchorScroll();
    };
  }]);
