import {
    REdicionActividades,
    REdicionParametros,
    REdicionReglas,
    RConfiguracionAgendamiento,
    RFrecuenciaAgendamiento,
    RCalendarioHabil,
    RCalendarioHabilU,
    RRutasMunicipios,
    RRutasSectores,
    RUnidadesResponsables,
    RProgramacionManual,
    RSolicitudAgendamiento,
    RFrecuenciaDemanda,
    RReportes,
    RAgendamientoManual,
    RReporteAgendamiento,
    RReasignarAgendamiento,
    RCancelarAgendamiento,
    RDetalleCalendario,
} from '../vistas/index'

const RUTAS_VISTA = {
    RAIZ: { url: '/', componente: REdicionActividades },
    VISTA_NO_PERMITIDA: {
        url: '/no_autorizado',
        componente: REdicionActividades,
    },
    EDICION_ACTIVIDAD: {
        url: '/edicion_actividad',
        componente: REdicionActividades,
    },
    REPORTE_AGENDAMIENTO: {
      url: '/reporte_agendamiento',
      componente: RReporteAgendamiento,
    },
    EDICION_PARAMETRO: {
        url: '/edicion_parametro',
        componente: REdicionParametros,
    },
    EDICION_REGLAS: { url: '/edicion_reglas', componente: REdicionReglas },
    CONFIGURACION_AGENDAMIENTO: {
        url: '/configuracion_agendamiento',
        componente: RConfiguracionAgendamiento,
    },
    FRECUENCIA_AGENDAMIENTO: {
        url: '/frecuencia_agendamiento',
        componente: RFrecuenciaAgendamiento,
    },
    CALENDARIO_HABIL: {
        url: '/calendario_habil',
        componente: RCalendarioHabil,
    },
    AGENDAMIENTO_MANUAL: {
      url: '/agendamiento_manual',
      componente: RAgendamientoManual
    },
    RUTAS_SECTORES: { url: '/rutas_sectores', componente: RRutasSectores },
    RUTAS_MUNICIPIOS: {
        url: '/rutas_municipios',
        componente: RRutasMunicipios,
    },
    UNIDADES_RESPONSABLES: {
        url: '/unidades_responsables',
        componente: RUnidadesResponsables,
    },
    PROGRAMACION_MANUAL: {
        url: '/programacion_manual',
        componente: RProgramacionManual,
    },
    SOLICITUD_AGENDAMIENTO: {
        url: '/programacion_demanda',
        componente: RSolicitudAgendamiento,
    },
    FRECUENCIA_DEMANDA:{
        url:'/frecuencia_demanda',
        componente:RFrecuenciaDemanda
    },
    REPORTES:{
        url:'/reportes_agau',
        componente:RReportes,
    },
    REASIGNAR_AGENDAMIENTO:{
        url:'/reasignar_agendamiento',
        componente:RReasignarAgendamiento
    },
    CANCELAR_AGENDAMIENTO:{
        url:'/cancelar_agendamiento',
        componente:RCancelarAgendamiento
    },
    CALENDARIO_HABIL_U: {
        url: '/calendario_habil_ugii',
        componente: RCalendarioHabilU,
    }
    ,
    DETALLE_CALENDARIO: {
        url: '/detalle_calendario',
        componente: RDetalleCalendario,
    }
}

export default RUTAS_VISTA
