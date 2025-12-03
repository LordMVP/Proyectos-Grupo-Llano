const RUTAS_API = {

  MENU: {
    CONSULTAR_MENU: 'global_menu',
  },
  GLOBAL: {
    CONSULTAR_FECHA_ACTUAL: 'global_fechasistema',
    SUBIR_ARCHIVOS: 'global_archivo_adjuntar',
    CONSULTAR_EMPRESAS: 'global_consultar_empresas',
    CONSULTAR_EMPRESAS_USUARIO: 'global/consultar_empresasusuario',
    INICIAR_SESION_TERCERO: 'global/iniciosesion_tercero',
  },
  ALERTAS: {
    CONSULTAR_ALERTAS: 'alertas_consultar',
    EDITAR: 'alertas_editar',
    CONSULTAR_USUARIOS: 'alertas_usuarios_consultar',
    CONSULTAR_DETALLE_ALERTA: 'alertas_detalles_alerta',
    CONSULTAR_NOTIFICACIONES_USUARIO: 'consultar_notificaciones_usuario',
    ACTUALIZAR_ESTADO_NOTIFICACION: 'alertas_notificacion_actualizarestado',
    EJECUTAR_SERVICIO: 'alertas_ejecutar_proceso',
  },
  CONFIGURACION: {
    CONSULTAR_TIPOS: 'configuracion_tipos_consultar',
    REGISTRAR: 'configuracion_guardar',
    CONSULTAR_POR_TIPO: 'configuracion_consultar',
    CONSULTAR_UNIDAD: 'configuracion_consultarunidad',
    CONSULTAR_ESTADOS: 'configuracion_consultarunidadprograma',
    CONSULTAR_UNIDAD_PROGRAMA: 'configuracion_consultarunidadprograma',
    CONSULTAR_TIPOS_MERCADO: 'mercados_consultar',
    CONSULTAR_TRM: 'variables_trm',

    FUENTES_DISTRIBUCION: {
      CONSULTAR_FUENTES_DISTRIBUCION: 'configuracion_fuentedistribucion_consultar',
      GUARDAR_FUENTES_DISTRIBUCION: 'configuracion_fuentedistribucion_guardar'
    },
    RUTAS_GNC: {
      GUARDAR_RUTAS_GNC: 'configuracion_guardarruta'
    }
  },

  VARIABLES: {
    CONSULTAR_VARIABLES: 'generico_variables_consultar',
    CONSULTAR_VARIABLES_FORMULA: 'generico_variables_formula_consultar',
    CONSULTAR_VARIABLES_TIPO: 'variables_categoria_tipo',
    CONSULTAR_ALIAS_VARIABLE: 'variables_consultaralias',
    CONSULTAR_FUNCIONES: 'generico_funciones_consultar',
    CONSULTAR_PROGRAMAS: 'programas_programanominacion',
    CONSULTAR_CATEGORIAS: 'variables_categoria',
    GUARDAR_VARIABLE: 'variables_guardar'
  },

  PARAMETRIZACION: {
    CONSULTAR_HORARIO_ACTIVIDAD: 'contratos_consultar_actividades',
    SUBIR_ARCHIVO_RUTAS_GNC: 'configuracion_guardarmasivo',
    TRAMOS: {
      CONSULTAR_TRAMOS: 'tramos_consultar',
      GUARDAR_TRAMO: 'tramos_guardar',
      SUBIR_ARCHIVO_TRAMOS_MASIVO: 'tramos_guardarmasivo'
    },
    TOP_GRUPAL: {
      CONSULTAR_TOPS_GRUPAL: 'topgrupal_consultar',
      CONSULTAR_CONTRATOS: 'topgrupal_contrato_consultar',
      GUARDAR_TOP_GRUPAL: 'topgrupal_guardar',
    },
    PUNTOS_SALIDA: {
      CONSULTAR_PUNTOS_SALIDA: 'puntosalida_consultar',
      GUARDAR_PUNTOS_SALIDA: 'puntosalida_guardar',
    },
    ACTUALIZAR_PUNTOS_SALIDA: {
      CONSULTAR_PUNTOS_SALIDA: 'pronostico-consumo_consulta_puntos-salida',
    },
    RUTAS_SISTEMA_NAL: {
      CONSULTAR_RUTAS_SISTEMA_NAL: 'ruta_consultar',
      GUARDAR_RUTAS_SISTEMA_NAL: 'ruta_guardar',
      CONSULTAR_TRAMOS_RUTA: 'ruta_tramos_consultar'
    },
    CONVERSOR: {
      //Consulta todas las unidades de media que existen
      CONSULTAR_UNIDADES: 'conversor_consultar',
      //Consulta las unidades de medida para el conversor de unidades
      CONSULTAR_UNIDADES_ORIGEN: 'conversor_unidades_origen',
      CONSULTAR_UNIDADES_CONVERTIR: 'conversor_unidades_convertir',
      CALCULAR: 'conversor_calcular',
      CONSULTAR_UNIDADES: 'conversor_consultar',
      CONVERTIR: 'conversor_convertir'
    },

    REGISTRO_TRM: {
      CONSULTAR_VARIABLES: 'generico_variables_programa',
      CONSULTAR_UNIDADES_MEDIDA: 'parametro_unidadesmedida',
      GUARDAR: 'parametro_guardar',
      CONSULTAR_FECHA: 'global_fechasistema',
      CONSULTAR_TRM_DIAS: 'parametro_trm_dias',
      CONSULTAR_FECHA: 'global_fechasistema'
    },
    GESTION_AGENTES_TERCEROS: {
      CONSULTAR_TERCEROS: 'terceros_consultar_tipo_proveedorcliente',
      CONSULTA_FILTRO_TERCEROS: 'terceros_consultar_filtro',
      GUARDAR_AGENTE_TERCERO: 'terceros_guardar',
      CONSULTAR_TODOS_LOS_CONTACTOS: 'terceros_consultar_tipo_contacto',
      CONSULTAR_CONTACTOS: 'terceros_contactos_consultar',
      CONSULTAR_TIPOS_CONTACTO: 'configuracion_consultarunidad',
    },
    PUNTOS_SALIDA: {
      CONSULTAR_PUNTOS_SALIDA: 'puntosalida_consultar',
      GUARDAR_PUNTOS_SALIDA: 'puntosalida_guardar',
      ACTUALIZAR_PUNTO: 'lectura-diaria_lecturareal',
    },
    MERCADOS_RELEVANTES: {
      CONSULTAR_MERCADOS_RELEVANTES: 'mercados_consultar',
      GUARDAR_MERCADOS_RELEVANTES: 'mercados_guardar'
    },
    RUTAS_GNC: {
      CONSULTAR_RUTAS_GNC: 'ruta_consultar',
      GUARDAR_PUNTOS_SALIDA: 'guardarRuta'
    },
    GESTION_CANTIDAD_CONTRATADA: {
      GUARDAR: 'contratos_editarcantidad',
      CONSULTAR: 'contratos_consultar_historico_cantidad'
    },
    GESTION_CROMATOGRAFIA_TRAMO: {
      CONSULTAR_TRAMOS: 'tramos_consultar',
      CONSULTAR_UNIDAD_MEDIDA: 'configuracion_consultarunidadprograma',
      CONSULTAR_COMPUESTOS: 'generico_variables_programa',
      GUARDAR: 'cromatografia_guardar',
      GUARDAR_MASIVO: 'cromatografia_guarda-masiva',
      CONSULTAR_CROMATOGRAFIA: 'parametro_compuesto_consultar'
    },

    GESTION_PODER_CALORIFICO: {
      CONSULTAR_VARIABLES: 'generico_variables_programa',
      CONSULTAR_UNIDADES_MEDIDA: 'parametro_unidadesmedida',
      CONSULTAR_PUNTOS_ENTRADA: 'configuracion_consultarunidad',
      CONSULTAR_TRAMOS: 'tramos_consultar',
      GUARDAR: 'parametro_podercalorifico_guardar',
    },

    GESTION_DEVOLUCION_SISTEMA: {
      GUARDAR: 'devoluciones_guardar',
      CONSULTAR_PUNTOS_SALIDA: 'puntosalida_consultar',
      CONSULTAR_UNIDAD_MEDIDA: 'configuracion_consultarunidadprograma',
    },

    GESTION_PROYECCION_CONSUMOS: {
      CONSULTAR_PUNTOS_CONSUMO: 'puntos-consumo_reguladonoregulado',
      CONSULTAR_UNIDAD_MEDIDA: 'configuracion_consultarunidadprograma',
      GUARDAR: 'otros-puntos-consumo_proyeccion_guardar',
      GUARDAR_MASIVO: 'otros-puntos-consumo_proyeccion_masivo'
    },

    GESTION_LECTURAS_DIARIAS: {
      GUARDAR_MASIVO: 'lecturaDiaria_guardarLlecturaarchivo',
      GUARDAR_MANUAL: 'lecturaDiaria_guardarlecturamanual',
      CONSULTAR_UNIDAD_MEDIDA: 'configuracion_consultarunidadprograma',
      CONSULTAR_LECTURAS_DIARIAS: 'lecturaDiaria_consultalectura',
      CONSULTAR_LECTURAS_RANGO: 'lectura-diaria_lectura_consultar',
      CERTIFICAR_LECTURAS: 'lectura-diaria_certificar',
    },

    GESTION_OTROS_CONSUMO: {
      GUARDAR: 'otros-puntos-consumo_guardar',
      CONSULTAR_PUNTOS_CONSUMO: 'puntos-consumo_consultar',
      CONSULTAR_UNIDAD_MEDIDA: 'configuracion_consultarunidadprograma',
    },
    GESTION_LECTURAS_CONTRATOS: {
      GUARDAR: 'lecturacontratos_guardar',
      CONSULTAR_RUTAS_CONTRATOS: 'contratos_consultaruta',
      CONSULTAR_UNIDAD_MEDIDA: 'configuracion_consultarunidadprograma',
      CONSULTAR_CONTRATO: 'contratos_consultarGNC',
      CONSULTAR_LECTURA_CONTRATO: 'lectura-diaria_lecturas',
      GENERAR_LECTURA_CONTRATO: 'lectura-diaria_generardocumento',
      CONSULTAR_TERCERO_CONTRATOS: 'terceros_consultar_tipo_contrato',
      GENERAR_MASIVO: 'lecturacontratos_masivo'
    },
    GESTION_MENU: {
      OBTENER_SESION: 'obtener_sesion',
      CERRAR_SESION: 'cerrar_sesion'
    },

    GESTION_EVENTO_EXIMENTE: {
      GENERAR_DOCUMENTO: 'eventoeximente_generarcarta',
      CONSULTAR_UNIDAD_MEDIDA: 'configuracion_consultarunidadprograma',
      CONSULTAR_AGENTE: 'eventoeximente_consultaragente',
      CONSULTAR_CONTRATO_PADRE: 'contratos_consultar_evento',
      CONSULTAR_EVENTOS_EXIMENTES: 'eventoeximente_consultar',
      INACTIVAR_EVENTO: 'eventoeximente_eliminar',
      CONSULTAR_DETALLE_CONTRATO: 'eventoeximente_listas',
      CONSULTAR_CONTRATOS_EVENTO: 'eventoeximente_contratos',
      GUARDAR: 'eventoeximente_guardar',
      CONSULTAR_PUNTOS_CONSUMO: 'eventoeximente_puntos'
    },

    GESTION_DESVIOS: {
      CONSULTAR_RUTA: 'ruta_consultar',
      CONSULTAR_TRAMOS: 'desvios_consultar_tramos',
      CONSULTAR_CONTRATOS: 'desvios_consultar_contratos',
      CONSULTAR_PUNTOS_SALIDA: 'desvios_consultar_puntos_salidaorigen',
      CONSULTAR_PUNTOS_SALIDA_DESTINO: 'desvios_consultar_puntos_salidadestino',
      CONSULTAR_PUNTO_CONSUMO_INICIAL: 'desvios_consultar_punto_consumo_inicial',
      CONSULTAR_PUNTO_CONSUMO_FINAL: 'desvios_consultar_punto_consumo_final',
      CONSULTAR_DESVIOS: 'desvios_consultar',
      GUARDAR: 'desvios_guardar',
    },

    GESTION_PUNTOS_CONSUMO: {
      CONSULTAR_TIPO_CONSUMO: 'puntos-consumo_consultar_tipoconsumo',
      CONSULTAR_MEDIDOR: 'puntos-consumo_consultar_medidor',
      CONSULTAR_PROYECTO: 'puntos-consumo_consultar_proyecto',
      CONSULTAR_CONTRATO_SUMINISTRO: 'puntosconsumo_consultar_contrato_suministro',
      CONSULTAR_PUNTOS_CONSUMO_PARTICULAR: 'puntosconsumo_consultar_puntoconsumo',
      CONSULTAR_CONTRATO_TRANSPORTE: 'puntosconsumo_consultar_contrato_transporte',
      CONSULTAR_PUNTOS_CONSUMO: 'puntos-consumo_consultar',
      CONSULTAR_TERCEROS: 'terceros_consultar_tipo_cliente',
      CONSULTAR_PUNTO_SALIDA: 'puntosalida_consultar',
      CONSULTAR_PUNTOS_CONSUMO_LECTURA: 'puntos-consumo_consultar_lectura',
      CONSULTAR_UNIDAD_MEDIDA: 'puntos-consumo_consultar_unidad-medida',
      GUARDAR: 'puntos-consumo_guardar',
      CONSULTAR_PUNTOS_BALANCE: 'puntos-consumo_cuentabalance',
      CONSULTAR_PUNTOS_CONTRATOS: 'puntos-consumo_porcontrato'
    },

    GESTION_MEDIDOR_SUMINISTRO: {
      CONSULTAR_MEDIDOR_SUMINISTRO: 'suministros_consultamedidores',
      GUARDAR_MEDIDOR_SUMINISTRO: 'suministros_guardar',
      CONSULTAR_CONTRATOS: 'suministros_contratos_consultaProveedor',
      CONSULTAR: 'suministros_consultamedidoresdisponible',
      ELIMINAR: 'suministros_eliminar'
    },

    GESTION_INGRESO_COMPRESIONES: {
      GUARDAR: 'puntos-consumo-compresion_guardar',
      CONSULTAR_PUNTO_COMPRESION: 'puntos-consumo_consultar_puntocompresion',
      CONSULTAR_UNIDAD_MEDIDA: 'puntos-consumo-compresion_consultar_medida',
      CONSULTAR_COMPRESIONES: 'puntos-consumo-compresion_consultar',
      CONSULTAR_MUNICIPIO: 'puntos-consumo_consultar_ubicacion',
      CONSULTAR_COMPRESIONES_FECHA: 'puntos-consumo-compresion_consultarfecha'
    },

    GESTION_CALCULAR_TAKE_OR_PAY: {
      GENERAR_DOCUMENTO: 'takeorpay_generardocumento',
      CONSULTA_TAKE_OR_PAY: 'topgrupal_consultar',
      CONSULTAR_CONTRATOS: 'takeorpay_consultar',
      GUARDAR: 'takeorpay_guardar',
    },

    HORARIOS_ACTIVIDADES: {
      CONSULTAR_ACTIVIDADES: 'actividades_consultar',
      GUARDAR: 'actividades_guardar',
      EDITAR: 'actividades_editar',
      ELIMINAR_ACTIVIDAD: 'actividades_eliminar ',
    },

    GESTION_GESTOR_MERCADOS: {
      GUARDAR: 'reportes_guardar_reporte-gestor-configurado',
      CONSULTAR_CAMPOS: 'reportes_configuracion-reporte-gestor',
      CONSULTAR_CONTRATOS: 'reportes_contratosgestor',
      GENERAR_ARCHIVO: 'reportes_generarcsv',
      CONSULTAR_REPORTES: 'reportes_reportes-configurados-gestor',
    },

    GESTION_PAGO_PREPAGO: {
      CONSULTAR_ANTICIPO: 'registro-prepago_consulta-consecutivo',
      CONSULTAR_CONTRATOS: 'registro-prepago_consulta-contrato-saldo',
      CONSULTAR_RECAUDOS: 'registro-prepago_consulta-recaudos',
      GUARDAR: 'registro-prepago_guardar-recaudo',
      CONSULTAR_DETALLES: 'registro-prepago_consulta-recaudos_detalle',
      ELIMINAR_RECAUDO: 'registro-prepago_eliminar-recaudo'
    },

    INFORMACION_FACTURACION: {
      CONSULTAR_TIPO_USUARIO: 'facturacion_consultar_tipousuario',
      CONSULTAR_RANGO: 'facturacion_consultar_rango',
      CONSULTAR_PUNTOS_CONSUMO: 'puntos-consumo_consultar',
      CONSULTA_INFORMACION_PRISMA: 'facturacion_calcular',
    },

    GESTION_CONSUMO_SIN_TAKE_OR_PAY: {
      GUARDAR: 'edssintakeorpay_guardar',
      CONSULTAR_CONTRATOS_CALCULO: 'edssintakeorpay_consultar',
      CONSULTAR_CONTRATOS: 'contratos_consulta',
    },
    GESTION_INGRESO_NOMINACIONES: {
      CONSULTAR_ACTIVIDADES: 'nominacion_consultar_actividades',
      CONSULTAR_PUNTOS_CONSUMO: 'puntosconsumo_consultar_contrato',
      CONSULTAR_CAPACIDAD_MAXIMA_NOMINACION: 'nominacion_consultar_capacidad_maxima_nominacion',
      CONSULTAR_CAPACIDAD_MAXIMA_RENOMINACION: 'nominacion_consultar_capacidad_maxima_renominacion',
      CONSULTAR_POR_FECHA: 'nominacion_porfecha',
      GUARDAR: 'nominacion_guardar',
    },
    GESTION_ACTUALIZAR_PRECIO: {
      CONSULTAR_HISTORICO: 'contratos_consultarhistorico',
      EDITAR_CONTRATO: 'contratos_editarcontratognc',
    },
    GESTION_PRONOSTICO_CONSUMO: {
      CONSULTAR_PRONOSTICOS: 'pronostico-consumo_consultar_pronostico-periodo',
      GENERAR_NOMINACIONES_SUGERIDA: 'pronostico-consumo_nominacion',
      CONSULTAR_CALENDARIOS: 'pronostico-consumo_consulta_calendario-empresa',
      CONSULTAR_VALORES_PUNTO_CONSUMO: 'pronostico-consumo_consultar_configuracion_puntoconsumo',
      CONSULTAR_PUNTOS_CONSUMO: 'pronostico-consumo_consulta_puntos-consumo',
      ELIMINAR_DIA: 'pronostico-consumo_calendario_eliminar',
      GUARDAR: 'pronostico-consumo_guardar_calendario',
    },
    GESTION_CUENTA_BALANCE: {
      CONSULTAR_TRAMOS: 'crucecuentas_consultar_tramos',
      CONSULTAR_CRUCE: 'crucecuentas_consultar_puntossalida',
      GUARDAR: 'crucecuentas_guardar',
      GENERAR_DOCUMENTO: 'crucecuentas_generardocumento',
    },
    GESTION_APROBACION_CUENTA_BALANCE: {
      CONSULTAR_PUNTOS_POSITIVOS_PENDIENTES: 'crucecuentas_puntopositivos_pendientes',
      CONSULTAR_PUNTOS_NEGATIVOS_PENDIENTES: 'crucecuentas_puntonegativo_pendientes',
      CALCULO: 'crucecuentas_total-servicio',
      REPORTE_PROVISION: 'crucecuentas_reporte_frontprovision',
      ACTUALIZAR_PUNTO: 'crucecuentas_puntopositivos_actualizar',
      CONSULTAR_PUNTOS: 'crucecuentas_consultar_estado',
    },
    GESTION_REVISION_FACTURAS: {
      CONSULTAR_PUNTOS_SALIDA: 'revisionfactura_puntosalida_consultar',
      CALCULAR: 'revisionfactura_liquidar',
      CONSULTAR_DETALLE: 'revisionfactura_puntosalida_detalle',
      GUARDAR: 'revisionfactura_guardar',
      CONSULTAR_REVISION: 'revisionfactura_consultar',
      CONSULTAR_REVISION_DETALLE: 'revisionfactura_consultar_detalle',
      //DISPERCION
      DISPERCION: {
        CALCULAR: 'revisionfactura_dispersion_liquidar',
        GUARDAR: 'revisionfactura_dispersion_guardar',
        CONSULTAR: 'revisionfactura_dispersion_consultar',
        CONSULTAR_DETALLE: 'revisionfactura_dispersion_detalle'
      }
    },
    GESTION_CALCULO_NOMINACION: {
      GUARDAR: 'nominacionproveedor_guardar',
      PROCESAR_NOMINACION: 'nominacionproveedor_procesar',
      CONSULTAR_EXISTENTE: 'nominacionproveedor_consultar',
      APROBAR_NOMINACION: 'nominacionproveedor_aprobar',
      UNIDADES_SUMINISTRO: 'nominacionproveedor_suministrounidadmedida'
    },
    GESTION_LIQUIDACION_FACTURAS_TRANSPORTE_KPC: {
      CONSULTAR_SALDOS: 'registro-prepago_consulta_recaudoconsaldo',
      CONSULTAR_DETALLES: 'facturakpc_consultar_detalle',
      LIQUIDAR: 'facturakpc_liquidar',
      GUARDAR: 'facturakpc_guardar',
      CONSULTAR_LIQUIDACION: 'facturakpc_consultar',
      CONSULTAR_DETALLE_LIQUIDACION: 'facturakpc_consultar_liquidaciondetalle',
      APROBAR: 'facturakpc_aprobar'
    },
    UNIDADES_MEDIDA: {
      CONSULTAR_UNIDAD: 'configuracion_consultarunidad',
      CONSULTAR_POR_ESTRUCTURA: 'configuracion_unidadporestructura',
    },
    GESTION_LIQUIDACION_CUENTA_BALANCE: {
      LIQUIDAR: 'compensacion-balance_liquidar',
      GUARDAR: 'compensacion-balance_guardar',
    },
    GESTION_LIQUIDACION_CONTRATOS_GNC_Y_CONEXION: {
      CONSULTAR_LECTURAS_CONSUMO: 'liquidar_contratosgncyconexion_consumoscontratos',
      CONSULTAR_RUTAS: 'liquidar_contratosgncyconexion_consultar_rutagnc',
      CALCULO: 'liquidar_contratosgncyconexion_calculo',
      GUARDAR: 'liquidar_contratosgncyconexion_guardar',
      GENERAR_DOCUMENTO: 'liquidar_contratosgncyconexion_generardocumento',
    },
    RELIQUIDACION_TRANSPORTE: {
      CONSULTAR_DATOS_TERCERO: 'reliquidartransporte_consultartercero',
      GUARDAR: 'reliquidartransporte_modificarcargos',
    },
    GESTION_LIQUIDACION_FACTURAS_SUMINISTRO_NEGOCIACION_DIRECTA: {
      CONSULTAR_LIQUIDACION: 'facturasuministro_consultar',
      CONSULTAR_DETALLE: 'facturasuministro_consultar_detalle',
      VALIDAR_CONTRATOS: 'facturasuministro_contrato_validar',
      GUARDAR: 'facturasuministro_guardar',
      CONSULTAR_CONTRATOS_PADRE: 'facturasuministro_contrato_compra',
      LIQUIDAR: 'facturasuministro_liquidar',
      ACTUALIZAR: 'facturasuministro_actualizar'
    },
    CALCULO_VOLUMEN: {
      TRAMOS_CONSULTAR: 'tramos_consultar',
      CALCULAR: 'volumen-tuberia_calcular',
      CONSULTAR_PATM: 'volumen-tuberia_consultar_patm'
    },
    LIQUIDACION_CUSIANA: {
      LIQUIDAR: 'cusiana_facturar',
      RELIQUIDAR: 'cusiana_reliquidar',
      GUARDAR: '',
      CONSULTAR: 'cusiana_consultar',
      CONSULTAR_DETALLE: 'cusiana_consultar_detalle'
    }
  },
  CUENTA_BALANCE: {
    CONSULTAR: 'cuentabalance_consultar',
    GUARDAR: 'cuentabalance_guardar',
    RECALCULAR: 'cuentabalance_recalcular'
  },

  CRUCE_CUENTA_BALANCE: {
    CONSULTAR_PUNTOS_POSITIVOS: 'crucecuentas_puntopositivos',
    CONSULTAR_PUNTOS_NEGATIVOS: 'crucecuentas_puntonegativo',
    APROBAR: 'crucecuentas_aprobar',
    RECHAZAR: 'crucecuentas_rechazar',
    GUARDAR: 'crucecuentas_guardar',
    CONSULTAR_PUNTOS_POSITIVOS_FILTRO: 'crucecuentas_filtro_puntopositivos',
    CONSULTAR: 'crucecuentas_consultar',
    CONSULTAR_DETALLE: 'crucecuentas_detalle',
    CONSULTAR_TRM: 'crucecuentas_trm_ultimodia',
    CONSULTAR_TRM_TRIMESTRE: 'crucecuentas_trm_promediotrimestre',
    CALCULAR_PUNTO_PROVISION: 'crucecuentas_provisionar',
    CAMBIAR_ESTADO: 'crucecuentas_provisionar_actualizar',
    GUARDAR_PROVISION: 'crucecuentas_provisionar_guardar',
    CONSULTAR_PUNTOS_SALIDA_PROVISION: 'crucecuentas_provisionar_puntosalidalibres',
    CONSULTAR_PROVISION: 'crucecuentas_provisionar_consultar'
  },

  CONTRATOS: {
    GUARDAR: 'contratos_guardar',
    GUARDAR_BORRADOR: 'contratos_guardartemporal',
    SUBIR_ARCHIVOS: 'global_archivo_adjuntar',
    DESCARGAR_ARCHIVO: 'global_archivo_consultar',
    CONSULTAR_CONTRATOS: 'contratos_consulta',
    CONSULTAR_DETALLE_CONTRATO: 'contratos_consultardetalle',
    CONSULTAR_CONTRATO_TEMPORAL: 'contratos_consultartemporal',
    ACTUALIZAR_ESTADO_CONTRATO: 'contratos_editarestado',
    FINALIZAR_CONTRATO: 'contratos_editarestado',
    CONSULTAR_VALOR_CRUCE_CUENTA: 'contratos_consultar_saldo',
    CONSULTAR_HISTORICO_GARANTIA: 'contratos_garantia_historico',
    CONSULTAR_CONSTATE: 'contratos_consultar_constante',
    DESCARGAR_ACTA:'contratos_reporte_actafinalizacion'
  },
  CALCULO_INDICE_PERDIDAS: {
    APROBAR_INDICE: 'indiceperdida_aprobar',
    CONSULTAR_INDICE_PERDIDAS: 'indiceperdida_consultar',
    CONSULTAR_PUNTOS_SALIDA: 'indiceperdida_puntosalida_consultar',
    PROCESAR_INDICE: 'indiceperdida_procesar'
  },
  COMPENSACION_CUENTA_BALANCE: {
    LIQUIDAR: 'compensacion-balance_liquidar',
    GUARDAR: 'compensacion-balance_guardar',
    CONSULTAR: 'compensacion-balance_consultar',
    ACTUALIZAR: 'compensacion-balance_actualizar',
    CONSULTAR_VALORES: 'compensacion-balance_consultar_gmtm'
  },
  GESTION_REPORTES: {
    LISTAR_REPORTES: 'reporte_generico_listar',
    GENERAR_REPORTE: 'reporte_generico_generar',
    CONSULTA_PREVISUALIZAR: 'reporte_generico_previsualizar',
    REPORTE_PODER_CALORIFICO: {
      GENERAR_REPORTE: 'reportes_podercalorifico'
    }
  },
  NOCOM: {
    REPORTES: {
      INFORMEACION_OPERATIVA: "reporte_informacion-operativa",
      LIQUIDACION_EDS: "reporte_liquidacion-eds",
      MEDICION_EDS_ATR: "reporte_medicion-eds-atr",
      REPORTE_COMPRESION_DISTRIBUCION: "reporte_compresion-distribucion",
    },
  },
};

export default RUTAS_API;
