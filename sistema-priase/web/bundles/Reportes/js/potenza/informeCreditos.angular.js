/**
 * Archivo para hacer la gestión de la interfaz en la que se visualizarán las
 * suscripciones que han sido modificadas con novedades
 * @author Appfuture
 * @version 1.0.0
 */
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('informeCreditoController', function ($scope, $http) {
     $scope.info = { anos: ""};

    /**
     * Consulta los periodos por año
     */
    $scope.cargarPeriodosAno = function () {
        $scope.info.anos = $scope.anosselecionado ;
        //console.log($scope.info.anos);
        $http.post("../util/getConsultarPeriodosPorAno", $scope.info).then(function (response) {
            $scope.periodos = response.data.periodos;
        });
    };


    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        //console.log($scope.buscarNombrePeriodo($scope.idordenperiodo));
        if ($scope.reporte.$valid) {
            var infoEnviar = {
                fecha: $scope.fechaCorte                
            };
            if ($scope.idconvenio !== '' && !!$scope.idconvenio) {
                infoEnviar.idconvenio = $scope.idconvenio;
            }
            console.log(infoEnviar) ;
            $http.post("generar_informe_creditos", infoEnviar).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };

    $scope.buscarNombrePeriodo = function (idperiodo) {
        for (i = 0; i < $scope.periodos.length; i++) {
            var perido = $scope.periodos[i];
            //console.log(idperiodo);
            if (perido.idorden == idperiodo) {
                return perido.nombre;
            }
        }
    };
});
