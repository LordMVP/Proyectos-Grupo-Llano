const RUTAS_API = {
  MENU: {
    CONSULTAR_MENU: 'global_menu',
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

  ACTIVIDADES_MUNICIPIOS: {
    CONSULTAR_VALOR: 'parametrizacion_consultarValorActividadMunicipio',
    LISTAR_MUNICIPIOS: 'parametros_municipios',
    LISTAR_ACTIVIDADES: 'parametrizacion_listarActividades',
    LISTAR_CONTRATISTAS: 'parametrizacion_listarContratistas',
    LISTAR_EMPRESAS: 'parametros_empresas',
    CREAR_VALOR: 'parametrizacion_crearValorActividadMunicipio',
    EDITAR_VALOR: 'parametrizacion_editarValorActividadMunicipio'
  },

  ACTUALIZACION_MEDIDOR: {
    CONSULTA_POR_SUSCRIPTOR: 'medidores_consultaPorSuscriptor',
    ACTUALIZAR_MEDIDOR: 'medidores',
  },

  BUSQUEDA_SERVICIOS: {
    REGISTRAR_TODOS: 'etapas_registrarTodos',

    // Actividades

    AGREGAR_ACTIVIDADES: 'etapas_agregarActividades',
    CONSULTAR_ACTIVIDADES: 'v2/etapas_consultarActividades',
    LISTAR_COLABORADORES_ACTIVIDADES: 'etapas_listarColaboradoresActividades',
    LISTAR_ACTIVIDADES: 'etapas_listarActividades',

    // Detalle

    CONSULTAR_DETALLE_VENTA: 'etapas_consultarDetalleVentas',

    // Busqueda

    CONSULTAR_ETAPA: 'etapas_consultarEtapa',
    CONSULTAR_SUSCRIPTOR: 'v2/etapas_consultarSuscriptor',
    FILTRAR_SERVICIOS: 'v2/etapas_filtrarServicios',
    FILTRAR_AGENDAS: 'etapas_filtrarAgendas',
    FILTRAR_CUADRILLAS: 'etapas_filtrarCuadrillas',
    BUSCAR_SERVICIO: 'etapas_buscarServicio',

    // Materiales

    AGREGAR_MATERIALES: 'etapas_agregarMateriales',
    LISTAR_COLABORADORES_MATERIALES: 'etapas_listarColaboradoresMateriales',
    LISTAR_MATERIALES: 'etapas_listarMateriales',
    CONSULTAR_MATERIALES: 'v2/etapas_consultarMateriales',

    // No conformidades

    LISTAR_DEFECTOLOGIAS: 'etapas_listarDefectologias',
    LISTAR_NO_CONFORMES: 'etapas_listarNoConformes',
    CONSULTAR_NO_CONFORMIDADES: 'v2/etapas_consultarNoConformidades',
    NO_CONFORMIDAD_CERRAR: 'etapas_noConformidad_cerrar',

    // Novedades

    AGREGAR_NOVEDAD: 'etapas_agregarNovedad',
    BUSCAR_NOVEDAD: 'etapas_buscarNovedad',
    CONSULTAR_NOVEDADES: 'etapas_consultarNovedades',

    // Adjuntar

    CONSULTAR_ADJUNTOS: 'etapas_consultarAdjuntos',
    REGISTRAR_ADJUNTO: 'etapas_registrarAdjunto',
    CONSULTAR_ARCHIVO: 'consultarArchivo',
    ADJUNTAR_ARCHIVO: 'adjuntarArchivo',
  },

  CONSULTA_PERIODOS: {
    CONSULTAR_PERIODO: 'parametrizacion_consultarPeriodo',
    CONSULTAR_PERIODO_POR_ID: 'parametrizacion_consultarPeriodoPorId',
    REGISTRAR_PERIODO: 'parametrizacion_periodos_registrar',
    ACTUALIZAR_PERIODO: 'parametrizacion_periodos_actualizar',
  },

  HOMOLOGACION_AGENDAS: {
    LISTAR_CONTRATISTAS: 'parametrizacion_listarContratistas',
    LISTAR_EMPRESAS: 'parametros_empresas',
    LISTAR_AGENDAS: 'agenda_consultarTodas',
    HOMOLOGAR_AGENDA: 'parametrizacion_homologacionAgendas',
    AGENDA_HOMOLOGADA: 'parametrizacion_consultarAgendaHomologadaSevenPorAgenda',
  },

  LISTAR_AGENDAS: {
    CONSULTAR_TODAS: 'agenda_consultarTodas',
    CONSULTA_POR_CODIGO: 'agenda_consultarPorCodigo',
    CREAR_EDITAR: 'agenda_crearEditar',
    LISTAR_EMPRESAS: 'parametros_empresas',
    LISTAR_DEPENDENCIAS: 'parametros_dependencias',
    ELIMINAR_AGENDA: 'agenda_eliminar',
    LISTAR_DEPENDENCIAS_SIN_PARAMETROS: 'parametros_listardependencias'
  },

  LISTAR_AGENDAS_SERVICIOS: {
    CONSULTAR_POR_CODIGO: 'agendaServicio_consultarPorCodigo',
    LISTAR_MUNICIPIOS: 'parametros_municipios',
    AGREGAR_SERVICIOS: 'agendaServicio_agregarServicios',
  },

  LISTAR_SERVICIOS: {
    CONSULTA_POR_CODIGO: 'servicio_consultarPorCodigo',
    CONSULTA_POR_NIVEL: 'servicio_consultarPorNivel',
    CREAR_EDITAR: 'servicio_crearEditar',
    ELIMINAR_SERVICIO: 'servicio_eliminarServicio',
    LISTAR_EMPRESAS: 'parametros_empresas',
    LISTAR_DEPENDENCIAS: 'parametros_dependencias',
    LISTAR_MUNICIPIOS: 'parametros_municipios',
    LISTAR_NIVELES: 'parametros_niveles',
  },

  NOMINA_DESTAJO: {
    LISTAR_CONTRATISTAS: 'v2/parametrizacion_listar_contratantes',
    BUSCAR_LIQUIDACION: 'sincronizacionKactus_buscarLiquidacion',
    BUSCAR_PRELIQUIDACION: 'sincronizacionKactus_preliquidacion',
    CONSULTAR_PERIODO: 'sincronizacionKactus_periodos',
    MODIFICAR_LIQUIDACION: 'liquidacion_registrarLiquidacion',
    DESCARTAR_LIQUIDACION: 'liquidacion_descartarLiquidacion',
    ACTUALIZAR_LIQUIDACION: 'liquidacion_actualizaPreliquidacion',
    LISTAR_ACTIVIDADES: 'parametrizacion_listarActividades',
    LISTAR_ACTIVIDADES_V2: 'v2/parametrizacion_listarActividadesEstajo',
    LISTAR_MUNICIPIOS: 'parametros_municipios',
    LIQUIDAR: 'liquidacion_nominaDestajo',
    SINCRONIZAR: 'sincronizacionKactus_colaboradoresNomina',
    CONSULTAR_VALOR: 'liquidacion_consultarValorActividadMunicipio',
  },

  PARAMETRIZACION_MATERIALES: {
    LISTAR_EMPRESAS: 'parametros_empresas',
    LISTAR_DEPENDENCIAS: 'parametros_dependencias',
    MATERIALES: 'parametrizacion_materiales',
  },

  PRELIQUIDACION_FACTURACION: {
    LISTAR_EMPRESAS: 'v2/liquidarservicio_consultar_empresascontratantes',
    LISTAR_MUNICIPIOS: 'v2/liquidarservicio_consultar_municipios ',
    LISTAR_ORDENES_COMPLETAS: 'v2/liquidarservicio_consultar_ordenestrabajo',
    LISTAR_LIQUIDACIONES_APLICAR: 'v2/liquidarservicio_consultar_liquidaciones',
    CONSULTAR_LIQUIDACIONES_APLICAR: 'v2/liquidarservicio_consultar_liquidacionservicio',
    CONSULTAR_LIQUIDACIONES_FECHA: 'v2/liquidarservicio_consultar_liquidacionserviciofecha',
    LIQUIDACION_USUARIO: 'v2/liquidarservicio_consultar_liquidacionusuario',
    CAMBIOS_LIQUIDACION_SUSCRIPTOR: 'v2/liquidarservicio_consultar_liquidacioncambiosusuario',
    ELIMINAR_LIQS:'v2/liquidarservicio_consultar_eliminarliqusuario',
    PRELIQUIDAR: 'v2/liquidarservicio_preliquidar',
    CONFIRMAR: 'v2/liquidarservicio_confirmar',
    ELIMINAR: 'v2/liquidarservicio_eliminar',
    EXPORTAR: 'v2/liquidarservicio_exportar',
    EXPORTAR_SERVICIOS: 'v2/liquidarservicio_consultar_exportar',
    GENERAR_REPORTE: 'v2/liquidarservicio_reporte',
    VERIFICAR_PROGRESO: 'v2/liquidarservicio_progreso',
    ACTUALIZAR_LIQUIDACION:'v2/liquidarservicio_consultar_actualizarliqusuario',
    CAMBIO_ESTADO_AUDITORIA:'v2/liquidarservicio_consultar_actualizarestadoauditoria',
  },

  SUCURSALES_MUNICIPIOS: {
    LISTAR_EMPRESAS: 'parametros_empresas',
    HOMOLAGAR_MUNICIPIO: 'parametrizacion_homologacionMunicipios',
    CONSULTAR_HOMOLOGAR_MUNICIPIO: 'parametrizacion_consultarHomologoMunicipio'
  },

  REPORTE_ACTIVIDADES_COLABORADOR: {
    CONSULTAR_ETAPAS: 'v2/reporte_etapas',
    CONSULTAR_SERVICIOS: 'v2/reporte_servicios',
    CONSULTAR_PROYECTOS: 'v2/reporte_proyectos',
    CONSULTAR_ACTIVIDADES: 'v2/reporte_actividades',
    CONSULTAR_CONTRATANTES: 'v2/reporte_contratantes',
    CONSULTAR_CONTRATISTAS: 'v2/reporte_contratistas',
    GENERAR_REPORTE: 'v2/reporte_generar_distribucioncontable',
    CONSULTAR_ACTIVIDADES_COLABORADOR: 'v2/reporte_generar_actividadescolaborador',
    GENERAR_REPORTE_DISTRIBUCION: 'v2/reporte_exportar',
    CONSULTAR_COLABORADORES: 'v2/reporte_colaboradores',
    GENERAR_REPORTE_AGENDAS: 'v2/reporte_agendas',
    NOMINA_GENERAL:'v2/reporte_nomina_actividadescolaborador',
  }
}

export default RUTAS_API
