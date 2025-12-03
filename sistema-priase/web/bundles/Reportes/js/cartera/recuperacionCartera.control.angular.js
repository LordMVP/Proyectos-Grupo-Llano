
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors', 'ui.bootstrap', 'ngAnimate', 'ngTable']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('CarteraController', function ($scope, $http, NgTableParams) {

    $scope.info = {periodo: null, ciclo: null, municipio: null, municipios: null};
    $scope.ciclosSeleccionados = [];
    $scope.ciclos = [];

    var settings2 = {counts: [], dataset: $scope.ciclosSeleccionados};
    var parameters = {count: '7', paginationMaxBlocks: 13, paginationMinBlocks: 2, sorting: {idciclo: "asc"}};


    $scope.ngTable2 = new NgTableParams(parameters, settings2);


    $http.get("../util/getJsonCiclosActivos").then(function (response) {
        $scope.ciclos = response.data.ciclos;
        $scope.ngTable = new NgTableParams(parameters, {counts: [], dataset: $scope.ciclos});
    });


    $http.get("../util/getJsonProyectos").then(function (response) {
        $scope.municipios = response.data.proyectos;
    });

    function removerFromArray(array, object) {
        var index = array.indexOf(object);
        array.splice(index, 1);
    }

    $scope.agregarCiclo = function (ciclo) {
        $scope.ciclosSeleccionados.push(ciclo);
        removerFromArray($scope.ciclos, ciclo);
        $scope.ngTable2.reload();
        $scope.ngTable.reload();
    };
    $scope.removerCiclo = function (ciclo) {
        removerFromArray($scope.ciclosSeleccionados, ciclo);
        $scope.ciclos.push(ciclo);
        $scope.ngTable2.reload();
        $scope.ngTable.reload();
    };

    $scope.generarReporte = function (type) {
        $scope.$broadcast('show-errors-check-validity');
        var url;
        switch (type) {
            case 1 :
                url = "generarReporteRecuperacionCartera";
                break;
            case 2 :
                url = "generarReporteEfectividadRecuperacionCartera";
                break;
            case 3 :
                url = "generarReporteGestionCobroCartera";
                break;
            default:
                alert("No se puede ejecutar el reporte");
                return;
        }
        
        //$scope.info.municipios = $scope.info.municipio.toString();
        
        //alert($scope.info.municipio.toString());
        
        
        if ($scope.reporte.$valid) {
            $scope.ciclosFinales = [];
            if ($scope.todosCiclos == 1) {
                $scope.info.ciclo = "all";
            } else {
                for (var i = 0; i < $scope.ciclosSeleccionados.length; i++) {
                    $scope.ciclosFinales.push($scope.ciclosSeleccionados[i].idciclo);
                }
                if ($scope.ciclosFinales.length == 0) {
                    alert("No se han seleccionado ciclos");
                    return;
                } else {
                    $scope.info.ciclo = $scope.ciclosFinales;
                }
            }
            
            
            if($scope.info.municipio === null || $scope.info.municipio.toString() === ""){
                $scope.info.municipios = "";
            }else{
                $scope.info.municipios = $scope.info.municipio.toString();
            }

            $http.post(url, $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });
        }
    };

});


