/**
 * Archivo para hacer la gestión de la interfaz en la que se visualizarán las
 * suscripciones que han sido modificadas con novedades
 * @author Appfuture
 * @version 1.0.0
 */
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('reporteProvisionCreditoController', function ($scope, $http) {
     $scope.info = { anos: ""};


    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        //console.log($scope.buscarNombrePeriodo($scope.idordenperiodo));
        if ($scope.reporte.$valid) {
            var infoEnviar = {
                fecha_ini: $scope.fechaCorteIni,
                fecha_fin: $scope.fechaCorteFin  
            };
            if ($scope.idconvenio !== '' && !!$scope.idconvenio) {
                infoEnviar.idconvenio = $scope.idconvenio;
            }
            console.log(infoEnviar) ;
            $http.post("generar_provision_creditos", infoEnviar).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
});
