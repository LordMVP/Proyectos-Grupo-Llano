/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('GeneralPostventasController', function ($scope, $http) {
   // $scope.info = {fechaInicial:null,fechaFinal:null,estado:null,municipio:null};
    
    //$http.get("../util/getJsonProyectos").then(function(response){
      //  $scope.municipios = response.data.proyectos;
    //});
    //$http.get("../util/getJsonEstadosVenta").then(function(response){
      //  $scope.estadosVenta = response.data.items;
    //});
    
     $scope.info = {emitido:null,periodo: null, ciclo: null,documento:null,liquidacion:null,fechaConsulta1:null,fechaConsulta2:null};
    $http.get("../util/getJsonCiclosActivos").then(function (response) {
        $scope.ciclos = response.data.ciclos;
    });

    $scope.actualizarPeriodos = function () {
        $http.get("../util/getJsonPeriodosCiclo/" + $scope.info.ciclo).then(function (response) {
            $scope.periodos = response.data.periodos;
        });
    };
    
    $scope.roles = [
    {id: 4, text: 'Todas las Postventas'},
    {id: 104, text: 'Postventa Residencial'},
    {id: 105, text: 'Postventa Comercial'},
    {id: 106, text: 'Postventa Industrial'},
    {id: 107, text: 'PostVenta Obra Civil Residencial'},
    {id: 108, text: 'PostVenta Obra Civil Comercial'}
    
  ];
  
  $scope.user = {
    roles: [2, 4]
  };
    
    $http.get("../util/getJsonDocumentoPostventas").then(function(response){
        $scope.documentos = response.data.items;
    });
    
     $http.get("../util/getJsonLiquidacionPostventas").then(function(response){
        $scope.liquidacion = response.data.items;
    });
    
    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarPostventaPeriodo", $scope.info).then(function (response) {
                //downloadFile(response.data);
                downloadFileDirect(response.data);
            });
        }
    };
          
});
