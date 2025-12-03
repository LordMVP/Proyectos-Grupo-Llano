
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors', 'angularModalService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.factory('modelo', function () {
    return {
        tiposusoSeleccionados: [],
        temporal: []
    };
});


app.controller('SaldoIndustrialesController', function ($scope, $http, ModalService, modelo) {
    $scope.modelo = modelo;
    $scope.init = function () {
    };

    $scope.idprograma = 153;
    /**
     * Consulta los ciclos activos
     */
    $http.get("../util/getJsonCiclosActivosPorPrograma/" + $scope.idprograma).then(function (response) {
        $scope.ciclos = response.data.ciclos;
    });

    /**
     * Consulta los ciclos activos
     */

    $scope.cargarPeriodo = function () {
        $http.get("../util/getJsonPeriodosCiclo/" + $scope.info.ciclo).then(function (response) {
            $scope.periodos = response.data.periodos;
            console.log($scope.periodos);
        });
    };

    /**
     * Consulta los tipos de uso Industrial y Comercial
     */
    $http.get("../util/getJsonTiposUsoIndustrialComercial").then(function (response) {
        $scope.modelo.tiposuso = response.data.tiposuso;
    });

    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $scope.info.tiposuso = $scope.modelo.tiposusoSeleccionados.toString();
            $http.post("generarReporteSaldoIndustriales", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };


    $scope.abrirDialogoTiposUso = function () {
        ModalService.showModal({
            templateUrl: 'tiposuso.html',
            controller: "ModalController"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                console.log(result);
                if (result) {
                    $scope.modelo.tiposusoSeleccionados = $scope.modelo.temporal;
                    console.log($scope.modelo.tiposusoSeleccionados);
                    return;
                }

            });

        });
    };

    $scope.init();

});

app.controller('ModalController', function ($scope, close, modelo) {
    $scope.modelo = modelo;
    $scope.close = function (result) {
        close(result, 500); // close, but give 500ms for bootstrap to animate
    };

    $scope.onTipoUsoSeleccionado = function (e, tipouso) {
        for (var i = 0; i < $scope.modelo.temporal.length; i++) {
            if ($scope.modelo.temporal[i] === tipouso) {
                $scope.modelo.temporal.splice(i, 1);
                return;
            }
        }
        if (e.currentTarget.checked) {
            $scope.modelo.temporal.push(tipouso);
            return;
        }
    };

    $scope.exists = function (item) {
        //return  _.findIndex($scope.modelo.temporal, function(t){return t.idmunicipio == todo.id;}) > -1;
        return $scope.modelo.temporal.indexOf(item) > -1;
    };
});
