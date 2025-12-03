import {
  RActividadesMunicipios,
  RActualizacionMedidor,
  RBusquedaServicios,
  RConsultaPeriodos,
  RHomologacionAgendas,
  RListarAgendas,
  RListarAgendasServicios,
  RListarServicios,
  RNominaDestajo,
  RParametrizacionMateriales,
  RPreliquidacionFacturacion,
  RRelacionConceptos,
  RSucursalesMunicipios,
  RGestionActividadesColaborador,
  RReporteDistribucionContable,
  RReporteAgendas,
  RConsultaPrueba,
  RGestionPrueba,
  RReporteInstalacionesR,
  RPreliquidacion,
} from '../vistas/index'

import Defecto from '../vistas/Defecto'

const RUTAS_VISTA = {
  RAIZ: { url: '/', componente: RBusquedaServicios },
  VISTA_NO_PERMITIDA: { url: '/no_autorizado', componente: Defecto },
  ACTIVIDADES_MUNICIPIOS: {
    url: '/actividades_municipios',
    componente: RActividadesMunicipios,
  },
  ACTUALIZACION_MEDIDOR: {
    url: '/actualizacion_medidor',
    componente: RActualizacionMedidor,
  },
  BUSQUEDA_SERVICIOS: {
    url: '/busqueda_servicios',
    componente: RBusquedaServicios,
  },
  CONSULTA_PERIODOS: {
    url: '/consulta_periodos',
    componente: RConsultaPeriodos,
  },
  HOMOLOGACION_AGENDAS: {
    url: '/homologacion_agendas',
    componente: RHomologacionAgendas,
  },
  LISTAR_AGENDAS: {
    url: '/listar_agendas',
    componente: RListarAgendas,
  },
  LISTAR_AGENDAS_SERVICIOS: {
    url: '/listar_agendas_servicios',
    componente: RListarAgendasServicios,
  },
  LISTAR_SERVICIOS: {
    url: '/listar_servicios',
    componente: RListarServicios,
  },
  NOMINA_DESTAJO: {
    url: '/nomina_destajo',
    componente: RNominaDestajo,
  },
  PARAMETRIZACION_MATERIALES: {
    url: '/parametrizacion_materiales',
    componente: RParametrizacionMateriales,
  },
  PRELIQUIDACION_FACTURACION: {
    url: '/preliquidacion_facturacion',
    componente: RPreliquidacionFacturacion,
  },
  RELACION_CONCEPTOS: {
    url: '/relacion_conceptos',
    componente: RRelacionConceptos,
  },
  SUCURSALES_MUNICIPIOS: {
    url: '/sucursales_municipios',
    componente: RSucursalesMunicipios,
  },
  REPORTE_DISTRIBUCION_CONTABLE: {
    url: '/reporte_distribucion_contable',
    componente: RReporteDistribucionContable
  },
  REPORTE_ACTIVIDADES_COLABORADOR: {
    url: '/reporte_actividades_colaborador',
    componente: RGestionActividadesColaborador,
  },
  REPORTE_AGENDAS: {
    url: '/reporte_agendas',
    componente: RReporteAgendas
  },
  REPORTE_INSTALACIONES: {
    url: '/instalaciones_realizadas',
    componente: RReporteInstalacionesR
  },
  VALIDAR_PRELIQUIDACION: {
    url: '/validar_preliquidacion',
    componente: RPreliquidacion
  },
}

export default RUTAS_VISTA;
