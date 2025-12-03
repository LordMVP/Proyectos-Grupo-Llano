/**
 * Archivo para hacer la gestión al momento de generar el reporte del resumen 
 * de los creditos que se han desembolsado
 * @author Appfuture
 * @version 1.0.0
 */
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('CreditosController', function ($http, $scope) {
    $scope.infoEnviar = {
        idciclo: $scope.idciclo
    };

    $http.get("../util/getJsonCiclosActivos").then(function (response) {
        $scope.ciclos = response.data.ciclos;
    });
    
    $http.get("getEstadosCredito").then(function (response) {
        $scope.estados = response.data.estados;
    });
    
    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            var parametros = 0 ;           
            if (!!$scope.idconvenio && $scope.idconvenio !== '-1') {
                $scope.infoEnviar.idconvenio = $scope.idconvenio;
                parametros ++ ;
            }            
            if (!!$scope.idciclo && $scope.idciclo !== '-1') {
                $scope.infoEnviar.idciclo = $scope.idciclo;
                parametros ++ ;
            }   
            if (!!$scope.doctercero ) {
                $scope.infoEnviar.nitTercero = $scope.doctercero;
                parametros ++ ;
            }
            if (!!$scope.fechaInicioSol ) {
                $scope.infoEnviar.fechaInicioSol = $scope.fechaInicioSol;
                parametros ++ ;
            }            
            if (!!$scope.fechaFinSol ) {
                $scope.infoEnviar.fechaFinSol = $scope.fechaFinSol;
                parametros ++ ;
            }            
            if (!!$scope.montodesde ) {
                $scope.infoEnviar.montodesde = $scope.montodesde;
                parametros ++ ;
            }            
            if (!!$scope.montohasta ) {
                $scope.infoEnviar.montohasta = $scope.montohasta;
                parametros ++ ;
            }            
            if (!!$scope.morosidaddesde ) {
                $scope.infoEnviar.morosidaddesde = $scope.morosidaddesde;
                parametros ++ ;
            }            
            if (!!$scope.morosidadhasta ) {
                $scope.infoEnviar.morosidadhasta = $scope.morosidadhasta;
                parametros ++ ;
            }  
            if (!!$scope.idestado && $scope.idestado !== '-1') {
                $scope.infoEnviar.idestado = $scope.idestado;
                parametros ++ ;
            } 
            if (parametros > 0 )
            {
                $http.post("generar_reporte_creditos", $scope.infoEnviar).then(function (response) {
                downloadFileDirect(response.data);
                });
            }
            else
            {
                __dom.lanzarAlerta("Debe Seleccionar o Ingresar minimo un parametro " ,"Error de Parametros ");
                return;                
            }   
        }
    };
   
});