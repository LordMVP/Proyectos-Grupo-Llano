
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

    $scope.info = {};
    
    $scope.generarReporte = function (type) {
        $scope.$broadcast('show-errors-check-validity');
        var url; 
                
        if(type === 3){
            url = "generarReporteConciliacionEdadesCartera";
        }else{
            url = "generarReporteEdadesCartera";
        }      
        
        if ($scope.reporte.$valid) {
            $scope.info.conceptos = $scope.conceptos;
            $http.post(url, $scope.info).then(function (response) {
                downloadFile(response.data);
                $scope.info={};
            });
        }
    };

});


