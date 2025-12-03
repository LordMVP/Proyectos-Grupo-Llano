/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * @author AppFuture
 */

var app = angular.module('myApp', ['httpModule', 'ui.bootstrap.showErrors', 'angularModalService','ui.bootstrap']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.factory('modelo', function () {
    return {
        ciclosSeleccionados: [],
        temporal: [],
        mensaje:'defecto'
    };
});

app.controller('ParametrizacionReportesControllerAngular', function ($scope, $http, ModalService, modelo, $modal) {
    $scope.modelo = modelo;
    $scope.init = function () {
        //console.log($scope.info.parametro);
    };

    $scope.info = {
        periodo: null,
        ciclo: null,
        ciclos: null,
        anos: null,
        empresas:null,
        empresa:{},
        empresaTmp:null,
        reporteUnidades:null,
        editar:null,
        editarestado:false,
        categorias:null,
        categoria:null,
        unidad:null,
        estadoEmpresa:false,
        estadoTipo:0,
        //unidadestmp : {seleccion: [] },
        seleccion:[],
        nombre:'',
        descricpion:'',
        current:{
          nombre:'',
          empresa:null,
          parametros:[],
          logo:'',
          tituloEmpresa:''
        },
        parametro:{
            TIPO:'',
            NOMBRE:'',
            DESCRIPCION:'',
            UNIDADES:[],
            SENTENCIA:''
        }           
    };

    $scope.limpiarCampos = function () {
        $scope.info = {
            periodo: null,
            ciclo: null,
            anos: null
        };
    };

    $scope.idprograma = 155;
    
    //consultar empresas
    $http.get("../util/consultarEmpresaGeneral").then(function (response) {
        $scope.empresas = response.data.empresas;
    });
    
     /**
     * Consulta los categoria
     */
    $scope.cargarCategoriaEmpresa = function () {
        if($scope.info.editar!==null)
        {
            $scope.info.current.empresa=$scope.info.editar.ru_empresa;
        }
        if($scope.info.editar===null)
        {
           $scope.info.current.empresa=$scope.info.empresaTmp.codigo;
        }        
        $http.get("../util/getConsultarCategoriaEmpresa/"+$scope.info.current.empresa).then(function (response) {
            //console.log('que tiene empresa '+$scope.info.current.empresa);
            $scope.categorias = response.data.categorias;
        });
        $scope.info.estadoEmpresa=true;
    };
    
     /**
     * Consulta los unidades
     */
    $scope.cargarUnidadesCategoria = function () {
        $http.get("../util/getConsultaUnidadesCategoria/"+$scope.info.categoria).then(function (response) {
            //console.log('que tiene categoria '+$scope.info.categoria );
            $scope.unidades = response.data.unidades;
        });
    };
    
     //consultar reporteUnidades
    $http.get("../util/consultarReporteUnidades").then(function (response) {
        $scope.reporteUnidades = response.data.reporteUnidades;
    });
    
    $scope.cargarEditar= function ()
    {
        $scope.info.current.empresa=$scope.info.editar.ru_empresa;
        $scope.info.current.nombre=$scope.info.editar.ru_reporte_nombre;
        $scope.info.current.logo=$scope.info.editar.ru_logo;
        //$scope.info.empresaTmp={codigo:$scope.info.editar.ru_empresa,nombre:$scope.info.editar.ru_titulo_empresa};       
        //var idx = $scope.empresas.indexOf({codigo:$scope.info.editar.ru_empresa,nombre:$scope.info.editar.ru_titulo_empresa});
        var idx = $scope.empresas.map(function(d) { return d['codigo']; }).indexOf(parseInt($scope.info.editar.ru_empresa));
        $scope.info.empresaTmp=$scope.empresas[idx];
        $scope.info.editarestado=true;
        $scope.info.estadoEmpresa=true;
        $scope.cargarCategoriaEmpresa();
        $scope.agregarParametroEditar($scope.info.editar.ru_parametros);
        
        
    };
    
    ////unidades
    $scope.toggleSelection = function (unidad) {
    var idx = $scope.info.seleccion.indexOf(unidad);
    // is currently selected
    if (idx > -1) {
      $scope.info.seleccion.splice(idx, 1);
    }

    // is newly selected
    else {
      $scope.info.seleccion.push(unidad);
    }
  };
    
    $scope.agregarParametro=function ()
    {
        if($scope.info.seleccion.length>0 && $scope.info.parametro.TIPO==='UNIDAD' || $scope.info.seleccion.length>0 && $scope.info.parametro.TIPO==='CICLOS' || $scope.info.seleccion.length>0 && $scope.info.parametro.TIPO==='PROYECTOS')
        {
            $scope.info.parametro.TIPO='UNIDAD';
            for (var indice in $scope.info.seleccion) {
                  //console.log($scope.user.seleccion[indice]);
                  $scope.info.parametro.UNIDADES.push({NOMBRE:$scope.info.seleccion[indice].uni_nombre1,UNIDAD:$scope.info.seleccion[indice].uni_ideregistro});
                  $scope.info.parametro.SENTENCIA='';
              }
              
            $scope.info.current.parametros.push($scope.info.parametro);
            //console.log($scope.info.current.parametros);
        }
        if($scope.info.parametro.TIPO==='SENTENCIA')
        {
            $scope.info.parametro.unidades=[];
            $scope.info.current.parametros.push($scope.info.parametro);
        }
        //console.log($scope.info.parametro);
        ////inicializa todo...
        $scope.info.seleccion=[];
        $scope.info.parametro={TIPO:'',NOMBRE:'',DESCRIPCION:'',UNIDADES:[],SENTENCIA:''};
        //$scope.cargarUnidadesCategoria();      
        $scope.unidades=[];
    };
    
    $scope.eliminarParametro= function (i) {
                $scope.info.current.parametros.splice(i, 1);
            };
            
    $scope.agregarParametroEditar=function (parametros)
    {
       $scope.info.current.parametros=[]; 
       if(parametros!=null)///oj con esto ,puede que no vengan valores
       {
           //console.log(parametros);
           
           array=JSON.parse(parametros);
           for (var i = 0; i < array.length; i+=1) {
                //console.log(array[i]);
                $scope.info.current.parametros.push(array[i]); 
              }
       }
    }
    
    $scope.cambioTipo=function ()
    {
        if($scope.info.parametro.TIPO==='CICLOS')
        {
            $http.get("../util/getConsultarCiclosEmpresaReporte/"+$scope.info.current.empresa).then(function (response) {
            $scope.unidades = response.data.ciclos;
            });
            
        }
         if($scope.info.parametro.TIPO==='PROYECTOS')
        {
            $http.get("../util/getConsultarProyectoEmpresaReporte/"+$scope.info.current.empresa).then(function (response) {
            $scope.unidades = response.data.proyectos;
            });
            
        }
    }
    
    
    $scope.guardar=function ()
    {            
        $scope.info.current.tituloEmpresa=$scope.info.empresaTmp.nombre;        
        $http.post("insertarReporteUnidades", $scope.info.current).then(function (response) {
                    //downloadFileDirect(response.data);
                    //downloadFileDirect(response.data);
                    console.log(response.data);
                    var tmp=JSON.parse(response.data);
                    if(parseInt(tmp.resultado)>0)
                    {
                         __dom.lanzarAlerta("Se ha Registrado Exitosamente...: ","Registro Reporte Unidades");
                    }
                    if(parseInt(tmp.resultado)<0 || parseInt(tmp.resultado)===0)
                    {
                         __dom.lanzarAlerta("Error, Verificar el log...: ","Registro Reporte Unidades");
                    }
                    $http.get("../util/consultarReporteUnidades").then(function (response) {
                        $scope.reporteUnidades = response.data.reporteUnidades;
                    }); 
                });      
        $scope.info.current={ nombre:'', empresa:null, parametros:[], logo:'', tituloEmpresa:''}; 
        //$scope.empresas=null;
        $scope.info.editar=null;
        $scope.info.empresaTmp=null;
        $scope.info.categorias=null;
        $scope.info.estadoEmpresa=false;
        $scope.info.editarestado=false;
        
    }
    
    $scope.editar =function ()
    {
        $scope.info.current.tituloEmpresa=$scope.info.empresaTmp.nombre;        
        $http.post("editarReporteUnidades", $scope.info.current).then(function (response) {
                    //downloadFileDirect(response.data);
                    //downloadFileDirect(response.data);
                    console.log(response.data);
                    var tmp=JSON.parse(response.data);
                    if(parseInt(tmp.resultado)>0)
                    {
                        __dom.lanzarAlerta("Se ha Actualizado Exitosamente...: ","Editar Reporte Unidades");
                    }
                    if(parseInt(tmp.resultado)<0 || parseInt(tmp.resultado)===0)
                    {
                         __dom.lanzarAlerta("Error, Verificar el log...: ","Editar Reporte Unidades");
                    }
                    $http.get("../util/consultarReporteUnidades").then(function (response) {
                        $scope.reporteUnidades = response.data.reporteUnidades;
                    }); 
                });
                 
        $scope.info.current={ nombre:'', empresa:null, parametros:[], logo:'', tituloEmpresa:''}; 
        //$scope.empresas=null;
        $scope.info.editar=null;
        $scope.info.empresaTmp=null;
        $scope.info.categorias=null;
        $scope.info.estadoEmpresa=false;
        $scope.info.editarestado=false;
        
    }
    
    $scope.valoresReporte= function ()
    {
        $http.post("valoresReporteJasper", $scope.info.current).then(function (response) {
                    //console.log(response.data);
                     $modal.open({
                            templateUrl: 'myModalContent.html',
                            controller: ModalInstanceCtrl,
                            resolve: {
                              test: function () {
                                return JSON.parse(response.data);
                              }
                            }
                          });
                    
                });   
    }
    
   
   
    /**
     * Consulta los ciclos activos
     */
    $http.get("../util/getJsonCiclosActivosPorPrograma/" + $scope.idprograma).then(function (response) {
        $scope.modelo.ciclos = response.data.ciclos;
    });

    /**
     * Consulta los periodos por ciclo
     */
    $http.get("../util/getJsonListarAnos").then(function (response) {
        $scope.anos = response.data.anos;
    });

    /**
     * Consulta los periodos por ciclo
     */
    $scope.cargarPeriodosAno = function () {
        console.log($scope.info.anos);
        $http.post("../util/getConsultarPeriodosPorAnoGeneral", $scope.info).then(function (response) {
            $scope.periodos = response.data.periodos;
        });
    }

    $scope.generarReporte = function () {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.validarDatos()) {
            if ($scope.reporte.$valid) {
                $scope.info.ciclo = $scope.modelo.ciclosSeleccionados.toString();
                $http.post("generarfinanciacionesFacturadasCiclo", $scope.info).then(function (response) {
                    //downloadFileDirect(response.data);
                    downloadFileDirect(response.data);
                });
            }
        }
    };

    $scope.validarDatos = function () {
        console.log();
        if ($scope.info.periodo === null && $scope.modelo.ciclosSeleccionados.length === 0) {
            $("#mensajeAdvertencia").css("display", "block");
            $("#cmbCiclo").parent().attr('class', 'form-group col-md-4 has-error');
            $("#cmbPeriodo").parent().attr('class', 'form-group col-md-4 has-error');
            return false;
        }

        if ($scope.info.periodo !== null) {
            $("#cmbCiclo").parent().attr('class', 'form-group col-md-4');
            $("#mensajeAdvertencia").css("display", "none");
            return true;
        }

        if ($scope.modelo.ciclosSeleccionados.length !== 0) {
            $("#cmbPeriodo").parent().attr('class', 'form-group col-md-4');
            $("#mensajeAdvertencia").css("display", "none");
            return true;
        }
        return true;
    };

    $scope.abrirDialogoCiclos = function () {
        var ciclosSeleccionados = $scope.modelo.ciclosSeleccionados;
        ModalService.showModal({
            templateUrl: 'ciclos.html',
            controller: "ModalController"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                if (result) {
                    $scope.modelo.ciclosSeleccionados = $scope.modelo.temporal;
                    return;
                }

                if (!result) {
                    $scope.modelo.ciclosSeleccionados = [];
                    $scope.modelo.temporal = [];
                    return;
                }

            });

        });
    };


    $scope.init();

});



app.controller('ModalController', function ($scope, close, modelo) {
    $scope.modelo = modelo;
    //$scope.modelo=modelo;
    
    $scope.close = function (result) {
        close(result, 500); // close, but give 500ms for bootstrap to animate
    };

    $scope.onCicloSeleccionado = function (e, idciclo) {
        for (var i = 0; i < $scope.modelo.temporal.length; i++) {
            if ($scope.modelo.temporal[i] === idciclo) {
                $scope.modelo.temporal.splice(i, 1);
                return;
            }
        }
        if (e.currentTarget.checked) {
            $scope.modelo.temporal.push(idciclo);
            return;
        }
    };

    $scope.exists = function (item) {
        //return  _.findIndex($scope.modelo.temporal, function(t){return t.idmunicipio == todo.id;}) > -1;
        return $scope.modelo.temporal.indexOf(item) > -1;
    };
});

app.controller('ContrladorModal', function($scope, close) {
  $scope.result = "Esta es la respuesta";
  $scope.cerrarModal = function() {
    close($scope.result);
  };

});

 var ModalInstanceCtrl = function ($scope, $modalInstance, test) {

            $scope.test = JSON.parse(test);
             $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
          };