/**
 * @fileOverview Archivo de vista y control para exportar movimientoscontables
 * @author angelicaGomez
 * @requires exportarContabilizacion.control.js
 * @requires exportarContabilizacion.modelo.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace exportarVista
 * @type {Object}
 */
var that = null;
/** @namespace */
var exportarVista = {
    /** Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /** Inicializa el programa de exportación de movimientos contables, y asigna listeners a los controles
     * @returns {void}
     */
    init: function () {
        that = exportarVista;
        $('#btnErrores').on('click', that.consultarErrores);
        $('#cmbCiclo').on('change', that.consultarMovimientos);
        $('#btnAprobar, #btnEliminar').on('click', that.confirmarAprobar);
        $('#btnRegenerar').on('click', that.reGenerarMovimientos);
        $('#cmbMovimiento, #cmbTipoMovimiento').on('change', that.consultarMovimientosExportar);
    },

    /**
     * Consulta los errores por movimiento contable
     * @returns {void} 
     */
    consultarErrores: function () {
        var movimiento = $('#cmbMovimiento').val();
        if (!movimiento || movimiento === '-1') {
            __dom.lanzarAlerta('Debe seleccionar un movimiento contable', 'Atención');
            return;
        }
        exportarControl.consultarDetallesMovimiento({idmovimientodetalle: movimiento, accion: 'E'}, that.onConsultarDetalles);
    },

    /**
     * Se ejecuta cuando se terminan de consultar los detalles de la contabilización e invoca la descarga del archivo de excel 
     * @param  {Object} data Respuesta del servidor
     * @returns {void}
     */
    onConsultarDetalles: function(data){
        switch (data.codigoRespuesta){
            case 0:
                __dom.lanzarAlerta(data.mensaje, 'Atención');
                break;
            case 1:
                $('#linkexcel')[0].click();
                break;
        }
    },

    /**
     * Invoca la consulta de los movimientos por ciclo
     * @returns {void} 
     */
    consultarMovimientos: function () {
        var _this = $(this).val();
        $('#cmbMovimiento').empty();

        if (_this && _this !== '-1') {
            var dataEnviar = {
                idciclo: _this
            };
            exportarControl.consultarMovimientosCiclo(dataEnviar, that.onConsultarMovimientos);
        }
    },

    /**
     * Se ejecuta cuando se terminan de consultar los movimientos contables y carga un combo con los datos.
     * @param  {Object} data Respuesta del servidor
     * @returns {void}      
     */
    onConsultarMovimientos: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                var cmbMovimiento = $('#cmbMovimiento');
                cmbMovimiento.append($('<option>').val('-1').text('Seleccione una opción'));
                for (var i = 0; i < data.movimientoscontables.length; i++) {
                    var movimiento = data.movimientoscontables[i];
                    var opcion = $('<option>').val(movimiento.id).text(movimiento.id + ' - ' + movimiento.fecha);
                    cmbMovimiento.append(opcion);
                }
                break;
        }
    },

    /**
     * Consulta los movimientos que se pueden exportar por el id del movimiento y el tipo de movimiento.
     * @returns {void} 
     */
    consultarMovimientosExportar: function () {
        var movimiento = $('#cmbMovimiento').val();
        var idtipomovimiento = $('#cmbTipoMovimiento').val();
        $('#divDetallesMovimiento').hide();

        if (!movimiento || movimiento === '-1' || !idtipomovimiento || idtipomovimiento === '-1') {
            $('#tblDetalleMovimiento').empty();
            return;
        }
        var infoEnviar = {
            idmovimiento: movimiento,
            tipomovimiento: idtipomovimiento
        }
        exportarControl.consultarMovimientoExportar(infoEnviar, that.onConsultarMovimientosExportarCompleto);
    },

    /**
     * Se ejecuta cuando se terminan de consultar los movimientos contables que se pueden exportar y carga las tablas de movimientos enviados y a exportar.
     * @param  {Object} data Respuesta del servidor
     * @returns {void}      
     */
    onConsultarMovimientosExportarCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                $('#divDetallesMovimiento').hide();
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                var movimientos = that.organizarMovimientoPorEstado(data.movimientos);
                if (movimientos.transmitidos.length > 0) {
                    that.cargarTablaEnviados(movimientos.transmitidos);
                    $('#divDetalleEnviado').show();
                    $('#divDetallesMovimiento').show();
                } else if (that.apptableenviado) {
                    that.apptableenviado.destroy();
                    $('#divDetalleEnviado').hide();
                }

                if (movimientos.aprobados.length > 0) {
                    that.cargarTablaaExportar(movimientos.aprobados);
                    $('#divDetalleMovimiento').show();
                    $('#divDetallesMovimiento').show();
                } else if (that.apptable) {
                    that.apptable.destroy();
                    $('#divDetalleMovimiento').hide();
                }
                break;
        }
    },

    /**
     * Ordena y separa los movimientos de acuerdo al timpo de movimiento (A, E, P, T, X o R)
     * @param  {String} data Un string con un JSON que se transforma para obtener el arreglo de movimientos.    
     * @returns {void}
     */
    organizarMovimientoPorEstado: function (data) {
        data = JSON.parse(JSON.stringify(data).replace(/null/g, '""'));
        var movimientos = {
            aprobados: [],
            transmitidos: []
        };
        for (var i = 0; i < data.length; i++) {
            var movimiento = data[i];
            switch (movimiento.estado) {
                case 'A':
                    movimiento['estadonombre'] = 'Aprobado';
                    movimiento['fecha'] = movimiento['fechaaprobacion'];
                    movimientos.aprobados.push(movimiento);
                    break;
                case 'E':
                    movimiento['estadonombre'] = 'Eliminado';
                    movimientos.transmitidos.push(movimiento);
                    break;
                case 'P':
                    movimiento['estadonombre'] = 'Generado'; //revisar si se usa la palabra Pendiente
                    movimientos.aprobados.push(movimiento);
                    break;
                case 'T':
                    movimiento['estadonombre'] = 'Transmitido';
                    movimiento['fecha'] = movimiento['fechaexportacion'];
                    movimientos.transmitidos.push(movimiento);
                    break;
                case 'X':
                    movimiento['estadonombre'] = 'Exportado';
                    movimiento['comentario'] = 'Respuesta seven: '+movimiento['idseven'];
                    movimiento['fecha'] = movimiento['fechaexportacion'];
                    movimientos.transmitidos.push(movimiento);
                    break;
                case 'R':
                    movimiento['estadonombre'] = 'Error';
                    movimientos.aprobados.push(movimiento);
                    break;
            }
        }
        return movimientos;
    },

    /**
     * Configura y llena la tabla de movimientos para exportar con Apptable.
     * @param  {Array} info Arreglo con la información de los movimientos
     * @returns {void}      
     */
    cargarTablaaExportar: function (info) {
        var columnasMovimientosAExportar = [
            {type: 'checkbox', title: 'Seleccione', headers: 'thSeleccionar', sortable: false, data: 'idmovimiento', text: 'Seleccione'},
            {type: 'text', text: 'Estado', headers: 'thEstado', data: 'estadonombre'},
            {type: 'text', text: 'Fecha', headers: 'thFecha', data: 'fecha'},
            {type: 'text', text: 'Movimiento', headers: 'thMovimientoExportacion', data: 'idmovimientoexportacion'},
            {type: 'text', text: 'Tipo Operación', headers: 'thTipoOperacion', data: 'tipooperacion'},
            //{type: 'text', text: 'Nombre Tercero', headers: 'thNombreTercero', data: 'nombretercero'},
            {type: 'text', text: 'Municipio', headers: 'thMunicipio', data: 'municipio'},
            {type: 'text', text: 'Usuario', headers: 'thUsuario', data: 'usuario'},
            {type: 'text', text: 'Mensaje', headers: 'thMensaje', data: 'comentario'},
           //{type: 'button', text: 'Detalles', headers: 'thDetalles', data: 'idmovimientoexportacion', btnCallback: that.consultarDetalle}
        ];
        var config = {
            title: '',
            pagination: true,
            cellNavigable: false,
            searchableMinLength: 1,
            columns: columnasMovimientosAExportar,
            linesPageRange: [10, 20, 30, 50, 100],
            onRowComplete: that.rowCallback,
            lg: lenguajeTabla
        };
        if (that.apptable) {
            if (that.apptable.selector === '#tblDetalleMovimiento' && that.apptable.container) {
                that.apptable.destroy();
            }
        }
        that.apptable = new Apptable('#tblDetalleMovimiento', config, info);
    },

    /**
     * Configura y llena la tabla de movimientos enviados con Apptable.
     * @param  {Array} info Arreglo con la información de los movimientos
     * @returns {void}      
     */
    cargarTablaEnviados: function (info) {
        var columnasMovimientosEnviadas = [
            
            {type: 'text', text: 'Fecha Movimiento', headers: 'thFecha', data: 'fecha'},
            {type: 'text', text: 'Fecha Aprobación', headers: 'thFecha', data: 'fechaaprobacion'},
            {type: 'text', text: 'Fecha Eliminación', headers: 'thFecha', data: 'fechaeliminacion'},
            {type: 'text', text: 'Fecha Exportación', headers: 'thFecha', data: 'fechaexportacion'},
            
            {type: 'text', text: 'Estado', headers: 'thEstado', data: 'estadonombre'},
            {type: 'text', text: 'Movimiento', headers: 'thMovimientoExportacion', data: 'idmovimientoexportacion'},
            {type: 'text', text: 'Tipo Operación', headers: 'thTipoOperacion', data: 'tipooperacion'},
            {type: 'text', text: 'Municipio', headers: 'thMunicipio', data: 'municipio'},
            {type: 'text', text: 'Usuario', headers: 'thUsuario', data: 'usuario'},
            {type: 'text', text: 'Mensaje', headers: 'thMensaje', data: 'comentario'},
            //{type: 'button', text: 'Detalles', headers: 'thDetalles', data: 'idmovimientoexportacion', btnCallback: that.consultarDetalle}
        ];

        var config2 = {
            title: '',
            pagination: true,
            cellNavigable: false,
            searchableMinLength: 1,
            columns: columnasMovimientosEnviadas,
            onRowComplete: that.configurarBotonDetalles,
            linesPageRange: [10, 20, 30, 50, 100],
            lg: lenguajeTabla
        };


        if (that.apptableenviado) {
            if (that.apptableenviado.selector === '#tblDetalleEnviado' && that.apptableenviado.container) {
                that.apptableenviado.destroy();
            }
        }
        that.apptableenviado = new Apptable('#tblDetalleEnviado', config2, info);
    },

    /**
     * Agrega un estilo al botón de ver detalles
     * @param  {Object} data El objeto con que se llena la fila, es decir cada movimiento (parámetro no utilizado, NO borrar)
     * @param  {Object} tr   El elemento HTML en el que se configura el evento
     * @returns {void}
     */
    configurarBotonDetalles: function (data, tr) {
        tr.find('td[headers="thDetalles"] button').addClass('tblBtn');
    },

    /**
     * Consulta los detalles de un movimiento especificado.
     * @param  {Object} item Un objeto con la información del movimiento
     * @returns {voir}      
     */
    consultarDetalle: function (item) {
        var idmovimiento = item.idmovimientoexportacion;
        exportarControl.consultarDetallesMovimiento({'idmovimientodetalle': idmovimiento, accion: 'D'}, that.onConsultarDetalles);
    },
    /** Agrega controles con respectivo listener a tabla de facturas filtradas
     * @param item - Información asignada a la fila actual
     * @param fila - Fila en la que se agregará el control
     * @returns {void}
     **/
    rowCallback: function (item, fila) {
        that.configurarBotonDetalles(item, fila);
        if (item.estado !== 'P' && item.estado !== 'R') {
            fila.find('td[headers="thSeleccionar"] label').remove();
        }
    },

    /**
     * Valida la información del formulario y solicita la confirmación de la aprobación de los movimientos
     * @returns {void} 
     */
    confirmarAprobar: function () {
        var _this = $(this);
        var id = _this.val();
        exportarModelo.accion = id;
        var idciclo = $('#cmbCiclo').val();
        var idmovimiento = $('#cmbMovimiento');
        exportarModelo.detallesSeleccionados = [];

        var nombre = idmovimiento.find('option:selected').text();
        for (var indice = 0; indice < that.apptable.data.length; indice++) {
            var infoFila = that.apptable.data[indice];
            if(!infoFila.at_controls || !infoFila.at_id){
                continue;
            }
            var seleccionado = infoFila.at_controls['__checkbox_idmovimiento__'+infoFila.at_id];
            if (seleccionado) {
                var objeto = {idmovimientoexportacion: infoFila.idmovimientoexportacion};
                exportarModelo.detallesSeleccionados.push(objeto);
            }
        }


        if (!idmovimiento.val() || idmovimiento.val() === '-1' || !idciclo || idciclo === '-1') {
            __dom.lanzarAlerta('Debe seleccionar ciclo y movimiento contable', __app.mensajes.atencion);
            return;
        }
        if (that.apptable.data.length === 0) {
            __dom.lanzarAlerta('El movimiento no tiene detalles', __app.mensajes.atencion);
            return;
        }
        if (exportarModelo.detallesSeleccionados.length === 0) {
            __dom.lanzarAlerta('No se han seleccionado detalles del movimiento ', __app.mensajes.atencion);
            return;
        }

        var fxAccion = function () {
            that.confirmarCompletoAprobarEliminar(nombre);
        };
        __dom.lanzarAlerta('¿Está seguro que desea ' + id + ' la exportación del movimiento contable?', 'Confirmación', fxAccion, true);
    },

    /**
     * Solicita una reconfirmación de la aprobación o eliminación de la exportación del movimiento contable.
     * @param  {String} nombre Nombre de la acción que se va a ejecutar.
     * @returns {void}        
     */
    confirmarCompletoAprobarEliminar: function (nombre) {
        __dom.lanzarAlerta(
                '¿Está totalmente seguro de ' + exportarModelo.accion + ' la exportación del movimiento contable <b> ' + nombre + ' </b> ?',
                'Confirmación',
                that.aprobarMovimiento,
                true
                );
    },

    /**
     * Aprueba un movimiento contable o elimina según la acción que esté seleccionada en el modelo
     * @returns {void} 
     */
    aprobarMovimiento: function () {
        var data = {
            tipomovimiento: $('#cmbTipoMovimiento').val(),
            movimientoexportacion: exportarModelo.detallesSeleccionados,
            idmovimiento : $('#cmbMovimiento option:selected').val()
        };
        $('#divComandos input:button').hide();
        $('#divExportacion, #divCargando').show();
        var spanOperacion = $('#divCargando span.span-operacion');
        
        $('#divSeleccion, #divDetallesMovimiento').hide();
        if (exportarModelo.accion === 'Aprobar') {
            spanOperacion.text('Exportando');
            exportarControl.aprobarMovimiento(data, that.onAprobarMovimiento);
            return;
        }
        spanOperacion.text('Eliminando');
        exportarControl.eliminarMovimientos(data, that.onAprobarMovimiento);
    },

    /**
     * Se ejecuta cuando se termina de aprobar o eliminar un movimiento contable e informa al usuario con una alerta.
     * @param  {Object} data La respuesta del servidor
     * @returns {void}      
     */
    onAprobarMovimiento: function (data) {
        $('#divComandos input:button').show();
        $('#divSeleccion, #divDetallesMovimiento').show();
        $('#divExportacion, #divCargando').hide();
        that.consultarMovimientosExportar();
        if (data.codigoRespuesta === 1) {
            __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
        } else if (data.codigoRespuesta === -1) {
            __dom.ocultarToast();
            __dom.lanzarAlerta('Ocurrió un problema cuando se hacia la aprobación.', __app.mensajes.atencion);
        }
    },
     /**
     * Se regenera el movimiento contable seleccionado por el usuario
     * @returns {void} 
     */
    reGenerarMovimientos: function(){
        var idmovimiento = $('#cmbMovimiento');
        var nombre = idmovimiento.find('option:selected').text();
          if (!idmovimiento.val() || idmovimiento.val() === '-1' ) {
            __dom.lanzarAlerta('Debe seleccionar un movimiento contable', __app.mensajes.atencion);
            return;
        }
        __dom.lanzarAlerta('¿Está seguro que desea   " ...Regenerar... "   el movimiento contable  '+nombre+' ?', 'Confirmación',that.onRegeneraMovimientos,true);
        
    },
    
    onRegeneraMovimientos: function(){
        var data = {
            idmovimiento: $('#cmbMovimiento').val()
        };
        exportarControl.reGenerarMovimientoContable(data,that.onCompletadoReGenerar)
    },
    
    onCompletadoReGenerar: function(data){
        switch (data.codigoRespuesta) {
            case 1:
                __dom.lanzarAlerta(data.mensaje, 'Atención');
                break;
            case -1:
                __dom.lanzarAlerta(data.mensaje, 'Atención');
                break;
        }
    },
};
exportarVista.init();