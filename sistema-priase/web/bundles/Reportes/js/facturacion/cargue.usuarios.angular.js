/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors', 'ngTable']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('CargueUsuariosController', function ($scope, $http, NgTableParams) {
   
   $scope.info = {idciclo: null};
    //$scope.ciclos = [];
    $scope.usuarios = [];
    
    var parameters = {count: '5',paginationMaxBlocks: 13,paginationMinBlocks: 2};
    var parameters2 = {count: '10', paginationMaxBlocks: 13, paginationMinBlocks: 2};
    
    
    
    $scope.buscarUsuariosConsolidado = function () {
        $scope.nofound = false;
        
        $http.post("buscarUsuariosCicloAgrupados", $scope.info).then(function (response) {
            $scope.agrupados = response.data.ciclos;
            $scope.nofound = $scope.ciclos.length === 0;
            $scope.ngTable = new NgTableParams(parameters, {counts: [], dataset: $scope.agrupados});
        });   
        
        $http.post("buscarUsuariospendientes", $scope.info).then(function (response) {
        $scope.todos = response.data.usuarios;
        $scope.nofound = $scope.usuarios.length === 0;
        $scope.ngTable2 = new NgTableParams(parameters2, {counts: [], dataset: $scope.todos});
    });
    
     $http.post("buscarUsuariosCicloAgrupadosPendientes", $scope.info).then(function (response) {
        $scope.estados = response.data.pendientes;
        $scope.nofound = $scope.usuarios.length === 0;
        $scope.ngTable3 = new NgTableParams(parameters2, {counts: [], dataset: $scope.estados});
    });

    };

    $http.get("../util/getJsonCiclosGeneralEmpresa/"+166).then(function (response) {
        $scope.ciclos = response.data.ciclos;
    });
   
    
});
