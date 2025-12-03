
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('carteraController', function ($scope, $http) {

    var date = moment(); //Get the current date    
    $scope.info = {fechaCorte: null, proyecto: '-1', tipoUso: '-1', ciclo: '-1', tipoCarta: '1', ruta: '-1',morosidadMinima:0,morosidadMaxima:9999999,valorMinimo:0,valorMaximo:9999999};


    $http.get("../util/getJsonTiposUso").then(function (response) {
        $scope.tiposUso = response.data.tiposUso;
    });

    $scope.cambiarCiclo = function () {
        $http.get("../util/getJsonRutasCiclo/"+$scope.info.ciclo).then(function (response) {
            $scope.rutas = response.data.rutas;
        });
    };


    /* $http.get("../util/getJsonNovedadesSuspension").then(function (response) {
     $scope.novedadesSuspension = response.data.datos;
     });      */


    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            var report = 'generarReporteCartasGestionCartera';
            $http.post(report, $scope.info).then(function (response) {
                downloadFileDirect(response.data);//downloadFile(response.data);
            });
        }
    };
    
    
    
    $scope.descargarFormato = function (idempresa) {
        var pathBase = 'http://prisma.grupodellano.com/achagua/sistema/app/Resources/formatos/cartera/';
        var nombreArchivo;
        
        
        if($scope.info.tipoCarta == 1 && idempresa == 322){
           nombreArchivo = 'CartaFinalMenor4.docx';
       }else if($scope.info.tipoCarta == 2 && idempresa == 322){
           nombreArchivo = 'CartaVillavoMayorIgual4.docx';
       }else if($scope.info.tipoCarta == 3 && idempresa == 322){
           nombreArchivo = 'CartaMpiosMayorIgual4.docx';
       }else if($scope.info.tipoCarta == 4 && idempresa == 322){
           nombreArchivo = 'CartaCentralesRiesgoVillavo.docx';
       }else if($scope.info.tipoCarta == 5 && idempresa == 322){
           nombreArchivo = 'CartaCentralesRiesgoMpios.docx';
       }else if($scope.info.tipoCarta == 6 && idempresa == 322){
           nombreArchivo = 'ComunicadoCobro.docx';
       }else if($scope.info.tipoCarta == 1 && idempresa == 319){
           nombreArchivo = 'CusCartaMenor4.docx';
       }else if($scope.info.tipoCarta == 2 && idempresa == 319){
           nombreArchivo = 'CusCartaMayorIgual4.docx';
       }else if($scope.info.tipoCarta == 4 && idempresa == 319){
           nombreArchivo = 'CusCartaCentralesRiesgo.docx';
       }
        
        var pom = document.createElement('a'); 
        pom.setAttribute('href', pathBase+nombreArchivo); 
        pom.setAttribute('download', nombreArchivo); 
        pom.click();
    };
     
});