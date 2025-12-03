
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors', 'angularModalService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.factory('modelo', function () {
    return {
        ciclosSeleccionados: [],
        temporal: []
    };
});


app.controller('InteresesController', function ($scope, $http, ModalService, modelo) {
    $scope.modelo = modelo;
    $scope.init = function () {
    };


    /**
     * Consulta los ciclos activos
     */
    $http.get("../util/getJsonListarAnos").then(function (response) {
        $scope.anos = response.data.anos;
    });

    /**
     * Periodos de año
     */
    $http.get("../util/getJsonPeriodosAno", $scope.info).then(function (response) {
        $scope.periodos = response.data.periodos;
    });

    $scope.idprograma = 156;
    /**
     * Consulta los ciclos activos
     */
    $http.get("../util/getJsonCiclosActivosPorPrograma/" + $scope.idprograma).then(function (response) {
        $scope.modelo.ciclos = response.data.ciclos;
    });

    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $scope.info.ciclos = $scope.modelo.ciclosSeleccionados.toString();
            $http.post("generarReporteIntereses", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };


    $scope.abrirDialogoCiclos = function () {
        ModalService.showModal({
            templateUrl: 'ciclos.html',
            controller: "ModalController"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                console.log(result);
                if (result) {
                    $scope.modelo.ciclosSeleccionados = $scope.modelo.temporal;
                    console.log($scope.modelo.ciclosSeleccionados);
                    return;
                }

                if (!result) {
                    $scope.modelo.ciclosSeleccionados = [];
                    $scope.modelo.temporal = [];
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

    $scope.onCicloSeleccionado = function (e, ciclo) {
        for (var i = 0; i < $scope.modelo.temporal.length; i++) {
            if ($scope.modelo.temporal[i] === ciclo) {
                $scope.modelo.temporal.splice(i, 1);
                return;
            }
        }
        if (e.currentTarget.checked) {
            $scope.modelo.temporal.push(ciclo);
            return;
        }
    };

    $scope.exists = function (item) {
        //return  _.findIndex($scope.modelo.temporal, function(t){return t.idmunicipio == todo.id;}) > -1;
        return $scope.modelo.temporal.indexOf(item) > -1;
    };
});
