/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors', 'ui.bootstrap', 'ngAnimate', 'ngTable']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller("MovimientoContableController", function ($scope, $http, NgTableParams) {
    
    
    $scope.info = {operacion: null, ciclo: null, municipio: null, fechaConsulta1:null, 
            fechaConsulta2:null, movi:null, group:false, documento:null, tipoDocumento:null, concepto:null };
        
    $scope.emvSeleccionadas = [];
    $scope.emv = [];
    
    var settings2 = {counts: [], dataset: $scope.emvSeleccionadas};
    var parameters = {count: '7', paginationMaxBlocks: 13, paginationMinBlocks: 2, sorting: {idemv: "asc"}};
    
    $scope.ngTable2 = new NgTableParams(parameters, settings2);
    
    $scope.buscarEmv = function () {
        $scope.nofound = false;
        $http.post("buscarEmvExpmovimient", $scope.info).then(function (response) {
            $scope.emv = response.data.emv;
            $scope.nofound = $scope.emv.length === 0;
            $scope.emvSeleccionadas.length = 0;
            $scope.ngTable2.reload();
            $scope.ngTable = new NgTableParams(parameters, {counts: [], dataset: $scope.emv});
        });

    };
    
    function removerFromArray(array, object) {
        var index = array.indexOf(object);
        array.splice(index, 1);
    }
  
    $scope.agregarRuta = function (movi) {
        $scope.emvSeleccionadas.push(movi);
        removerFromArray($scope.emv, movi);
        $scope.ngTable2.reload();
        $scope.ngTable.reload();
    };
    
    $scope.removerRuta = function (movi) {
        removerFromArray($scope.emvSeleccionadas, movi);
        $scope.emv.push(movi);
        $scope.ngTable2.reload();
        $scope.ngTable.reload();
    };
    
    $http.get("../util/getJsonTipoOperacion").then(function (response) {
        $scope.operaciones = response.data.operaciones;
    });
    
    $http.get("../util/getJsonCiclosActivos").then(function (response) {
        $scope.ciclos = response.data.ciclos;
    });
    
    $http.get("../util/getJsonProyectosEmpresa").then(function (response) {
        $scope.proyectos = response.data.proyectos;
    });
    
    $http.get("../util/getJsonTipoMovimiento").then(function (response) {
        $scope.tipo = response.data.items;
    });
    
    $http.get("../util/getJsonProyectos").then(function (response) {
        $scope.municipios = response.data.proyectos;
    });
    
    $http.get("../util/buscarMviGeneral").then(function (response) {
        $scope.mvi = response.data.mvi;
    });
    
    $http.get("../util/buscarMviGeneral").then(function (response) {
        $scope.mvi2 = response.data.mvi;
    });
    
    $http.get("../util/getDocumentos").then(function (response) {
        $scope.documentos = response.data.documentos;
    });
    
    
    $http.get("../util/getTiposDocumento").then(function (response) {
        $scope.tiposDocumento = response.data.tiposDocumento;
    });
    
    
    $http.get("../util/getConceptos").then(function (response) {
        $scope.conceptos = response.data.conceptos;
    });
    
    
    
    
    
    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarReporteMovimientoContable", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
    
    $scope.generarReporte2 = function ($agrupado) {
        $scope.$broadcast('show-errors-check-validity');
        var url="generarMovimientoDetallado";  
        $scope.info.group = $agrupado;
        
        
        if($scope.info.documento !== null){
            $scope.info.documento = $scope.info.documento.toString();
        }else{
            $scope.info.documento = "";
        }
        
        if($scope.info.tipoDocumento !== null){
            $scope.info.tipoDocumento = $scope.info.tipoDocumento.toString()+"";
        }else{
            $scope.info.tipoDocumento = "";
        }
        
        if($scope.info.concepto !== null){
            $scope.info.concepto = $scope.info.concepto.toString();
        }else{
            $scope.info.concepto = "";
        }
        
        if ($scope.reporte.$valid) {
            $scope.emvFinales = [];
             if ($scope.todasEmv==1) {
                $scope.info.movi = "all";
            } else {
                for (var i = 0; i < $scope.emvSeleccionadas.length; i++) {
                    $scope.emvFinales.push($scope.emvSeleccionadas[i].idemv);
                }
                if ($scope.emvFinales.length == 0) {
                    alert("No se han seleccionado movimientos");
                    return;
                } else {
                    $scope.info.movi = $scope.emvFinales;
                }
            }
            $http.post(url, $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
});
