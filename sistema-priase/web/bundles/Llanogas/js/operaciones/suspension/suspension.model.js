/**
 * @fileOverview Archivo de modelo donde se almacena la información de las suspensiones y reconexiones de una suscripción
 * @author AppFuture
 * @version 1.1.0
 * @namespace suspensionModel
 */
var suspensionModel = {
    idMunicipio:'',
    accionEncabezado: 'C',
    idSuscripcion: 0,
    idSuspensionSeleccionada: 0,
    currentIdMotivo: 0,
    currentIdMotivoRec: 0,
    currentIdPropiedad: {},
    cabecera: {},
    detalle: [],
    cabeceraSuspensiones: {},
    suspensionSeleccionada: {idSuspension: -1},
    estadosSuspensiones: {},
    motivosSuspensiones: {},
    tiposSuspensiones: {},
    conceptosSuspensiones: {},
    novedadesSuspensiones: {},
    novedadesReconexion: {},
    formatoDetallesSuspension: {
        thead: [
            {'id': 'thMotivo', 'text': 'Motivo', 'sort': false, 'refer': 'motivoSuspension', 'type': 'text'},
            {'id': 'thFechaProgramacion', 'text': 'Fecha Programación', 'sort': false, 'refer': 'fechaprogramacion', 'type': 'text'},
            {'id': 'thEmpresaSuspension', 'text': 'Empresa Suspensión', 'sort': false, 'refer': 'nombretercerosuspension', 'type': 'text'},
            {'id': 'thEjecutada', 'text': 'Ejecutada', 'sort': false, 'refer': 'ejecutada', 'type': 'text'},
            {'id': 'thFechaEjecucion', 'text': 'Fecha Ejecución', 'sort': false, 'refer': 'fechaejecucion', 'type': 'text'},
            {'id': 'thNovedad', 'text': 'Novedad', 'sort': false, 'refer': 'novedadsuspension', 'type': 'text'},
            {'id': 'thLectura', 'text': 'Lectura', 'sort': false, 'refer': 'lectura', 'type': 'text'},
            {'id': 'thVer', 'text': 'Ver', 'sort': false, 'refer': 'idDetalleSuspension', 'type': 'button', 'style': {'width': '10%'}},
            {'id': 'thEditar', 'text': 'Editar', 'sort': false, 'refer': 'idDetalleSuspension', 'type': 'button', 'style': {'width': '10%'}},
            {'id': 'thEliminar', 'text': 'Eliminar', 'sort': false, 'refer': 'idDetalleSuspension', 'type': 'button', 'style': {'width': '10%'}},
            {'id': 'thHabilitar', 'text': 'Habilitar', 'sort': false, 'refer': 'idDetalleSuspension', 'type': 'button', 'style': {'width': '10%'}}
        ]
    },
    detallesSuspensionesTabla: {},
    formatoDetallesReconexion: {
        thead: [
            {'id': 'thFechaAprobacion', 'text': 'Fecha Aprobación', 'sort': false, 'refer': 'fechaaprobacion', 'type': 'text'},
            {'id': 'thFechaEjecucion', 'text': 'Fecha Ejecución', 'sort': false, 'refer': 'fechaejecucion', 'type': 'text'},
            {'id': 'thFechaProgramacion', 'text': 'Fecha Programación', 'sort': false, 'refer': 'fechaprogramacion', 'type': 'text'},
            {'id': 'thNombreEmpresaReconexion', 'text': 'Nombre Empresa Reconexión', 'sort': false, 'refer': 'nombreempresareconexion', 'type': 'text'},
            {'id': 'thLectura', 'text': 'Lectura', 'sort': false, 'refer': 'lectura', 'type': 'text'},
            {'id': 'thConcepto', 'text': 'Concepto', 'sort': false, 'refer': 'idconcepto', 'type': 'text'},
            {'id': 'thValorTotal', 'text': 'Valor Total', 'sort': false, 'refer': 'valortotal', 'type': 'text'},
            {'id': 'thVer', 'text': 'Ver', 'sort': false, 'refer': 'idreconexion', 'type': 'button', 'style': {'width': '10%'}},
            {'id': 'thEditar', 'text': 'Editar', 'sort': false, 'refer': 'idreconexion', 'type': 'button', 'style': {'width': '10%'}},
            {'id': 'thEliminar', 'text': 'Eliminar', 'sort': false, 'refer': 'idreconexion', 'type': 'button', 'style': {'width': '10%'}},
            {'id': 'thHabilitar', 'text': 'Habilitar', 'sort': false, 'refer': 'idDetalleSuspension', 'type': 'button', 'style': {'width': '10%'}}
        ]
    },
    detallesReconexionesTabla: {},
    tercerosSuspensiones: {}
};