/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.bioagricola.apirest.liquidacion.web.servicio.utils;

import java.math.BigDecimal;


/**
 * Constantes utilizadas en los servicios.
 * 
 * @author GeneradorCRUD
 */

public class ConstantesServicios {

	// Tipos de datos consumidos o producidos por los servicios
	public static final String APPLICATION_JSON = "application/json";
	public static final String TEXT_PLAIN = "text/plain";

	//Respuestas de servicio genericas
	public static final String RESULTADO_EXITOSO_OPERACION = "Se realizó la operación correctamente";
	public static final String RESULTADO_FALLIDO_OPERACION = "Ocurrio un error al momento de realizar la operación";

	//Respuestas de servicio para cálculo de descuento por indicadores de calidad
	public static final String RESULTADO_FALLIDO_DESC_CALIDAD = "Ocurrió un error con el siguiente número de suscripciones: ";
	public static final String RESULTADO_SIN_REPORTES = "No existen reportes de tarifas para el periodo";

	// Respuestas del servicio de consulta PQR
	public static final String BUSQUEDA_EXITOSA = "Búsqueda exitosa";
	public static final String ERROR_DATOS_PQR = "El código de PQR existe, pero no corresponde a los criterios seleccionados, ¿Desea reemplazarlos?";
	public static final String ERROR_CONSULTA_RESULTADOS = "No se encontraron resultados para la búsqueda";
	public static final String CODIGO_RESPUESTA_EXITOSA = "0";
	public static final String CODIGO_RESPUESTA_FALLIDA = "1";
	public static final String CODIGO_SIN_RESULTADOS = "2";
        public static final String URL_SERVICIO_TOKEN = "http://10.43.51.30:8080";
 
	// Formatos requeridos en conversiones para los servicios
	public static final String TIMESTAMP_FORMAT = "yyyy-MM-dd";

	// Variables de descuento por deshabitado
	public static final String DESHABITADO_RETROACTIVO_DESCRIPCION = "Descuento por deshabitado retroactivo";
	public static final String TARIFA_DESHABITADO_DESCRIPCION = "Tarifa de descuento por deshabitado";
	public static final String DESHABITADO_RETROACTIVO = "concepto_dxd";
	public static final String TARIFA_DESHABITADO = "concepto_dpta_pta";
	public static final String PRIVILEGIO_RETROACTIVO = "dxd_retroactivo_ilimitado";
	public static final String PRIVILEGIO_ILIMITADO_REPORTE = "uni_privilegio_ilimitado_reporte";
	public static final String PERIODO_ILIMITADO_REPORTE = "periodos_privilegio_ilimitado_reporte";
	public static final String PERIODO_LIMITADO_REPORTE = "periodos_privilegio_limitado_reporte";
	public static final String UNIDAD_LIQUIDACION_NOTAS = "LIQUIDACION_NOTAS";
	public static final String CLASE_TIPO_NOTAS = "clase_tipo_nota";
	public static final String CLASE_MOTIVO_NOTA = "clase_motivo_nota";
	public static final String AFAVOR_USUARIO = "afavor_usuario";
	public static final String AFAVOR_EMPRESA = "afavor_empresa";
	public static final String AFAVOR_NOAPLICA = "afavor_noaplica";
	public static final String VISITASOL_ESTDIG = "visitasol_estdig";
	public static final String NOMBRE_ETAPA = "nombre_etapa";
	public static final String NOMBRE_NOVEDAD = "nombre_novedad";
	public static final String PQRS_DEPENDENCIA_SERVICIO = "pqrs_depedencia_servicio";
	public static final String PQRS_NIVEL_SERVICO = "pqrs_nivel_servicio";
	public static final String CICLO_SEMESTRAL_INDICADOR_CALIDAD = "ciclo_semestral_taras_indicador_calidad";
	public static final String MES_APLICACION_INDICADOR = "mes_aplicacion_indicador";
	public static final String UNI_CONCEPTOS_BASE_TONELADAS = "uni_conceptos_base_toneladas";
	public static final String UNI_CONCEPTO_VARIABLE_INDICADOR_CALIDAD_RECOLECCION = "uni_conceptos_variables_indicador_calidad_recoleccion";
	public static final String UNI_CONCEPTO_VARIABLE_INDICADOR_COMPACTACION = "uni_conceptos_variables_indicador_compactacion";
	public static final String UNI_CONCEPTO_VARIABLE_INDICADOR_RECLAMACION = "uni_conceptos_variables_indicador_reclamacion";
	public static final String UNI_CONCEPTO_FACTURA_INDICADOR_CALIDAD_RECOLECCION = "uni_concepto_factura_indicador_calidad_recoleccion";
	public static final String UNI_CONCEPTO_FACTURA_INDICADOR_CALIDAD_COMPACTACION = "uni_concepto_factura_indicador_calidad_compactacion";
	public static final String UNI_CONCEPTO_FACTURA_INDICADOR_CALIDAD_RECLAMACION_ASEO_GAS = "uni_concepto_factura_indicador_calidad_reclamacion_aseo_gas";
	public static final String UNI_CONCEPTO_FACTURA_INDICADOR_CALIDAD_RECLAMACION_ASEO_ENERGIA = "uni_concepto_factura_indicador_calidad_reclamacion_aseo_energia";
	public static final String UNI_CONCEPTO_SUSCRIPCION_RECLAMACION = "uni_concepto_suscripcion_reclamacion";
	public static final String UNI_DOCUMENTO_FACTURA_SERVICIO = "uni_documento_factura_servicio";
	public static final String UNI_CONCEPTO_INTERES_CORRIENTE = "uni_concepto_interes_corriente";
	public static final String NUMERO_PERIODO_INTERES_MORATORIO = "numero_periodos_interes_moratorio";
	public static final String UNI_CONCEPTO_INTERES_MORATORIO = "uni_concepto_interes_moratorio";
	public static final Integer MESES_POR_ANIO = 12;
	public static final String ID_PROGRAMA_PROCESA_INDICADORES_CALIDAD = "id_programa_procesa_indicadores_calidad";
	public static final String UNI_CONCEPTO_ESTRATO = "uni_concepto_estrato";
	public static final String HOLGURA_VIGENCIA_DESDE_NOTAS = "holgura_vigencia_desde_notas";
	public static final String UNI_TIPO_AFORO_ORDINARIO = "uni_tipo_aforo_ordinario";
	public static final String UNI_TIPO_AFORO_EXTRAORDINARIO = "uni_tipo_aforo_extraordinario";
	public static final String UNI_CONCEPTO_AFORO_EXTRAORDINARIO = "uni_concepto_aforo_extraordinario";
	public static final String UNI_AFORO_INDIVIDUAL = "uni_aforo_individual";
	public static final String UNI_AFORO_MULTIUSUARIO = "uni_aforo_multiusuario";
        public static final String LISTA_CONCEPTOS_APLICAR = "lista_conceptos_aplicar";


