/**
 * Archivo para hacer la gestión de la interfaz en la que se visualizarán las
 * suscripciones que han sido modificadas con novedades
 * @author Appfuture
 * @version 1.0.0
 */
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors', 'ngTable']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('modificacionUsuarioController', function ($scope, $http, $filter, NgTableParams) {
    $scope.idnovedad = 'CD';
    $scope.listaSuscripciones = [];
    // $scope.idmunicipio = 1;
    var parameter = {page: 1, count: 10, filter: {
            idsuscripcion: ''
        }, sorting: {
            idsuscripcion: 'asc'
        }};
    this.columnas = [];

    $http.get("../util/getJsonProyectos").then(function (response) {
        $scope.municipios = response.data.proyectos;
    });
    $scope.limpiarCampos = function () {
        $scope.fechafin = null;
        $scope.fechainicio = null;
        $scope.idmunicipio = null;
        $scope.idsuscripcion = null;
        $scope.codigoanterior = null;
        $scope.listaSuscripciones = [];
    };

    $scope.validarInformacion = function () {
        if ($scope.reporte.$valid) {
            $scope.listaSuscripciones = [];
            switch ($scope.idnovedad) {
                case 'CTU':
                    $scope.columnas = [
                        {"field": "fecha", "title": "FECHA", "show": true, "width": 5},
                        {"field": "idsuscripcion", sortable: "idsuscripcion", "title": "ID SUSCRIPCIÓN", "show": true, "width": 7},
                        {"field": "codigoanterior", sortable: "codigoanterior", "title": "CÓDIGO ANTERIOR", "show": true, "width": 5},
                        {"field": "usuario", sortable: "usuario", "title": "USUARIO", "show": true, "width": 10},
                        {"field": "direccion", "title": "DIRECCIÓN", "show": true, "width": 10},
                        {"field": "barrio", "title": "BARRIO", "show": true, "width": 10},
                        {"field": "tipousoanterior", "title": "TIPO DE USO ANTERIOR", "show": true, "width": 10},
                        {"field": "tipousoactual", "title": "TIPO DE USO ACTUAL", "show": true, "width": 10},
                        {"field": "medidor", "title": "MEDIDOR", "show": true, "width": 10},
                        {"field": "funcionario", "title": "FUNCIONARIO", "show": true, "width": 10}
                    ];
                    break;
                case 'CD':
                    $scope.columnas = [
                        {"field": "fecha", "title": "FECHA", "show": true, "width": 5},
                        {"field": "idsuscripcion", "title": "ID SUSCRIPCIÓN", "show": true, "width": 7},
                        {"field": "codigoanterior", "title": "CÓDIGO ANTERIOR", "show": true, "width": 5},
                        {"field": "usuario", "title": "USUARIO", "show": true, "width": 10},
                        {"field": "direccionanterior", "title": "DIRECCIÓN ANTERIOR", "show": true, "width": 8},
                        {"field": "barrioanterior", "title": "BARRIO ANTERIOR", "show": true, "width": 8},
                        {"field": "direccionactual", "title": "DIRECCIÓN", "show": true, "width": 10},
                        {"field": "barrioactual", "title": "BARRIO", "show": true, "width": 10},
                        {"field": "funcionario", "title": "FUNCIONARIO", "show": true, "width": 10}
                    ];
                    break;
                case 'ST_SR':
                    $scope.columnas = [
                        {"field": "fecha", "title": "FECHA", "show": true, "width": 5},
                        {"field": "idsuscripcion", "title": "ID SUSCRIPCIÓN", "show": true, "width": 7},
                        {"field": "codigoanterior", "title": "CÓDIGO ANTERIOR", "show": true, "width": 5},
                        {"field": "usuario", "title": "USUARIO", "show": true, "width": 10},
                        {"field": "direccion", "title": "DIRECCIÓN", "show": true, "width": 10},
                        {"field": "barrio", "title": "BARRIO", "show": true, "width": 10},
                        {"field": "tiposuspencion", sortable: "tiposuspencion", "title": "TIPO DE SUSPENSIÓN", "show": true, "width": 10},
                        {"field": "medidor", "title": "MEDIDOR", "show": true, "width": 10},
                        {"field": "funcionario", "title": "FUNCIONARIO", "show": true, "width": 10}
                    ];
                    break;
                case 'R':
                    $scope.columnas = [
                        {"field": "fecha", "title": "FECHA", "show": true, "width": 5},
                        {"field": "idsuscripcion", "title": "ID SUSCRIPCIÓN", "show": true, "width": 7},
                        {"field": "codigoanterior", "title": "CÓDIGO ANTERIOR", "show": true, "width": 5},
                        {"field": "usuario", "title": "USUARIO", "show": true, "width": 10},
                        {"field": "direccion", "title": "DIRECCIÓN", "show": true, "width": 10},
                        {"field": "barrio", "title": "BARRIO", "show": true, "width": 10},
                        {"field": "novedad", "title": "NOVEDAD", "show": true, "width": 10},
                        {"field": "medidor", "title": "MEDIDOR", "show": true, "width": 10},
                        {"field": "funcionario", "title": "FUNCIONARIO", "show": true, "width": 10}
                    ];
                    break;
                case 'CE':
                    $scope.columnas = [
                        {"field": "fecha", "title": "FECHA", "show": true, "width": 5},
                        {"field": "idsuscripcion", "title": "ID SUSCRIPCIÓN", "show": true, "width": 7},
                        {"field": "codigoanterior", "title": "CÓDIGO ANTERIOR", "show": true, "width": 5},
                        {"field": "usuario", "title": "USUARIO", "show": true, "width": 10},
                        {"field": "estratoanterior", "title": "ESTRATO ANTERIOR", "show": true, "width": 5},
                        {"field": "estratonuevo", "title": "ESTRATO NUEVO", "show": true, "width": 5},
                        {"field": "funcionario", "title": "FUNCIONARIO", "show": true, "width": 10}
                    ];
                    break;
                case 'CEI':
                    $scope.columnas = [
                        {"field": "fechainicio", "title": "FECHA INICIO", "show": true, "width": 5},
                        {"field": "fechafin", "title": "FECHA FIN", "show": true, "width": 5},
                        {"field": "idsuscripcion", "title": "ID SUSCRIPCIÓN", "show": true, "width": 7},
                        {"field": "codigoanterior", "title": "CÓDIGO ANTERIOR", "show": true, "width": 5},
                        {"field": "usuario", "title": "USUARIO", "show": true, "width": 10},
                        {"field": "estratoanterior", "title": "ESTRATO ANTERIOR", "show": true, "width": 5},
                        {"field": "estratonuevo", "title": "ESTRATO NUEVO", "show": true, "width": 5},
                        {"field": "funcionario", "title": "FUNCIONARIO", "show": true, "width": 10}
                    ];
                    break;
                case 'C':
                    $scope.columnas = [
                        {"field": "fechainicio", "title": "FECHA INICIO", "show": true, "width": 5},
                        {"field": "fechafin", "title": "FECHA FIN", "show": true, "width": 5},
                        {"field": "idsuscripcion", "title": "ID SUSCRIPCIÓN", "show": true, "width": 7},
                        {"field": "codigoanterior", "title": "CÓDIGO ANTERIOR", "show": true, "width": 5},
                        {"field": "usuario", "title": "USUARIO", "show": true, "width": 10},
                        {"field": "direccion", "title": "DIRECCIÓN", "show": true, "width": 10},
                        {"field": "barrio", "title": "BARRIO", "show": true, "width": 10},
                        {"field": "funcionario", "title": "FUNCIONARIO", "show": true, "width": 10}
                    ];
                    break;
                case 'CM':
                    $scope.columnas = [
                        {"field": "fecha", "title": "FECHA INICIO", "show": true, "width": 5},
                        {"field": "idsuscripcion", "title": "ID SUSCRIPCIÓN", "show": true, "width": 7},
                        {"field": "codigoanterior", "title": "CÓDIGO ANTERIOR", "show": true, "width": 5},
                        {"field": "usuario", "title": "USUARIO", "show": true, "width": 10},
                        {"field": "direccion", "title": "DIRECCIÓN", "show": true, "width": 10},
                        {"field": "barrio", "title": "BARRIO", "show": true, "width": 10},
                        {"field": "medidoranterior", "title": "MEDIDOR ANTERIOR", "show": true, "width": 10},
                        {"field": "lecturaanterior", "title": "LECTURA ANTERIOR", "show": true, "width": 10},
                        {"field": "medidoractual", "title": "MEDIDOR ACTUAL", "show": true, "width": 10},
                        {"field": "lecturaactual", "title": "LECTURA", "show": true, "width": 10},
                        {"field": "funcionario", "title": "FUNCIONARIO", "show": true, "width": 10}
                    ];
                    break;
            }
            $scope.obtenerSuscripcion();
        }
    };
    $scope.validarFechaFinal = function () {
        var fechaInicio = new Date($scope.fechainicio ? $scope.fechainicio.replace(/-/g, '/') : new Date());
        var fechaFin = new Date($scope.fechafin ? $scope.fechafin.replace(/-/g, '/') : new Date());
        $('#txtFechaFin').datepicker('option', 'minDate', fechaInicio);

        if (fechaFin < fechaInicio) {
            $scope.fechaFin = '';
        }
    }
    $scope.obtenerSuscripcion = function () {
        console.log($scope.codigoanterior);
        var noEnviar = false;
        var infoEnviar = {
            idnovedad: $scope.idnovedad,
            fechafin: $scope.fechafin,
            fechainicio: $scope.fechainicio,
            idsuscripcion: $scope.idsuscripcion,
            codigoanterior: ($scope.codigoanterior === null || $scope.codigoanterior === undefined) ? '' : $scope.codigoanterior.toString(),
            idmunicipio: $scope.idmunicipio !== '-1' ? $scope.idmunicipio : null
        };
        document.getElementById('divCmbMunicipio').setAttribute('class', 'form-group col-md-4');
        $('.datepicker').parent().removeClass('has-error');
        if ((!$scope.idsuscripcion || $scope.idsuscripcion === '') && (!$scope.codigoanterior || $scope.codigoanterior === '')) {
            if (!$scope.idmunicipio || $scope.idmunicipio === '-1') {
                document.getElementById('divCmbMunicipio').setAttribute('class', 'form-group col-md-4 has-error');
                noEnviar = true;
            }
        }

        if ((!!$scope.fechainicio && $scope.fechainicio !== '') || (!!$scope.fechafin && $scope.fechafin !== '')) {
            if ((!$scope.fechainicio || $scope.fechainicio === '')) {
                noEnviar = true;
                $('#txtFechaInicial').parent().addClass('has-error');
            }
            if (!$scope.fechafin || $scope.fechafin === '') {
                noEnviar = true;
                $('#txtFechaFin').parent().addClass('has-error');
            }
        }
        if (noEnviar) {
            return;
        }

        $http.post("consultar_suscripciones_modificada", infoEnviar).then(function (response) {
            $scope.firstLoad = true;
            $scope.listaSuscripciones = response.data.suscripciones;
            if (response.data.suscripciones.length === 0) {
                __dom.lanzarAlerta("No se encontraron resultado", "Alerta");
                return;
            }
            $scope.tablaSuscripcion.reload();
        });
    };
    $scope.setValueTd = function (fila, columna) {
        if (columna.condicion) {
            switch (columna.field) {
                case 'tiposuspencion':
                    return fila[columna.field] === 'U' ? 'Petición usuario' : 'Remodelación';
                    break;
            }
        }
        return fila[columna.field];
    };
    $scope.tablaSuscripcion = new NgTableParams(parameter, {counts: [],
        getData: function ($defer, params) {
            if ($scope.firstLoad) {
                params.page(1);
            }
            var data = $scope.listaSuscripciones;
            params.total(data.length);
            var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            $scope.firstLoad = false;
        }
    });

});
