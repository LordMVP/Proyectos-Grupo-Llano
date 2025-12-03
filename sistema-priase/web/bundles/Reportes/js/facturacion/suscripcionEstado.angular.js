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
        temporal: []
    };
});


app.controller('SuscripcionEstadoController', function ($scope, $http, ModalService, modelo) {
    $scope.modelo = modelo;

    $scope.init = function () {

    };
    $scope.info = {
        municipios: ""
    };

    $http.get("../util/getJsonProyectos").then(function (response) {
        $scope.modelo.municipios = response.data.proyectos;
    });

    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            municipios = $scope.modelo.municipiosSeleccionados.length === 0 ? '' : $scope.modelo.municipiosSeleccionados.toString();
            $scope.info.municipios = municipios;
            $http.post("generarReporteSuscipcionEstado", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };


    $scope.abrirDialogoMunicipios = function () {
        var municipiosSeleccionados = $scope.modelo.municipiosSeleccionados;
        ModalService.showModal({
            templateUrl: 'municipios.html',
            controller: "ModalController"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                console.log(result);
                if (result) {
                    $scope.modelo.municipiosSeleccionados = $scope.modelo.temporal;
                    console.log($scope.modelo.municipiosSeleccionados);
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
