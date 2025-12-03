
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap','ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('facturacionController', function ($scope, $http) {

    var date = moment(); //Get the current date    
    $scope.info = {fechaConsulta: null};
    $scope.info.fechaConsulta = date.format("YYYY-MM-DD"); 
    $scope.info.ure = 0;
    $scope.resumen = {};
    $scope.detalle = {};
    
    $scope.viewby1 = 5;
    $scope.totalItems1 = $scope.resumen.length;
    $scope.currentPage1 = 1;
    $scope.itemsPerPage1 = $scope.viewby1;
    $scope.maxSize1 = 5; //Number of pager buttons to show
    
    $scope.viewby2 = 10;
    $scope.totalItems2 = $scope.detalle.length;
    $scope.currentPage2 = 1;
    $scope.itemsPerPage2 = $scope.viewby2;
    $scope.maxSize2 = 5; //Number of pager buttons to show

    $scope.setPage = function (pageNo) {
        $scope.currentPage1 = pageNo;
    };

    $scope.pageChanged = function() {
        //console.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.setItemsPerPage = function(num) {
        $scope.itemsPerPage1 = num;
        $scope.currentPage1 = 1; //reset to first page
    }
    
    $scope.setPage2 = function (pageNo) {
        $scope.currentPage2 = pageNo;
    };

    $scope.pageChanged2 = function() {
        //console.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.setItemsPerPage2 = function(num) {
        $scope.itemsPerPage2 = num;
        $scope.currentPage2 = 1; //reset to first page
    }
   
    $scope.verResumenDiario = function () {
        $http.post("verResumenDiario", $scope.info).then(function (response) {
            $scope.resumen = response.data.resumen;
            $scope.detalle = {};
            $scope.totalItems1 = $scope.resumen.length;
        });
    }

    $scope.seleccionarFila = function (item) {
        $scope.selected = item;
        
        $scope.info.ure = item.ure;
        console.log($scope.info);
        
        $http.post("verDetalleDiario", $scope.info).then(function (response) {
            $scope.detalle = response.data.detalle;
            $scope.totalItems2 = $scope.detalle.length;
        });
        
    };

    $scope.generarReporteResumen = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post('generarReporteResumen', $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });

        }
    };
    
    $scope.generarReporteDetalle = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post('generarReporteDetalle', $scope.info).then(function (response) {
                downloadFileDirect(response.data);
            });

        }
    };
    
    
    
});


