/**
 * @fileOverview Archivo de control para devolucion recaudo
 * @author AppFuture
 * @requires devolucion.modelo.js
 * @version 1.0.0
 */

 var app = angular.module('myApp', ['httpModule', 'ngTable', 'ui.bootstrap', 'ui.bootstrap.showErrors', 'angularModalService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.factory('modelo', function () {
    return {
        municipiosSeleccionados: [],
        temporal: []
    };
});

app.controller('controlInstalaciones', function ($scope, $http, $q, NgTableParams,ModalService,modelo) {
    $scope.total=-1;
    $scope.info = {fechaInicial:null,fechaFinal:null,municipio:null, constructora_id: null, contrato: null,proyecto_id:null,usuario:null};
    $scope.modelo = modelo


    $http.get("../util/getJsonProyectos").then(function(response){
        $scope.municipios = response.data.proyectos;
    });

    $scope.buscarAu = function (term) {
        return $http({
            url: "../util/findJsonConstructoraByName",
            method: 'post',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $.param({nombre: term})
        }).then(function (response) {
            return response.data.resultados;
        });
    };

    $scope.buscarAu2 = function (term) {
        return $http({
            url: "../util/getJsonBarriosPorNombre/"+term,
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        }).then(function (response) {
            return response.data.barrios;
        });
    };

    $scope.abrirDialogoBarrios = function () {

        
        var municipiosSeleccionados = $scope.modelo.municipiosSeleccionados;
        ModalService.showModal({
            templateUrl: 'barrios.html',
            controller: "ModalController"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                console.log(result);
                if (result) {
                    $scope.info.proyecto_id= $scope.modelo.temporal.toString();
                    console.log($scope.modelo.temporal);
                    return;
                }

            });

        });
    };


    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("controlInstalacionDetallado", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };

    $scope.generarReporte2 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("controlInstalacionGeneral", $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };

});


app.controller('ModalController', function ($scope,$http, close, modelo) {
    $scope.modelo = modelo;
    $scope.buscar = null;

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

    $scope.buscarbarrio = function(){
        console.log($scope.buscar)

        $http({
            url: "../util/getJsonBarriosPorNombre/"+$scope.buscar,
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        }).then(function (response) {
            console.log(response.data.barrios);
            $scope.modelo.barrios = response.data.barrios;
        });


    }

    

    $scope.exists = function (item) {
        //return  _.findIndex($scope.modelo.temporal, function(t){return t.idmunicipio == todo.id;}) > -1;
        return $scope.modelo.temporal.indexOf(item) > -1;
    };
});