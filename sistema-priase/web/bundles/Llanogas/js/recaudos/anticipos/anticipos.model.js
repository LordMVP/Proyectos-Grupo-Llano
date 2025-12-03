/**
 * Formato para llenar la tabla de las suscripciones que tiene un suscriptor
 * @type {Object}
 */
var formatoSuscripciones = {
    thead:[
        {'id':'thIdSuscripcion', 'text':'Cod. Suscripción', 'refer':'idsuscripcion', 'type':'text', 'style':{'width':'15%'}},
        {'id':'thTipoLiquidacion', 'text':'Suscripción', 'refer':'tiposuscripcion', 'type':'text'},
        {'id':'thCodAnterior', 'text':'Cod. Anterior', 'refer':'codanterior', 'type':'text'}
    ]
};

/**
 * Formato para llenar la información de los anticipos agregados para una suscripción
 * @type {Object}
 */
var formatoAnticipos = {
    thead:[
        {'id':'thTipoLiquidacion',
            'text':'Tipo Liquidación',
            'refer':'tipoLiquidacion', 'type':'text',
            'valueField':'idTipoLiquidacion'
        },
        {'id':'thDocumento', 'text':'Documento',
            'refer':'documento', 'type':'text',
            'valueField':'idDocumento'
        },
        {'id':'thTipoDocumento', 'text':'Tipo Documento',
            'refer':'tipoDocumento',
            'type':'text', 'valueField':'idTipoDoc'
        },
        {'id':'thDescripcion', 'text':'Concepto',
            'refer':'concepto',
            'type':'text', 'valueField':'idConcepto'},
        {'id':'thPeriodo', 'text':'Periodo',
            'refer':'periodo',
            'type':'text', 'valueField':'idPeriodo'},
        {'id':'thValor', 'text':'Valor', 'refer':'valor', 'type':'currency'},
        {'id':'thModificar', 'text':'Modificar',
            'refer':null, 'type':'button',
            'style':{'width':'10%'}
        },
        {'id':'thRemover', 'text':'Remover',
            'refer':null, 'type':'button',
            'style':{'width':'10%'}
        }
    ]
};
/**
 * @fileOverview Archivo de modelo para guardar la información del anticipo
 * @author AppFuture
 * @version 1.0.0
 */
var anticiposModel = {
    suscriptor:null,
    suscripciones:null,
    informacionPago:null,
    anticipo:{
        anticipos:[]
    },
    formasPago:[],
    resumenRecaudo:null,
    documentomaximoImpresion:0,
    cantidadImpresiones:0
};
