
var app = angular.module('myApp', ['httpModule', 'ngTable']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.filter('getByProperty', function() {
    return function(propertyName, propertyValue, collection) {
        var i=0, len=collection.length;
        for (; i<len; i++) {
            if (collection[i][propertyName] == +propertyValue) {
                return collection[i];
            }
        }
        return null;
    }
});
app.controller('CarteraController', function ($scope, $http,NgTableParams,$filter) {

   /* $scope.localLang = {
        selectAll: "Seleccionar todo",
        selectNone: "Selecionar uno",
        reset: "Limpiar",
        search: "Buscar...",
        nothingSelected: "No ha seleccionado algun concepto"
    };
    $scope.info = {periodo: null, ciclo: null};
    $scope.conceptosPlanos = {};
    $scope.conceptosInteres = {};
    $http.get("../util/getJsonCiclosActivos").then(function (response) {
        $scope.ciclos = response.data.ciclos;
    });

    $http.get("../util/getJsonLiquidaciones").then(function (response) {
        $scope.liquidaciones = response.data.items;
    });



    $scope.actualizarConceptos = function () {
        $http.get("../util/getJsonConceptosLiquidacion/" + $scope.info.liquidacion).then(function (response) {
            $scope.conceptosPlanos = response.data.conceptosPlanos;
            $scope.conceptosInteres = response.data.conceptosInteres;
        });
    };*/
    $scope.info = {};
    $scope.conceptos=[];
     $http.post("../conceptosTable/getColumns").then(function (response) {
        $scope.columnas = response.data.columnas;
        $scope.columnas.push({title:"Opcion",show:true,option:true});
    });

    function getData(params) {
        $scope.selected =null;
        return $http.post("../conceptosTable/getInfo", {count: params.count(), page: params.page(), extra: $scope.infoTable}).then(function (response) {
            params.total(response.data.total);
            $scope.total=response.data.total;
            return response.data.data;
        });
    };

    $scope.reload = function () {
        $scope.ngTable.reload();
    };

    var parameters = {count: '5',paginationMaxBlocks: 13,paginationMinBlocks: 2,};
    var settings = {counts: [], getData: getData};
    $scope.ngTable = new NgTableParams(parameters, settings);

    $scope.addConcepto= function(concepto){
        var c = {codigo:concepto.concepto_codigo,nombre:concepto.concepto_nombre};
        var found = $filter('getByProperty')('codigo', c.codigo, $scope.conceptos);
        if(!found) {$scope.conceptos.push(c);};
        
    };
    $scope.removerConcepto=function(concepto){
        var index = $scope.conceptos.indexOf(concepto);
        $scope.conceptos.splice(index, 1); 
    }
    $scope.seleccionarFila = function (item) {
        $scope.selected = item;
        var id = item.numero_financiacion;
        $("#tr_" + id).addClass("row-selected").siblings().removeClass("row-selected");
        $("#ck_" + id).attr("checked", "true");
    };

    $scope.generarReporte = function (type) {
        $scope.$broadcast('show-errors-check-validity');
        var url ="generarReporteEdadesCartera";      
        
        if ($scope.reporte.$valid) {
            $scope.info.conceptos = $scope.conceptos;
            $http.post(url, $scope.info).then(function (response) {
                downloadFile(response.data);
                $scope.info={};
            });
        }
    };

});