	public static final Integer FACTOR_PERIODICO_DESCUENTO_RECLAMACION_COMERCIAL = 6;

	//Llaves para consulta de parámetros dentro de un arreglo
	public static final String SEMESTRE = "semestre";
	public static final String MES = "mes";
	public static final String ID_EMPRESA = "idempresa";
	public static final String CONCEPTO = "idconcepto";

	// programas
	public static final int ID_PROGRAMA_DESHABITADO = 712;
	public static final int ID_PROGRAMA_PUERTA_PUERTA = 713;
	public static final int ID_PROGRAMA_CALIDAD = 753;
	public static final int ID_PROGRAMA_ESTRATO = 715;
	public static final int ID_PROGRAMA_TIPO_DE_USO = 716;
	public static final int ID_PROGRAMA_AFORO_EXTRAORDINARIO = 722;
	public static final int ID_PROGRAMA_INCLUSION_ELIMINACION_DEUDA = 758;
	public static final int ID_PROGRAMA_AJUSTES_EMSA = 802;
	public static final int ID_CONCEPTO_AJUSTES_EMSA = 5264;


	public static final String CANTIDAD_DECIMALES = "CANTIDAD_DECIMALES";
	public static final String NUMERO_HILOS_FACTURACION = "NUMERO_HILOS_FACTURACION";
	public static final String PROGRAMA_FACTURAR_PERIODO = "PROGRAMA_FACTURAR_PERIODO";
	public static final String PROGRAMA_MODIFICAR_LECTURAS = "PROGRAMA_MODIFICAR_LECTURAS";

	// Constantes Cosu_consuscrip
	public static final BigDecimal COSU_CANTIDAD = BigDecimal.ONE;
	public static final BigDecimal COSU_VLRUNITARI = BigDecimal.ONE;
	public static final BigDecimal COSU_VLRTOTAL = BigDecimal.ONE;
	public static final String COSU_ESTADO = "A";


	// documentos
	public static final String UNI_DOCUMENTOS_INTERES_MORA = "uni_documentos_interes_mora";
	public static final String UNI_DOCUMENTOS_SALDO_A_FAVOR = "uni_documentos_saldo_a_favor";
        public static final String UNI_DOCUMENTO_FINANCIACION = "uni_documento_financiacion";        
	public static final String UNI_DOCUMENTOS_FACTURA_SERVICIO = "uni_documentos_factura_servicio";

	// Conceptos
	public static final String CON_CONCEPTOS_SUBSIDIO = "subsidio";
	public static final String CON_CONCEPTOS_CONTRIBUCION = "contribucion";
	public static final String CON_CONCEPTOS_REPORTE_CLASIFICACION_CONCEPTO = "reporte_clasificacion_concepto";
	public static final String CON_CONCEPTOS_DESCUENTO_INDICADOR_CALIDAD = "descuento_indicador_calidad";
	public static final String CON_CONCEPTOS_AJUSTES = "ajustes";
	public static final String CON_CONCEPTOS_DESCUENTO_DESCUENTOS_Y_O_DEVOLUCIONES = "descuento_y_o_devoluciones";

	private ConstantesServicios() {
		//Constructor por defecto
	}

}
