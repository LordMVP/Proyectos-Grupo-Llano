/**
 * Archivo para hacer la gestión al momento de generar el reporte del resumen 
 * de los creditos que se han desembolsado
 * @author Appfuture
 * @version 1.0.0
 */
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']);

app.controller('creditosDesembolsadosController', function ($http, $scope) {
    $scope.infoEnviar = {
        fechafin: $scope.fechafin,
        fechainicio: $scope.fechainicio,
        banco:  $scope.idbanco        
    };
    __dom.configurarTextoNumerico('txtPlazo,#txtMontoInicial, #txtMontoFinal, #txtDocumento');
     $scope.validarRangoMonto = function () {
        var rangoInicio = document.getElementById('txtMontoInicial');
        var rangoFin = document.getElementById('txtMontoFinal');

        if ((!!$scope.rangoinicio && $scope.rangoinicio !== '') || (!!$scope.rangofin && $scope.rangofin !== '')) {
            rangoInicio.setAttribute('required', true);
            rangoFin.setAttribute('required', true);
            return;
        }
        rangoInicio.removeAttribute('required');
        rangoFin.removeAttribute('required');
    };
    $scope.validarFechaFinal = function () {
        var fechaInicio = new Date($scope.fechainicio ? $scope.fechainicio.replace(/-/g, '/') : new Date());
        var fechaFin = new Date($scope.fechafin ? $scope.fechafin.replace(/-/g, '/') : new Date());
        $('#fechaFin').datepicker('option', 'minDate', fechaInicio);

        if (fechaFin < fechaInicio) {
            $scope.fechaFin = '';
        }
    };
    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        $scope.armarObjetoEnviar();
        if ($scope.reporte.$valid && !$scope.rangofinincorrecto && !$scope.fechafinincorrecto && !$scope.rangoincorrecto) {
            $http.post("reporte_creditos_desmbolsados", $scope.infoEnviar).then(function (response) {
                downloadFileDirectBySize(response.data,1);
            });
        }
    };
    
    $scope.generarReportePlano = function () {
        $scope.$broadcast('show-errors-check-validity');
        $scope.armarObjetoEnviar();
        if ($scope.reporte.$valid && !$scope.rangofinincorrecto && !$scope.fechafinincorrecto && !$scope.rangoincorrecto) {
            $http.post("plano_creditos_desmbolsados", $scope.infoEnviar).then(function (response) {
                downloadFileDirectBySize(response.data,1);
            });
        }
    };
    
    $scope.armarObjetoEnviar = function(){
        $scope.infoEnviar = {
            fechafin: $scope.fechafin,
            fechainicio: $scope.fechainicio,
            banco:  $scope.idbanco   
        };
        $scope.rangoincorrecto = false;
        $scope.rangofinincorrecto = false;
        $scope.rangoinicioincorrecto = false;
        if($scope.idconvenio !== '-1' && $scope.idconvenio){
            $scope.infoEnviar.idconvenio = $scope.idconvenio;
        }
        if($scope.documentocliente !== '' && $scope.documentocliente){
            $scope.infoEnviar.documentocliente = $scope.documentocliente;
        }
        if($scope.plazo !== '' && $scope.plazo){
            $scope.infoEnviar.plazo = $scope.plazo;
        }
        if ((!!$scope.rangoinicio && $scope.rangoinicio !== '') || (!!$scope.rangofin && $scope.rangofin !== '')) {
            if($scope.rangoinicio === null || $scope.rangoinicio === ''){ 
                $scope.rangoinicioincorrecto = true;
                document.getElementById('txtMontoInicial').parentNode.setAttribute('class', 'form-group col-md-4 has-error');
            }
            if($scope.rangofin === null || $scope.rangofin === ''){
                $scope.rangofinincorrecto = true;
                document.getElementById('txtMontoFinal').parentNode.setAttribute('class', 'form-group col-md-4 has-error');
            }
            if($scope.rangofin < $scope.rangoinicio){
                $scope.rangoincorrecto = true;
                document.getElementById('txtMontoFinal').parentNode.setAttribute('class', 'form-group col-md-4 has-error');
            }
            if(!$scope.rangofinincorrecto && !$scope.rangoinicioincorrecto && !$scope.rangoincorrecto){
                $scope.infoEnviar.rangofin = $scope.rangofin;
                $scope.infoEnviar.rangoinicio = $scope.rangoinicio;
            }
        }
    };
});