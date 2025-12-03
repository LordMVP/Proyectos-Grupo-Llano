/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('GeneralRestotController', function ($scope, $http) {
   // $scope.info = {fechaInicial:null,fechaFinal:null,estado:null,municipio:null};
    
    //$http.get("../util/getJsonProyectos").then(function(response){
      //  $scope.municipios = response.data.proyectos;
    //});
    //$http.get("../util/getJsonEstadosVenta").then(function(response){
      //  $scope.estadosVenta = response.data.items;
    //});
    $scope.info = {fechaConsulta: null, periodo: null, ciclo: null,anno:null};
    //var year = new Date().getFullYear();
    var year=2000;
        var range = [];
        range.push(year);
        for(var i=1;i<100;i++) {
          range.push(year + i);
                                };
$scope.years = range;
    $scope.years = [2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030];
    $scope.dato = {
    anno: null,
    opcionesanno: [
      {id: '2000', valor: '2000'},{id: '2001', valor: '2001'},{id: '2002', valor: '2002'},{id: '2003', valor: '2003'},{id: '2004', valor: '2004'},
      {id: '2005', valor: '2005'},{id: '2006', valor: '2006'},{id: '2007', valor: '2007'},{id: '2008', valor: '2008'},
      {id: '2009', valor: '2009'},{id: '2010', valor: '2010'},{id: '2011', valor: '2011'},{id: '2012', valor: '2012'},
      {id: '2013', valor: '2013'},{id: '2014', valor: '2014'},{id: '2015', valor: '2015'},{id: '2016', valor: '2016'},
      {id: '2017', valor: '2017'},{id: '2018', valor: '2018'},{id: '2019', valor: '2019'},{id: '2020', valor: '2020'},
      {id: '2021', valor: '2021'},{id: '2022', valor: '2022'},{id: '2023', valor: '2023'},{id: '2024', valor: '2024'},
      {id: '2025', valor: '2025'},{id: '2026', valor: '2026'},{id: '2027', valor: '2027'},{id: '2028', valor: '2028'},
      {id: '2029', valor: '2029'},{id: '2030', valor: '2030'}
                  ],
                  };
 
    $http.get("../util/getJsonCiclosActivos").then(function (response) {
        $scope.ciclos = response.data.ciclos;
    });

    $scope.actualizarPeriodos = function () {
        $http.get("../util/getJsonPeriodosCiclo/" + $scope.info.ciclo).then(function (response) {
            $scope.periodos = response.data.periodos;
        });
    };
 
    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarRestotProyecto", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };
    
    $scope.generarReporte2 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarRestotProyecto2", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };
    
    $scope.generarReporte3 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarRestotConsolidado", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };
    
    $scope.generarReporte4 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarRestotConsolidado2", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };
    
    $scope.generarReporte5 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarRestotPeriodo", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };
    
    $scope.generarReporte5 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarRestotMes", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };
      
    $scope.generarReporte6 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarRestotAnual", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };
    
    $scope.generarReporte7 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarRestotAnualConsolidado", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };
    
    $scope.generarReporte8 = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reporte.$valid) {
            $http.post("generarRestotAnualIndustrial", $scope.info).then(function (response) {
                downloadFile(response.data);
            });
        }
    };
    
});
