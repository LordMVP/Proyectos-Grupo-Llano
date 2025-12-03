const RUTAS_API = {
  MENU: {
    CONSULTAR_MENU: '/menu',
  },
  PARAMETRIZACION: {
    GESTION_MENU: {
      OBTENER_SESION: 'obtener_sesion',
    },
  },
  CONFIGURACION: {
    CONSULTAR_TIPOS: 'configuracion_tipos_consultar',
    REGISTRAR: 'configuracion_guardar',
    CONSULTAR_POR_TIPO: 'configuracion_consultar',
  },

  VARIABLES: {
    CONSULTAR_VARIABLES: 'generico_variables_consultar',
    CONSULTAR_ALIAS_VARIABLE: 'variables_consultaralias',
    CONSULTAR_FUNCIONES: 'generico_funciones_consultar',
    GUARDAR_VARIABLE: 'variables_guardar',
  },

  EDICIONACTIVIDADES: {
    PROCESO: '/edicionactividades_proceso',
    CONSULTAR_CONTRATANTE: '/edicionactividades_consultarContratante',
    AGENDA: '/edicionactividades_agenda',
    SERVICIO: '/edicionactividades_servicios',
    ACTIVIDAD: '/edicionactividades_actividades',
    TAREA: '/edicionactividades_tarea',
    CIUDAD: '/edicionactividades_ciudades',
    CUADRILLA: '/edicionactividades_cuadrillas',
    CONTRATISTA: '/edicionactividades_contratistas',
    INSPROAPROCESOACTIVIDADES:
      '/edicionactividades_insproaprocesoactividades',
    CONSULTAR_CARGAR_VISTA: '/edicionactividades_consulatunidresactividad',
    LISTAR_PROCESO_ACTIVIDADES:
      '/edicionactividades_listarprocesoactividades',
    ELIMINAR_URA_UNIDADES: '/edicionactividades_eliminarUraunidades',
    ELIMINAR_CIA_CIUDADES: '/edicionactividades_eliminarCiaciudades',
    EDICION_UNIDAD_ACTIVIDAD: '/edicionactividades_edicionunidadactividad',
  },
  EDICIONPARAMETROS: {
    LISTAR_PARAMETROS: '/agendamientoAutomatico_listarParametros',
    LISTAR_PARAMETROS_MODELO:
      '/agendamientoAutomatico_listarParametrosModelo',
    BUSCAR_PARAMETROS: '/agendamientoAutomatico_buscarParametros',
    CONSULTAR_PARAMETROS: '/agendamientoAutomatico_consultarParametroPorId',
    CONSULTAR_ACTIVIDADES: '/agendamientoAutomatico_consultarActividades',
    CONSULTAR_CIUDADES: '/agendamientoAutomatico_consultarCiudades',
    CONSULTAR_CONTRATISTA: '/agendamientoAutomatico_consultarContratistas',
    PROCESO: '/agendamientoAutomatico_proceso',
    UNIDADES_RESPONSABLES: '/agendamientoAutomatico_unidadesResponsables',
    CONSULTAR_FUNCIONES: '/agendamientoAutomatico_consultarFunciones',
    REGISTRAR_PARAMETRO: '/agendamientoAutomatico_registrarParametro',
    ACTUALIZAR_PARAMETRO: '/agendamientoAutomatico_actualizarParametro',
  },
  EDICIONREGLAS: {
    LISTAR_REGLA: '/agendamientoAutomatico_listarReglas',
    LISTAR_PROCESO: '/agendamientoAutomatico_listarProcesos',
    LISTAR_PARAMETRO: '/agendamientoAutomatico_listarParametros',
    BUSCAR_REGLA: '/agendamientoAutomatico_edicionReglas_buscarReglas',
    REGISTRAR_REGLA: '/agendamientoAutomatico_edicionReglas_registrarRegla',
    ACTUALIZAR_REGLA:
      '/agendamientoAutomatico_edicionReglas_actualizarRegla',
    BUSCAR_CONDICION:
      '/agendamientoAutomatico_edicionReglas_buscarCondicion',
    BUSCAR_REGLA_POR_ID:
      '/agendamientoAutomatico_edicionReglas_buscarReglaPorId',
    REGISTRAR_CONDICION:
      '/agendamientoAutomatico_edicionReglas_registrarCondicion',
    ACTUALIZAR_CONDICION:
      '/agendamientoAutomatico_edicionReglas_actualizarCondicion',
    VALOR_PARAMETRO: '/agendamientoAutomatico_edicionReglas_valorParametro',
    ELIMINAR_CONDICION:
      '/agendamientoAutomatico_edicionReglas_eliminarCondicion',
    INSERTAR_SOLO_CONDICION:
      '/agendamientoAutomatico_edicionReglas_registrarRegla',
  },
  CONFIGURACION_AGENDAMIENTO: {
    PROCESO: '/agendamientoAutomatico_listarProcesos',
    REGLA: '/agendamientoAutomatico_listarReglas',
    LISTAR_FUNCIONES: '/agendamientoAutomatico_listarFuncionesOda',
    PARAMETRO: '/agendamientoAutomatico_listaParametros',
    REGISTRAR_CONFIGURACION:
      '/agendamientoAutomatico_registrarConfiguracionAgendamiento',
    CONSULTAR_PRIORIDADES: '/agendamientoAutomatico_consultaPrioridades',
    BUSCAR_CONFIGURACION_AGENDAMIENTO:
      '/agendamientoAutomatico_buscarConfiguracionAgendamiento',
    CONSULTA_CONFIGURACION_AGENDAMIENTO:
      '/agendamientoAutomatico_consultaConfiguracionAgendamiento',
    ACTUALIZAR_CONFIGURACION_AGENDAMIENTO:
      '/agendamientoAutomatico_actualizarConfiguracionAgendamiento',
  },
  FRECUENCIA_AGENDAMIENTO: {
    LISTAR_CONFIGURACION_AGENDAMIENTO:
      '/crondAgendamiento_listarConfiguracionAgendamiento',
    PROCESO: '/crondAgendamiento_proceso',
    REGISTRAR_FRECUENCIA_AGENDAMIENTO:
      '/crondAgendamiento_registrarFrecuenciaAgendamiento',
    CONSULTA_FRECUENCIA_AGENDAMIENTO:
      '/crondAgendamiento_consultaFrecuenciaAgendamiento',
    CONSULTA_FRECUENCIA_AGENDAMIENTO_ID:
      '/crondAgendamiento_consultarxidFrecuenciaAgendamiento',
    LISTAR_PARAMETROS_FRECUENCIA:
      '/crondAgendamiento_listarParametrosFrecuencia',
    ACTUALIZAR_FRECUENCIA_AGENDAMIENTO:
      '/crondAgendamiento_actualizarFrecuenciaAgendamiento',
    BUSCAR_CONFIGURACION_AGENDAMIENTO:
      'crondAgendamiento_buscarFrecuenciaAgendamiento',
  },
  CALENDARIO_HABIL: {
    LISTAR_PROCESO: '/calendarioHabil_listarProceso',
    LISTAR_CONTRATISTAS: '/calendarioHabil_listarContratistas',
    LISTAR_CUADRILLAS_CONTRATISTA:
      '/calendarioHabil_listarCuadrillasPorContratista',
    LISTAR_CIUDADES: '/calendarioHabil/listarCiudades',
    CONSULTAR_CALENDARIO_HABIL: '/calendarioHabil_consultarCalendarioHabil',
    REGISTRAR_CONFIGURACION_CALENDARIO:
      '/calendarioHabil_registrarConfiguracionCalendarioHabil',
    ACTUALIZAR_CONFIGURACION_CALENDARIO:
      '/calendarioHabil_actualizarConfiguracionCalendarioHabil',
    CONSULTAR_CALENDARIO_POR_ID:
      '/calendarioHabil_consultarCalendarioHabilPorId',
    CONSULTAR_FESTIVOS: '/calendarioHabil_consultarfestivos',
    CONSULTAR_DETALLE_CALENDARIO: '/calendarioHabil_consultarDetalleCalendarioHabil',
  },
  RUTAS_SECTORES: {
    LISTAR_SECTORES: '/relacionSectoresRutas_listarSectores',
    LISTAR_RUTAS: '/relacionSectoresRutas_listarRutas',
    LISTAR_RELACIONES_SECTORES:
      '/relacionSectoresRutas_listarSectoresRutas',
    REGISTRAR_RELACIONES_SECTORES:
      '/relacionSectoresRutas_registrarSectoresRutas',
    ELIMINAR_RELACIONES_SECTORES:
      '/relacionSectoresRutas_eliminarSectoresRutas',
    CONSULTAR_RELACIONES_SECTORES_RUTAS:
      '/relacionSectoresRutas_listarRutasPorSector',
  },
  MUNICIPIOS_SECTORES: {
    LISTAR_SECTORES: '/relacionMunicipiosSectores_listarSectores',
    LISTAR_CIUDADES: '/relacionMunicipiosSectores_listarCiudades',
    REGISTRAR_RELACION_SECTORES: '/relacionMunicipiosSectores_registrarSectores',
    ELIMINAR_SECTOR: '/relacionMunicipiosSectores_eliminarMunicipioSectores',
    CONSULTAR_SECTORES_MUNICIPIOS: '/relacionMunicipiosSectores_consultarSectoresmunicipios'
  },
  RUTAS_MUNICIPIOS: {
    LISTAR_RUTAS: '/relacionRutasMunicipios_listarRutas',
    LISTAR_CIUDADES: '/relacionMunicipiosSectores_listarCiudades',
    LISTAR_RELACIONES_RUTAS:
      '/relacionRutasMunicipios_listarRumrutasmunicipios',
    REGISTRAR_RUTAS_MUNICIPIO:
      '/relacionRutasMunicipios_registrarRumRutasmunicipio',
    ELIMINAR_RUTAS_MUNICIPIO:
      '/relacionRutasMunicipios_eliminarRumRutasMunicipio',
    CONSULTAR_RUTAS_MUNICIPIO:
      '/relacionRutasMunicipios_consultarRumrutasmunicipios',
    EDITAR_RUTAS_MUNICIPIO:
      '/relacionRutasMunicipios_editarRumRutasMunicipio',
    AGREGAR_RUTA: '/relacionRutasMunicipios_registrarRumRutasmunicipio',
  },
  UNIDADES_RESPONSABLES: {
    INSETAR_UNIDAD_RESPONSABLE: 'ureActividadesSectores_insertarUnidadResponsable',
    LISTAR_CUADRILLAS: 'ureActividadesSectores_listarcuadrillas',
    LISTAR_UNIDADES_RESPONSABLES:
      '/ureActividadesSectores_listarunidadesResponsables',
    LISTAR_PROCESO: '/ureActividadesSectores_listarProceso',
    LISTAR_CONTRATANTES: '/ureActividadesSectores_listarContratantes',
    LISTAR_CIUDADES: '/ureActividadesSectores_listarCiudades',
    LISTAR_SECTORES_POR_CIUDAD:
      '/ureActividadesSectores_listarSectoresPorCiudad',
    CONSULTAR_PROCESO_ACTIVIDADES:
      '/ureActividadesSectores_consultarProcesoActividades',
    CONSULTAR_URE_UNIDAD_RESPONSABLE:
      '/ureActividadesSectores_consultarUreUnidadresponsables',
    CONSULTAR_POR_ID: '/ureActividadesSectores_consultarPorId',
    REGISTRAR_URE_UNIDAD_RESPONSABLE:
      '/ureActividadesSectores_registrarUreUnidadResponsable',
    ACTUALIZAR_URE_UNIDAD_RESPONDABLE:
      '/ureActividadesSectores_actualizarUreUnidadResponsable',
    LISTAR_MOD_URE_UNIDAD_RESPONDABLE:
            '/ureActividadesSectores_listarModUnidadResponsable',    
  },
  AGENDAMIENTO_MANUAL: {
    CONSULTAR_CONTRATANTES: '/agendamientoManualSure_listarContratantes',
    CONSULTAR_PROCESOS: '/agendamientoManualSure_listarprocesos',
    CONSULTAR_CONTRATISTAS: '/agendamientoManualSure_listarContratistas',
    CONSULTAR_PROYECTOS: '/agendamientoManualSure_listarproyectos',
    CONSULTAR_SERVICIOS: '/agendamientoManualSure_listarServicios',
    CONSULTAR_ACTIVIDADES: '/agendamientoManualSure_listarActividades',
    CONSULTAR_UNIDADES_RESPONSABLES: '/agendamientoManualSure_listarUres',
    CONSULTAR_RUTAS: '/agendamientoManualSure_listarRutas',
    CONSULTAR_CUENTAS: '/agendamientoManualSure_listarCuentas',
    ASIGNAR: '/agendamientoManualSure_Asignar',
    CONSULTAR_ORGANISMOS:'/agendamientoManualSure_listarOrganismos'
  },
  REPORTE_AGENDAMIENTO: {
    CONSULTAR_UGUII: '/reportes_consultarUguii', //POST
    LISTAR_EMPRESAS: '/reportes_listarEmpresa',
    LISTAR_PROCESO: '/reportes_listarProceso',
    LISTAR_MUNICIPIOS: '/reportes_listarMunicipio',
    EXPORTAR_REPORTE: '/reportes_exportar',//POST,
    LISTAR_UNIDADES_RESPONSABLES: '/reportes_listarUnidadesResponsables',
  },
  PROGRAMACION_MANUAL: {
    LISTAR_EMPRESAS_CONTRATANTES: '/agendamientoManual_listarContratantes',
    LISTAR_CONTRATISTAS: '/agendamientoManual_listarContratistas',
    LISTAR_CUADRILLAS: '/agendamientoManual_listarCuadrillas',
    LISTAR_PROCESOS: '/agendamientoManual_listarprocesos',
    LISTAR_AGENDAS: '/agendamientoManual_listarAgendas',
    LISTAR_MUNICIPIOS: '/agendamientoManual_listarMunicipios',
    LISTAR_SERVICIOS: '/agendamientoManual_listarServicios',
    LISTAR_ACTIVIDADES: '/agendamientoManual_listarActividades',
    CONSULTAR_ACTIVIDADES_PENDIENTES:'/agendamientoManual_consultarActividadesPendientes',
    EDITAR_ACTIVIDADES_AGENDAMIENTO_MANUAL:'/agendamientoManual_EditarActividadesAgendamientoManual',
    VALIDAR_DISPONIBILIDAD_URE:'/agendamientoManual_ValidarDisponibilidadURE',
    REGISTRAR_ACTIVIDADES_AGENDAMIENTO_MANUAL:'/agendamientoManual_registrarActividadesAgendamientoManual',
  },
  SOLICITUD_AGENDAMIENTO: {
    LISTAR_ACTIVIDADES: '/agendamientoPorDemanda_listarActividades',
    CONSULTAR_DISPONIBILIDAD:
      '/agendamientoPorDemanda_consultarDisponibilidad',
    EDITAR_ACTIVIDAD: '/agendamientoPorDemanda_editarActividad',
    LISTAR_AGENDAMIENTO: '/agendamientoPorDemanda_consultarAgendamiento',
    DATOS_SUSCRIPTOR:'agendamientoPorDemanda_consultarSuscriptor',
    LISTAR_FECHAS:'agendamientoPorDemanda_consultarFechasDisponibles',
    CONSULTAR_DISPONIBILIDAD_DEMANDA:
      '/agendamientoPorDemanda_consultarDisponibilidadDemanda',
    TIPO_ATENCION:'/agendamientoPorDemanda_consultarTipoAtencion',  
  },
  
  FRECUENCIA_AGENDAMIENTO_DEMANDA:{
    PROCESO: '/frecuenciademanda_proceso',  
    AGENDAMIENTO_DEMANDA: '/frecuenciademanda_agendamientoDemanda',
    CANTIDAD_CAG: '/frecuenciademanda_cantidadActividades',
    LISTAR_MUNICIPIOS:'/frecuenciademanda_listarMunicipios',
    LISTAR_SECTORES:'/frecuenciademanda_listarSectores'
  },

  REPORTES:{        
    LISTAR_UNIDADES_RESPONSABLES:'/reportes_listarUnidadesResponsables',
    CONSULTA_REPORTE:'/reportes_consultarAgendamiento',
    EXPORTAR_REPORTE:'/reportes_exportar'
  },

  REASIGNAR_AGENDAMIENTO:{        
    LISTAR_PROCESO:'/reasignar_listarProceso',
    LISTAR_URE:'/reasignar_listarUnidadesResponsables',
    LISTAR_AGENDAMIENTO:'/reasignar_consultarAgendamiento',
    LISTAR_CONTRATISTAS: '/reasignar_listarContratistas',
    CUADRILLA: '/reasignar_cuadrillas',
    REASIGNAR:'/reasignar_reasignarAgendamiento',
    CONSULTAR_SUSCRIPTOR:'/reasignar_consultarAgendamientoSuscriptor'
  },  
}

export default RUTAS_API
