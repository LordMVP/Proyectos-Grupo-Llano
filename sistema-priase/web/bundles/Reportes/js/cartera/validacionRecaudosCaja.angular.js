/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors', 'angularModalService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.factory('modelo', function () {
    return {
        municipiosSeleccionados: [],
        temporal: [],
        mediosPagosSeleccionados: [],
        temporalMediosPagos: []
    };
});


app.controller('ValidacionRecaudosCajaController', function ($scope, $http, ModalService, modelo) {
    $scope.modelo = modelo;
    $scope.init = function () {
    };

    $scope.info = {cajero: null};
    $scope.limpiar = function () {
        $scope.info = {cajero: null, dia: null,
            municipios: [],
            mediospagos: []
        };
    };
     
    /**
     * Consulta los cajeros activos
     */
    $http.get("../util/getJsonCajerosActivos").then(function (response) {
        $scope.cajeros = response.data.items;
    });

    /**
     * Consulta las sucursales
     */
    $http.get("../util/getJsonMediosPagos").then(function (response) {
        $scope.modelo.medospagos = response.data.medospagos;
    });

    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $scope.info.municipios = $scope.modelo.municipiosSeleccionados.toString();
            $scope.info.mediospagos = $scope.modelo.mediosPagosSeleccionados.toString();
            $http.post("generarReporteValidacionRecaudosCaja", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
                $scope.limpiar();
            });
        }
    };


    $scope.abrirDialogoMunicipios = function () {
        ModalService.showModal({
            templateUrl: 'municipios.html',
            controller: "ModalController"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                if (result) {
                    $scope.modelo.municipiosSeleccionados = $scope.modelo.temporal;
                    return;
                }
                if (!result) {
                    $scope.modelo.municipiosSeleccionados = [];
                    $scope.modelo.temporal = [];
                    return;
                }

            });

        });
    };
    $scope.abrirDialogoMediosPagos = function () {
        ModalService.showModal({
            templateUrl: 'mediosPagos.html',
            controller: "MediosPagosController"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                if (result) {
                    $scope.modelo.mediosPagosSeleccionados = $scope.modelo.temporalMediosPagos;
                    return;
                }
                if (!result) {
                    $scope.modelo.mediosPagosSeleccionados = [];
                    $scope.modelo.temporalMediosPagos = [];
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

    $scope.onMunicipioSeleccionado = function (e, idmunicipio) {
        for (var i = 0; i < $scope.modelo.temporal.length; i++) {
            if ($scope.modelo.temporal[i] === idmunicipio) {
                $scope.modelo.temporal.splice(i, 1);
                return;
            }
        }
        if (e.currentTarget.checked) {
            $scope.modelo.temporal.push(idmunicipio);
            return;
        }
    };

    $scope.exists = function (item) {
        //return  _.findIndex($scope.modelo.temporal, function(t){return t.idmunicipio == todo.id;}) > -1;
        return $scope.modelo.temporal.indexOf(item) > -1;
    };
});

app.controller('MediosPagosController', function ($scope, close, modelo) {
    $scope.modelo = modelo;
    $scope.close = function (result) {
        close(result, 500); // close, but give 500ms for bootstrap to animate
    };

    $scope.onMediosPagosSeleccionado = function (e, id) {
        for (var i = 0; i < $scope.modelo.temporalMediosPagos.length; i++) {
            if ($scope.modelo.temporalMediosPagos[i] === id) {
                $scope.modelo.temporalMediosPagos.splice(i, 1);
                return;
            }
        }
        if (e.currentTarget.checked) {
            $scope.modelo.temporalMediosPagos.push(id);
            return;
        }
    };

    $scope.exists = function (item) {
        //return  _.findIndex($scope.modelo.temporal, function(t){return t.idmunicipio == todo.id;}) > -1;
        return $scope.modelo.temporalMediosPagos.indexOf(item) > -1;
    };
});
