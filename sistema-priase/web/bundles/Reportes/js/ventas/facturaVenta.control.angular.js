
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('ventasController', function ($scope, $http) {
    $scope.info = {numeroVenta: '', numeroDocumento: null,numeroSuscripcion: null};

    $scope.seleccionarFila = function (item) {
        $scope.selected = item;
        var id = item.venta_id;
        $("#tr_ven_" + id).addClass("row-selected").siblings().removeClass("row-selected");
        $("#ck_ven_" + id).attr("checked", "true");
    };

    $scope.buscarVentas = function () {
        $scope.selected = null;
        $scope.nofound = false;
        $scope.ventas = [];
        $http.post("buscarVentasPorDocumentoFacturaVenta", $scope.info).then(function (response) {
            $scope.ventas = response.data.ventas;
            $scope.nofound = $scope.ventas.length === 0;
        });

    };
    $scope.generarReporte = function () {
        $http.post("generarFormatoFacturaDeVenta", {'numeroVenta': $scope.selected.venta_id}).then(function (response) {
            downloadFile(response.data);            
        });
    };

});


