/**
* @fileOverview Archivo de control de definición de conceptos
* @author Appfuture 
* @requires definicionConcepto.modelo.js
* @version 1.0.0
*/

/** @namespace */
var definicionControl = {

    /**
     * Consulta los parámetros de la cabecera de la interfaz.
     * @param  {Function} completado Función de callback que se ejecuta con la respuesta del servidor.
     * @returns {void}            
     */
    consultarParametrosIniciales:function(completado){
        __cnn.ajax({
            'url': '../parametros/',
            'completado': completado,
            'modal':true
        });
    },


    /**
     * Consulta la información de un concepto por coincidencia de nombre
     * @param  {Object} data       Información con el nombre del concepto
     * @param  {Function} completado Función de callback que se ejecuta con al respuesta del servidor
     * @returns {void}            
     */
    consultarConceptoNombre: function(data, completado) {
        __cnn.ajax({
            'url': '../../consultar/concepto/nombre',
            'data': data,
            'completado': completado
        });
    },


    /**
     * Consulta la información completa de un concepto por su ID
     * @param  {Object} data       La informaciónd e la petición
     * @param  {Function} completado Función de callback que se ejecuta con la respuesta del servidor.
     * @returns {void}            
     */
    consultarConcepto: function(data, completado) {
        __cnn.ajax({
            'url': '../obtener',
            'data': data,
            'completado': completado
        });
    },


    /**
     * Consulta un concepto por su id en la colección de conceptos seleccionados.
     * @param  {Number} id El id del concepto a buscar
     * @returns {void}
     */
    consultarConceptoPorId: function(id) {
        for (var i = 0; i < definicionModelo.conceptosSeleccionar.length; i++) {
            if (definicionModelo.conceptosSeleccionar[i].idconcepto === id) {
                return definicionModelo.conceptosSeleccionar[i];
            }
        }
    },

    /**
     * Valida el Alias que se escribe para un concepto nuevo
     * @param  {Objecto} data       Los parámetros para la petición
     * @param  {Function} completado Callback que se invoca con la respuesta del servidor
     * @returns {void}            
     */
    validarAlias:function(data, completado){
        __cnn.ajax({
            'url': '../../validar/concepto/alias',
            'data': data,
            'completado': completado
        });
    },


    /**
     * Consulta los conceptos relacionados de un concepto por su id
     * @param  {Object} data       
     * @param  {Function} completado Callback que se invoca con la respuesta del servidor.
     * @returns {void}            
     */
    consultarConceptosRelacionados: function(data, completado) {
        __cnn.ajax({
            'url': '../../consultar/concepto/relacionado',
            'data': data,
            'completado': completado
        });
    },

    /**
     * Consulta los rangos de un concepto
     * @param  {Object} data       Los datos de la consulta
     * @param  {Function} completado Callback que se invoca con al respuesta del servidor
     * @returns {void}            
     */
    consultarRangos: function(data, completado) {
        __cnn.ajax({
            'url': '../../consultar/concepto/rangos',
            'data': data,
            'completado': completado
        });
    },


    /**
     * Consulta un rango por su ID de la colección de rangos en el modelo
     * @param  {Number} id Id del rango
     * @returns {Object}    El rango encontrado.
     */
    consultarRangoPorId: function(id){
        for (i = 0; i < definicionModelo.rango.length; i++) {
            if (definicionModelo.rango[i].idrango == id) {
                return definicionModelo.rango[i];
            }
        }
    },

    /**@deprecated Candidato a borrar */
    consultarTablaOrigen: function(data, completado) {
        __cnn.ajax({
            'url': '../tabla/origen',
            'data': data,
            'completado': completado
        });
    },

    /**@deprecated Candidato a borrar */
    consultarCampoTabla: function(data, completado) {
        __cnn.ajax({
            'url': '../tabla/origen/campo',
            'data': data,
            'completado': completado
        });
    },

    /**@deprecated Candidato a borrar */
    consultarLiquidacion: function(completado) {
        __cnn.ajax({
            'url': '../../consultar/liquidacion',
            'data': {},
            'completado': completado
        });
    },

    /**
     * Consulta los documentos del concepto.
     * @param  {Object} data       Los datos de la petición al servidor
     * @param  {Function} completado Función que se invoca con la respuesta del servidor
     * @returns {void}
     */
    consultarDocumento: function(data, completado) {
        __cnn.ajax({
            'url': '../documentos',
            'data': data,
            'completado': completado
        });
    },

    /**
     * Consulta los tipos de documento para el concepto
     * @param  {Object} data       Los datos de la petición al servidor. 
     * @param  {Functión} completado Callback que invoca con la respuesta del servidor.
     * @returns {void}
     */
    consultarTipoDocumento: function(data, completado) {
        __cnn.ajax({
            'url': '../../consultar/tipoDocumento',
            'data': data,
            'completado': completado
        });
    },

    /**
     * Consulta los tipos de documento por tipo de liquidaión
     * @param  {Object} data       Parámetros de la petición
     * @param  {Fucntion} completado Callback que se invoca con la respuesta del servidor.
     * @returns {void}            
     */
    consultarTipoDocumentoLiquidacion: function(data, completado) {
        __cnn.ajax({
            'url': '../../consultar/tipoDocumento',
            'data': data,
            'completado': completado
        });
    },

    /**@deprecated Candidato a borrar */
    consultarFuncion: function(data, completado) {
        __cnn.ajax({
            'url': '../../consultar/concepto/funciones',
            'data': data,
            'completado': completado
        });
    },

    /**
     * Guarda un nuevo concepto en el servidor 
     * @param  {Object} data       
     * @param  {Function} completado 
     * @returns {void}            
     */
    crearConcepto : function(data, completado){
        __cnn.ajax({
            'url': '../../crear/conceptos',
            'data': data,
            'completado': completado
        });
    },

    /**
     * Consulta las contabilizaciones para los conceptos
     * @param  {Object} data
     * @param  {Function} completado
     * @returns {void}
     */
    consultarCuentaContabilizacion : function(data, completado){
        __cnn.ajax({
            'url': '../../consultar/cuentas',
            'data': data,
            'completado': completado
        });
    },

    /**@deprecated Candidato a borrar */
    consultarCuentaAreaNegocio : function(data, completado){
        __cnn.ajax({
            'url': '../../consultar/areanegocio/cuentas',
            'data': data,
            'completado': completado
        });
    },

    /**@deprecated Candidato a borrar */
    consultarCuentaCentroCosto : function(data, completado){
        __cnn.ajax({
            'url': '../../consultar/centrocosto/cuentas',
            'data': data,
            'completado': completado
        });
    },

    /**@deprecated Candidato a borrar */
    consultarContabilizacion : function(data, completado){
        __cnn.ajax({
            'url': '../../consultar/contabilizacion/obtener',
            'data': data,
            'completado': completado
        });
    },

    /**@deprecated Candidato a borrar */
    consultarAreaNegocio : function(data, completado){
        __cnn.ajax({
            'url': '../../consultar/areanegocio/obtener',
            'data': data,
            'completado': completado
        });
    },

    /**@deprecated Candidato a borrar */
    consultarCentroCosto : function(data, completado){
        __cnn.ajax({
            'url': '../../consultar/centrocosto/obtener',
            'data': data,
            'completado': completado
        });
    },

    /**
     * Obtiene un rago por fila
     * @param  {Number} fila Número de la fila con que se hace la búsqueda.
     * @returns {Object|null}      El rango o null en caso de no encontrar resultados.
     */
    obtenerRangoPorFila:function(fila){
        for (var i = 0; i < definicionModelo.rangoArray.length; i++) {
            if (definicionModelo.rangoArray[i].fila === fila) {
                return definicionModelo.rangoArray[i];
            }
        }
        return null;
    },

    /**
     * Obtiene el índice de un rango para una fila seleccionada.
     * @param  {Number} fila Número de la fila
     * @returns {Number|null}    Retorna el índice del rango o null si no encuentra nada.
     */
    obtenerIndiceRangoPorFila:function(fila){
        for (var i = 0; i < definicionModelo.rangoArray.length; i++) {
            if (definicionModelo.rangoArray[i].fila === fila) {
                return i;
            }
        }
        return null;
    },

    /**
     * Consulta en los conceptos a seleccionar por el id del concepto
     * @param  {Number} idConcepto Id del concepto
     * @returns {Objet}            El concepto resultante.
     */
    obtenerConceptoPorId:function(idConcepto){
        for (var i = 0; i < definicionModelo.conceptosSeleccionar.length; i++) {
            var concepto = definicionModelo.conceptosSeleccionar[i];
            if (concepto.idconcepto === idConcepto) {
                return concepto;
            }
        }
    },

    /**
     * Valida la existencia del concepto en el arreglo de conceptos relacionados y de conceptos para eliminar
     * y Agrega el concepto a los conceptos relacionados.
     * @param  {Number} idConcepto Id del concepto que se debe buscar
     * @param  {Bool} persiste   Indica si el concepto debe persistir, o está sólo en tiempo de ejecución
     * @returns {void}            
     */
    agregarConceptoRelacionado:function(idConcepto, persiste){
        if(!definicionModelo.conceptosRelacionados){
            definicionModelo.conceptosRelacionados = [];
        }

        if (persiste) {
            var conceptoRelElminado = null;
            var estaEliminado = false;
            for(var j = 0; j < definicionModelo.conceptosRelacionadosEliminar.length; j++){
                if(definicionModelo.conceptosRelacionadosEliminar[j].idconceptorelacionado === idConcepto){
                    estaEliminado = true;
                    conceptoRelElminado = definicionModelo.conceptosRelacionadosEliminar.splice(j,1)[0];
                    conceptoRelElminado.accion = 'A';
                    definicionModelo.conceptosRelacionados.push(conceptoRelElminado);
                    break;
                }
            }

        }else{
            var concepto = definicionControl.obtenerConceptoPorId(idConcepto);
            concepto.accion = 'I';
            definicionModelo.conceptosRelacionados.push({
                accion: "I", 
                conceptorelacionado: concepto.nombre,
                idconcepto: definicionModelo.conceptoPrincipal.idconcepto,
                idconceptorelacionado: concepto.idconcepto,
                idfuncion: -1,
                persiste: false
            });
        }
    },

    


    /**
     * Remueve un concepto de la lista de conceptos relacionados. Validando primero que exista y si debe persistir.
     * @param  {Number} idConcepto Id del concepto que se va a remover
     * @param  {Bool} persiste   Indica si el concepto debe persistir y no, para llevarlo a la BD
     * @param  {Array} rangos     Arreglo de rangos del concepto
     * @returns {void}            
     */
    removerConceptoSeleccionado:function(idConcepto, persiste, rangos){
        //////remover de la lista de conceptos relacionados
        for(var j =0; j<definicionModelo.conceptosRelacionados.length; j++){
            var con = definicionModelo.conceptosRelacionados[j];
            if(con.idconceptorelacionado === idConcepto){
                var conceptoEliminar = definicionModelo.conceptosRelacionados.splice(j,1)[0];
                if(persiste){
                    conceptoEliminar.accion = 'E';
                    definicionModelo.conceptosRelacionadosEliminar.push(conceptoEliminar);
                }
            }
        }

        if(rangos){
            for(var j = rangos.length-1; j >= 0; j--){
                var rangoEliminar = definicionModelo.rangos[rangos[j]];
                var eliminado = definicionModelo.rangos.splice(rangos[j],1)[0];
                if(rangoEliminar.persiste){
                    eliminado.accion = 'E';
                    definicionModelo.rangosEliminar.push(eliminado);
                }
            }
        }
    },


    /**
     * Cuenta la cantidad de veces que un concepto está relacionado en la fórmula matemática del concepto principal
     * @param  {Number} idconcepto Id del concepto que se buscará
     * @param  {Array} _formula   Un arreglo con las fórmulas del programa
     * @returns {Number}            La cantidad de veces que se encuentra el concepto.
     */
    contarConceptoFormulaPorId:function(idconcepto, _formula){
        var contador = 0;
        for (var i = 0; i < _formula.length; i++) {
            var formula = _formula[i];
            if (formula.tipo === 'con' && formula.idconcepto == idconcepto) {
                contador++;
            }else if(formula.tipo === 'fun'){
                for(var p = 0;p<formula.params.length;p++){
                    if(formula.params[p].tipo==='concepto' && formula.params[p].idconcepto == idconcepto){
                        contador++;
                    }
                }
            }
        }
        return contador;
    },

    /**
     * Consulta la cantidad de conceptos que están relacionados al concepto principal, pero no están implementados en la fórmula
     * @returns {Array|Boolean} Si retorna un arreglo, es porque hay conceptos que no se están usando, true quiere decir que no hay conceptos sin usar.
     */
    contarConceptosSinUsar:function(){
        var conceptosSinUsar = [];
        if(definicionModelo.conceptosRelacionados){
            for (var i = 0; i < definicionModelo.conceptosRelacionados.length; i++) {
                var cs = definicionModelo.conceptosRelacionados[i];
                var contadorConcepto = 0;
                for (var j = 0; j < definicionModelo.formula.length; j++) {
                    var itemFormula = definicionModelo.formula[j];
                    switch (itemFormula.tipo) {
                        case 'fun':
                            for (var k = 0; k < itemFormula.params.length; k++) {
                                if (itemFormula.params[k].idconcepto == cs.idconceptorelacionado) {
                                    contadorConcepto++;
                                }
                            }
                            break;
                        case 'con':
                            if (itemFormula.idconcepto == cs.idconceptorelacionado) {
                                contadorConcepto++;
                            }
                            break;
                    }
                }

                if (contadorConcepto===0) {
                    conceptosSinUsar.push(cs);
                }
            }    
            return conceptosSinUsar;
        }
        return true;
        
    },


    /**
     * Valida que todos los conceptos relacionados tenga una función asignada.
     * @returns {Object} Retorna un objeto con los resultados de la validación.
     */
    validarConceptosRelacionados:function(){
        var respuesta = {
            codigo: -1,
            mensaje: ''
        };

        for(var i = 0;i<definicionModelo.conceptosRelacionados.length; i++){
            var concepto = definicionModelo.conceptosRelacionados[i];
            if(concepto.idfuncion == '-1' || concepto.idfuncion === undefined || concepto.idfuncion === null){
                respuesta.mensaje += 'El concepto <strong>'+concepto.conceptorelacionado+'</strong>, de los conceptos relacionados no tiene una función asociada';
            }
        }

        if(respuesta.mensaje === ''){
            respuesta.codigo = 1;
        }
        return respuesta;
    },

    /**@deprecated candidato a borrar */
    obtenerIdtablaPorNombre:function(nombre){
        if (!!definicionModelo.tablasOrigen) {
            for (var i = 0; i < definicionModelo.tablasOrigen.length; i++) {
                var tabla = definicionModelo.tablasOrigen[i];
                if (tabla.tor_nomtabla === nombre) {
                    return tabla.idorigen;
                }
            }
        }
        return -1;
    },

    /**@deprecated candidato a borrar */
    obtenerIdCampoPorNombre:function(nombre){
        if (!!definicionModelo.camposOrigen) {
            for (var i = 0; i < definicionModelo.camposOrigen.length; i++) {
                var campo = definicionModelo.camposOrigen[i];
                if (campo.campo === nombre) {
                    return campo.idcampo;
                }
            }
        }
        return -1;
    },

    /**@deprecated candidato a borrar */
    obtenerContabilizacionPorId:function(id){
        for(var i = 0; i<definicionModelo.contabilizaciones.length; i++){
            if(definicionModelo.contabilizaciones[i].idcontabilizacion===id){
                return definicionModelo.contabilizaciones[i];
            }
        }
    },
    
    
    /**
     * Recibe la fecha de la consulta desde el backend, valida que no esté vacía
     * Si no está en blanco, la asigna al control que se envía como segundo parámetro
     * @param {String} fecha de la consulta
     * @param {Object} inputFecha: Control de jQuery que debe estar configurador como un DatePicker de jQuery UI
     * @returns {void}
     */
    obtenerFechaConcepto:function(fecha, inputFecha){
        if (fecha !== '' && fecha !== null && fecha !== undefined) {
            var nuevaFecha = new Date(fecha);
            //nuevaFecha.setDate(nuevaFecha.getDate()+1);
            inputFecha.datepicker("setDate", nuevaFecha);
        }else{
            inputFecha.val('');
        }
        return inputFecha;
    }

};
