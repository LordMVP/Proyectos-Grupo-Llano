/**
 * Archivo para hacer la gestión de la interfaz en la que se visualizarán las
 * suscripciones que han sido modificadas con novedades
 * @author Appfuture
 * @version 1.0.0
 */
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors', 'ngTable']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('pagosCreditoControllerAngular', function ($scope, $http, $filter, NgTableParams) {
    $scope.listaCreditos = [];
    $scope.creditoseleccionada = {
        id: 1
    };
    var parameter = {page: 1, count: 5, filter: {
            idcredito: ''
        }, sorting: {
            idcredito: 'asc'
        }};
    this.columnas = [];
    $scope.permitirGenerar = true;


    $scope.validarInformacion = function () {
        if( $scope.documento  || ($scope.fechaInicio && $scope.fechaFin ))
        {
            $scope.listaCreditos = [];
            $scope.columnas = [
                {"field": "idfinanciacion", sortable:"idfinanciacion", "title": "ID FINANCIACION", "show": true, "width": 10},
                {"field": "idcredito", sortable: "idcredito", "title": "NO. RADICADO", "show": true, "width": 5},
                {"field": "nombre", sortable: "nombre", "title": "NOMBRE", "show": true, "width": 7},
                {"field": "documento", sortable: "documento", "title": "DOCUMENTO", "show": true, "width": 5},
                {"field": "monto", "title": "MONTO", "show": true, "width": 10},
                {"field": "plazo", "title": "PLAZO", "show": true, "width": 10},
                {"field": "fechadesembolso", "title": "FECHA DE DESEMBOLSO", "show": true, "width": 10},
                {"field": "suscripcion", "title": "SUSCRIPCION", "show": true, "width": 10}
            ];
            $scope.obtenerCreditos();
        }
        else
        {
            $scope.$broadcast('show-errors-check-validity');
            __dom.lanzarAlerta("Debe Seleccionar las Fechas o Ingresar un Documento " ," ");
        }
    };

    $scope.obtenerCreditos = function () {
        var infoEnviar = {
            documento: ($scope.documento ? $scope.documento : '') ,
            fechainicio: ($scope.fechaInicio ? $scope.fechaInicio : '') ,
            fechafin:($scope.fechaFin ? $scope.fechaFin : '') 
        };
        $http.post("consultarCreditos", infoEnviar).then(function (response) {
            $scope.firstLoad = true;
            $scope.listaCreditos = response.data.creditos;
            if (response.data.creditos.length === 0) {
                __dom.lanzarAlerta("No se encontraron resultado", "Alerta");
                $scope.permitirGenerar = true;
                return;
            }
            $scope.permitirGenerar = false;
            $scope.tablaCreditos.reload();
        });
    };
    $scope.tablaCreditos = new NgTableParams(parameter, {counts: [],
        getData: function ($defer, params) {
            if ($scope.firstLoad) {
                params.page(1);
            }
            var data = $scope.listaCreditos;
            params.total(data.length);
            var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            $scope.firstLoad = false;
        }
    });
    $scope.generarReporte = function () {
        if( $scope.documento  || ($scope.fechaInicio && $scope.fechaFin ))
        {
            var info = {
                idfinanciacion: $scope.creditoseleccionada.id
            };
            $http.post("generarPagosCredito", info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
        else{
            $scope.$broadcast('show-errors-check-validity');
        }
    };
    $scope.generarPaz_Salvo = function () {
        if( $scope.documento )
        {
            var info = {
                docTercero: $scope.documento
            };
            $http.post("generarPaz_Salvo_Tercero", info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
        else{
            $scope.$broadcast('show-errors-check-validity');
            __dom.lanzarAlerta("Debe Ingresar el Numero de Documento del Tercero" ,"Error Reporte de Paz y Salvo ");
        }
    };
});