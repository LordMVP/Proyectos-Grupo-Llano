/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});


app.controller('veredasControllerAngular', function ($scope, $http) {

    $scope.barrios = [];
    $scope.barriosConsultados = [];
    $scope.barriosSeleccionados = [];

    $scope.municipios = [];
    $scope.municipiosformato2 = [];
    $scope.municipiosConsultados = [];
    $scope.municipiosSeleccionados = [];

    $scope.eliminarBarrioLista = function (lista, iditem, tipo) {
        iditem = parseInt(iditem);
        for (var indice = 0; indice < lista.length; indice++) {
            itemlista = tipo === 'barrio' ? lista[indice].idbarrio : lista[indice].idmunicipio;
            if (parseInt(itemlista) === iditem) {
                lista.splice(indice, 1);
            }
        }
    };


    /**
     * Consulta las municipios por perfil 
     */
    $http.get("../util/getJsonProyectos").then(function (response) {
        $scope.municipios = response.data.proyectos;
    });

    /**
     * Consulta las municipios por perfil 
     */
    $http.get("../util/getJsonProyectos").then(function (response) {
        $scope.municipiosformato2 = response.data.proyectos;
        $scope.cargarListaConOtra($scope.municipiosConsultados, response.data.proyectos);
    });

    /**
     * Consulta los ciclos activos
     */
    $http.get("../util/getJsonListarAnos").then(function (response) {
        $scope.anos = response.data.anos;
    });


    $scope.cargarBarrosMunicipios = function () {
        $http.get("../util/getJsonBarrios/" + $scope.info.municipio).then(function (response) {
            $scope.barrios = response.data.barrios;
            $scope.cargarListaConOtra($scope.barriosConsultados, response.data.barrios);
        });
    };

    /**
     * Consulta los periodos por año
     */
    $scope.cargarPeriodosAno = function () {
        console.log($scope.info.anos);
        $http.post("../util/getConsultarPeriodosPorAno", $scope.info).then(function (response) {
            $scope.periodos = response.data.periodos;
        });
    }


    $scope.consultarBarrioPorNombre = function () {
        $http.get("../util/getJsonBarriosPorNombre/" + $scope.nombreBarrio).then(function (response) {
            $scope.barrios = response.data.barrios;
            $scope.cargarListaConOtra($scope.barriosConsultados, response.data.barrios);
        });
    };
    $scope.selecionarItem = function (e) {
        var _this = $(e.currentTarget);
        _this.toggleClass('list-group-item-info');
    };

    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $scope.bar = "";
            for (var i = 0; i < $scope.barriosSeleccionados.length; i++) {
                var barrio = $scope.barriosSeleccionados[i];
                if (i === $scope.barriosSeleccionados.length - 1) {
                    $scope.bar += (barrio.idbarrio);
                    break;
                }
                $scope.bar += (barrio.idbarrio + ",");
            }
            if ($scope.info === undefined) {
                __dom.lanzarAlerta('El campo años y periodo son obligatorios', 'Alerta');
                return;
            }
            $http.post("generarveredasreporte", {barrios: $scope.bar, anos: $scope.info.anos, idordenperiodo: $scope.info.idordenperiodo}).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
    $scope.generarReporteFormato2 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $scope.bar = "";
            for (var i = 0; i < $scope.municipiosSeleccionados.length; i++) {
                var municipio = $scope.municipiosSeleccionados[i];
                if (i === $scope.municipiosSeleccionados.length - 1) {
                    $scope.bar += (municipio.idmunicipio);
                    break;
                }
                $scope.bar += (municipio.idmunicipio + ",");
            }
            if ($scope.info === undefined) {
                __dom.lanzarAlerta('El campo años y periodo son obligatorios', 'Alerta');
                return;
            }
            $http.post("generarveredasreporteformato2", {municipios: $scope.bar, anos: $scope.info.anos, idordenperiodo: $scope.info.idordenperiodo}).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };
    $scope.cargarListaConOtra = function (listaPrincipal, listaaAgregar) {
        if (!listaPrincipal instanceof  Array || !listaaAgregar instanceof  Array) {
            return;
        }

        for (var i = 0; i < listaaAgregar.length; i++) {
            listaPrincipal.push(listaaAgregar[i]);
        }
    };
    $scope.consultarBarrioPorId = function (idbarrio) {
        idbarrio = parseInt(idbarrio);
        for (var indice = 0; indice < $scope.barriosConsultados.length; indice++) {
            var barrio = $scope.barriosConsultados[indice];
            if (parseInt(barrio.idbarrio) === idbarrio) {
                return barrio;
            }
        }
        return false;
    };
    $scope.consultarMunicipioPorId = function (idmunicipio) {
        idmunicipio = parseInt(idmunicipio);
        for (var indice = 0; indice < $scope.municipiosConsultados.length; indice++) {
            var municipio = $scope.municipiosConsultados[indice];
            if (parseInt(municipio.idmunicipio) === idmunicipio) {
                return municipio;
            }
        }
        return false;
    };
    $scope.consultarSeleccionadosLista = function (ulLista, arrLista, arrNuevaLista, tipo) {
        if (!ulLista) {
            return;
        }
        var seleccionados = ulLista.querySelectorAll('li.list-group-item-info');
        for (var i = 0; i < seleccionados.length; i++) {
            var iditem = seleccionados[i].getAttribute('data-value');
            var infoitem = tipo === 'barrio' ? $scope.consultarBarrioPorId(iditem) : $scope.consultarMunicipioPorId(iditem);
            if (infoitem) {
                $scope.eliminarBarrioLista(arrLista, iditem, tipo);
                arrNuevaLista.push(infoitem);
            }
        }

    };
    $scope.moverItems = function (accion, tipo) {
        var ulLista = null;
        switch (accion) {
            case 'seleccionarTodo':
                if (tipo === 'barrio') {
                    $scope.cargarListaConOtra($scope.barriosSeleccionados, $scope.barrios);
                    $scope.barrios = [];
                    return;
                }

                $scope.cargarListaConOtra($scope.municipiosSeleccionados, $scope.municipiosformato2);
                $scope.municipiosformato2 = [];
                break;
            case 'seleccionar':
                if (tipo === 'barrio') {
                    ulLista = document.getElementById('listBarrios');
                    $scope.consultarSeleccionadosLista(ulLista, $scope.barrios, $scope.barriosSeleccionados, tipo);
                    return;
                }
                ulLista = document.getElementById('listMunicipio');
                $scope.consultarSeleccionadosLista(ulLista, $scope.municipiosformato2, $scope.municipiosSeleccionados, tipo);
                break;
            case 'deseleccionar':
                if (tipo === 'barrio') {
                    ulLista = document.getElementById('listBarriosSeleccionados');
                    $scope.consultarSeleccionadosLista(ulLista, $scope.barriosSeleccionados, $scope.barrios, tipo);
                    return;
                }
                ulLista = document.getElementById('listMunicipioSeleccionados');
                $scope.consultarSeleccionadosLista(ulLista, $scope.municipiosSeleccionados, $scope.municipiosformato2, tipo);
                break;
            case 'deseleccionarTodo':
                if (tipo === 'barrio') {
                    $scope.cargarListaConOtra($scope.barrios, $scope.barriosSeleccionados);
                    $scope.barriosSeleccionados = [];
                    return;
                }
                $scope.cargarListaConOtra($scope.municipiosformato2, $scope.municipiosSeleccionados);
                $scope.municipiosSeleccionados = [];
                break;
        }
    };
});

