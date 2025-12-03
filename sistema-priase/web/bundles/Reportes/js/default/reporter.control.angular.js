
var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('reporterController', function ($scope, $http) {
    $('#rootwizard').bootstrapWizard({'tabClass': 'navk nav-pills'});
});


