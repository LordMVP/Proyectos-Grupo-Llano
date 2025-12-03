<?php

define("CLAVE_CIFRADO", "%Gell2019%.");
define("C_ESTADO_SUSPENSIONES", serialize(array('G' => 'Generada', 'E' => 'Ejecutada', 'C' => 'Cancelada', 'D' => 'Detenida', 'P' => 'Procesada')));
define("COD_MOTIVOS", 13);
define("COD_MOTIVOS_RECONEXIONES", 5);
define("COD_REDIRECCIONAR", -2);
define("COD_CONTINUAR", 1);
define("COD_CONCEPTOS", 6);
define("COD_NOVEDADES_SUSP", 11);
define("COD_NOVEDADES_RECO", 12);
define("COD_TIPOS_SUSPENSION", 14);
define("C_ESTADO_SUSP_RECO", serialize(array('E' => 'Ejecutada', 'T' => 'Tramite', 'C' => 'Cancelada')));
define("C_PAGOS", 11);
define("C_ABONOS", 12);
define("C_ANTICIPOS", 13);
define("C_CONTROL_CONSECUTIVO_VENTAS_TIPDOCUMENTO", 0);

//define("C_CARTERA_CASTIGADA", 14);
//Procesos en segundo plano
define("COD_PROCESO_APLICAR_RECAUDOS", 27);
define("COD_PROCESO_CERRAR_RECAUDOS", 28);
define("COD_PROCESO_SUSPENSIONES", 38);
define("COD_PROCESO_RECONEXIONES", 72);
define("COD_PROCESO_CERRAR_SYR", 60);
define("COD_PROCESO_MOVIMIENTOS_CONTABLES", 46); //41
define("COD_PROCESO_CARTERA_CASTIGADA", 41);

//Programas
define('PROGRAMA_FINANCIACION_EXTERNA', 486);
define("PROGRAMA_FACTURAR_FINANCIACION", 29);
define("PROGRAMA_FACTURAR_INTERESES_MORA", 8);
define("PROGRAMA_PROVISIONES", 29);
define('PROGRAMA_ABONOS_ID', 12);
define('PROGRAMA_PAGOS_ID', 11);
define('PROGRAMA_ANTICIPOS_ID', 13);
define('PROGRAMA_REGISTRO_RAPIDO', 62);
define('PROGRAMA_CONSIGNACIONES_ID', 47);
define('PROGRAMA_CARTERA_CASTIGADA_ID', 14);
define('PROGRAMA_PROCESO_CARTERA_CASTIGADA_ID', 41);
define("PROGRAMA_MODIFICACION_RECAUDO", 65);
define("PROGRAMA_FINANCIACION", 23);
define("PROGRAMA_REUNIFICARFINANCIACION", 39);
define('PROGRAMA_SUSCRIPCIONES', 20);
define('PROGRAMA_CONCEPTOS', 5);
define('PROGRAMA_CONTABILIZAR_CONCEPTOS', 73);
define('PROGRAMA_VENTAS', 18);
define('PROGRAMA_VENTAS_FINANCIACION', 69);
define('PROGRAMA_CARGAR_RECAUDOS', 75);
define('PROGRAMA_FACTURAR_PERIODO', 6);
define('PROGRAMA_NOTA_DIRECTA', 22);
define('PROGRAMA_NOTA_CALCULADA', 135);
define('PROGRAMA_NOTAS_TIPO_USO', 82);
define('PROGRAMA_SEGUIMIENTO_SUSCRIPCION', 63);
define('PROGRAMA_MOVIMIENTO_CONTABLE', 46);
define('PROGRAMA_GESTIONAR_LIQUIDACION', 59);
define('PROGRAMA_LECTURAS', 57);
//define('PROGRAMA_MODIFICAR_LECTURAS', 57);
define('PROGRAMA_GENERAR_GESTION_CARTERA', 36);
define('PROGRAMA_GESTION_CARTERA', 26);
define('PROGRAMA_CONDONAR_CARTERA_CORRIENTE', 76);
define('UNIDAD_PROGRAMA_INTERES_MORA', 2564);
define('UNIDAD_PROGRAMA_INTERES_CORRIENTE', 2565);
define('PROGRAMA_CONDONAR_CARTERA_CASTIGADA', 77);
define('PROGRAMA_REGISTRO_RAPIDO_SUSPENSIONES', 61);
define('PROGRAMA_MODIFICAR_LECTURAS', 132);
define('PROGRAMA_IMPORTAR_FACTURA_BIO_ACE', 78);
define('PROGRAMA_NOTA_RECLAMACION', 165);
define('PROGRAMA_PROCESO_SUSPENCIONES', 38);
define('PROGRAMA_PROCESO_RECONEXIONES', 72);
define('PROGRAMA_SUSPENCIONES_UNO_A_UNO', 16);
define("PROGRAMA_FINANCIA_EMERGENCIA", 677);
define('PROGRAMA_CARGAR_FIN_ESP_BIO', 529 );
define('PROGRAMA_ACT_FIN_ESP_BIO', 581 );
define('PROGRAMA_APLCV_FIN_ESP_BIO', 586 );
define('PROGRAMA_PAG_FIN_ESP_BIO', 587 );
define('PROGRAMA_APR_FIN_ESP_BIO', 590 );
define('PROGRAMA_GEN_INF_APR_FIN_ESP_BIO', 697 );
define('PROGRAMA_GEN_AMORT_FIN_ESP_BIO', 591 );
define('PROGRAMA_MODIFICAR_SUSCRIPCIONES', 70);
define('PROGRAMA_PROYECTO_CONSTRUCTORA', 48);
define('PROGRAMA_FIRMA_INSTALADORA', 25);

/* Codigos de Empresas */
define('CODIGO_ACESEGUROS', 300);
define('CODIGO_SERFULLANOS', 301);
define('CODIGO_BIOAGRICOLA', 317);

define("PORCENTAJE_PROVISION", 0.33);


define('PROGRAMA_REGISTRO_APROBACION_CREDITO', 122);
define('PROGRAMA_REGISTRO_VALIDACION_CREDITO', 123);
define('PROGRAMA_REGISTRO_DESEMBOLSO_CREDITO', 124);
define('PROGRAMA_REGISTRO_SCORING', 125);

//Rutas de directorios
define("RUTA_PRINCIPAL", __DIR__);
define('RUTA_ARCHIVOS', RUTA_PRINCIPAL . '/app/archivos/');
define("RUTA_ARCHIVOS_WEB", '/achagua/sistema/app/archivos/');

//Clases
define('CLA_TIPO_USO_SUSCRIPCION', 2);
define('CLA_TIPO_AFECTACION', 43);
define('CLA_PARENTESCO', 24);
define('CLA_DOCUMENTO', 7);
define('CLA_ACTIVIDAD_ECONOMICA', 35);
define('CLA_CONCEPTO_GRAL_SUSCRIP', 46);

//Estructuras
define('ESTRUCTURA_NOTA', 19);


//Parametrización consultas y procesos
define("PAGINACION", 30);
define("NUMERO_HILOS_FACTURACION", 30);
define("NUMERO_HILOS_FACTURACION_FINANCIACION", 20);
define("NUMERO_HILOS_NOTAS_AUTOMATICAS_DIRECTA", 1);
define("NUMERO_HILOS_NOTAS_AUTOMATICAS_CALCULADA", 1);
define("NUMERO_HILOS_NOTAS_RECLAMACION", 1);
//define("NUMERO_HILOS_NOTAS_AUTOMATICAS_CALCULADA", 1);
define("NUMERO_HILOS_CARGAR_RECAUDOS", 15);
define("MAXIMO_PAGO_CARGUE_RECAUDOS", 10000000000000);
define("NUMERO_HILOS_INTERES_MORA", 20);
define("CANTIDAD_DECIMALES", 7);
define("NUMERO_REUNIFICACIONESPERMITIDAS", 3);
define("NUMERO_REESTRUCTURACIONESPERMITIDAS", 3);
define("NUMERO_HILOS_CARGAR_IMPORTAR_FACTURA", 10);
define("NUMERO_HILOS_FINANCIA_EMERGENCIA", 20);
define("NUMERO_HILOS_FIN_EMER_BIO", 20);
define("NUMERO_HILOS_FIN_ACT_EMER_BIO", 5);
define("NUMERO_HILOS_CV_DXD_EMER_BIO", 5);
define("NUMERO_HILOS_PAG_FIN_EMER_BIO", 10);
define("NUMERO_HILOS_GEN_INF_APR_BIO", 1);
define("NUMERO_HILOS_GEN_AMOT_BIO", 10);
define("VAL_MIN_FINANCIAR", 5000);
define("CAM_CUOTAS_MAX", 36);

//Unidad 
define('UNIDAD_TERCEROS', 283);
define('UNIDAD_ORGANISMOSINSPECCION', 336);
define('UNIDAD_FINANCIACION', 184);
define('UNIDAD_DOCUMENTO_PAGO', 322);
define('UNIDAD_TERCEROS_SYR', 285);
define('UNIDAD_TERCEROS_CONSTRUCTORAS', 282);
define('UNIDAD_TERCEROS_FIRMASINSTALADORAS', 281);
define('UNIDAD_FORMA_PAGO_EFECTIVO', 75);
define('UNIDAD_RECUPERAR_PROVISION', 335);
define('UNIDAD_CONDONACION', 337);
define('UNIDAD_CONSULTAR_TERCEROS_LECTURAS', 314);
define('UNIDAD_CONSULAR_BANCOS', 280);
define('UNIDAD_FACTURAS_PROVISION', 31);
define('UNIDAD_FACTURAS_RECLASIFICACION', 243);
define('UNIDAD_NOTIVO_NOTA_OTROS', 322);
define('UNIDAD_PERMISO_GRABAR_CONSTRUCTORA', 1368);
define('UNIDAD_PERMISO_GRABAR_FIRMAINSTALADORA', 1367);
define('UNIDAD_NOTA_CONDONA_FACTURA_CORRIENTE', 170);


//pARAMETROS DE LECTURAS
define('PARAMETRO_DESVIACION', 0.67);


define('TIPO_DOCUMENTO_PAGARE_VENTA', 'PF');


//Ruta Clase funciones conceptos
define('CLASE_FUNCIONES_CONCEPTOS', 'Llanogas\LlanogasBundle\Delegado\FuncionesConceptosDelegado');

//ruta de web services 

define('PROCESO_EXPORTAR_CONTABILIZACION', 80);
define('WEB_SERVICE_CONTABILIDAD', 'http://10.43.51.23/Seven/webServices40/SCnMcont.asmx?WSDL');
define('WEB_SERVICE_CONSIGNACIONES', 'http://10.43.51.23/Seven/webServices40/STsConsd.asmx?WSDL');
define('WEB_SERVICE_CAJA', 'http://10.43.51.23/Seven/webServices40/STsNcaja.asmx?WSDL');
define('WEB_SERVICE_RECAUDO', 'http://10.43.51.23/Seven/webServices40/WTsRecad.asmx?WSDL');
define('WEB_SERVICE_TERCEROS', 'http://10.43.51.23/Seven/webservices40/SIeWssec.asmx?WSDL');
define('WEB_SERVICE_FACTURA_CLIENTE', 'http://10.43.51.23/Seven/webServices40/SFaFactu.asmx?WSDL');
define('WEB_SERVICE_FACTURA_PROVEEDOR', 'http://10.43.51.23/Seven/webServices40/SPoFactu.asmx?WSDL');
define('URL_WSFINANCIACION_SEVEN', 'http://localhost:8080/wsfinanciacion/seven/contrato/consultar');




//Parametros Servicio de reportes
//define("WEB_SERVICE_JASPER_REPORT", "http://localhost:8080/JasperBridge-1.0-SNAPSHOT/ws/jasper/json");
define("WEB_SERVICE_JASPER_REPORT", "http://10.43.51.150/JasperBridge-1.0-SNAPSHOT/ws/jasper/json");
define("WEB_SERVICE_GATEWAY_REPORT", "http://10.43.51.150/JasperBridge-1.0-SNAPSHOT/ws/gateway/save");
//define("WEB_SERVICE_JASPER_REPORT", "http://localhost:8080/JasperBridge-1.0-SNAPSHOT/ws/jasper/json"); //
//define("WEB_SERVICE_GATEWAY_REPORT", "http://localhost:8080/JasperBridge-1.0-SNAPSHOT/ws/gateway/save");
//define("JASPER_REPORTS_JNDI", "java:/PoolDesarrollo");
define("JASPER_REPORTS_JNDI", "java:/PoolLlano68"); //
define("JASPER_REPORTS_JNDI_POTENZA", "java:/PoolPotenza");
define("JASPER_REPORTS_PATH", "/var/www/html/ReportesAchagua/");
//define("JASPER_REPORTS_PATH", "C:/Users/Admin/JaspersoftWorkspace/MyReports/Recaudo/");
//define("JASPER_REPORTS_PATH", "C:/Users/Admin/JaspersoftWorkspace/MyReports/Recaudo/");
//define("EXCEL_REPORTS_PATH", "C:/Users/Admin/JaspersoftWorkspace/MyReports/Recaudo/");
//define("JASPER_REPORTS_PATH","C:\\Users\\jpsierra\\JaspersoftWorkspace\\LlanoTest\\");
//$PARAMETERS = array("PRG_STR_PATH_IMAGES" => JASPER_REPORTS_PATH . "/images");
$PARAMETERS = array();
define("DEFAULT_JASPER_REPORT_PARAMETERS", serialize($PARAMETERS));

//Codigo Programa Generacion Archivo Plano Fes
define('CODIGO_PROGRAMA_FES_GENERACION_PLANO', 83);
define('CODIGO_PROGRAMA_FES_PROCESO_CARGA', 85);
define('NUMERO_HILOS_GENERAPLANOFES', 20);

// Ambiente de Desarrollo
//define('RUTA_ARCHIVO_PLANO_FES',  '/home/www/html/achagua/sistema/app/fes');
//define('RUTA_PUBLICACION_PLANO_FES_BD', 'http://10.43.16.2/achagua/sistema/app/fes');
//define('RUTA_PUBLICACION_PLANO_FES_WEB', 'http://10.43.16.2/achagua/sistema/app/fes');
// Ambiente de Producción 
define('RUTA_ARCHIVO_PLANO_FES', '/var/www/html/achagua/sistema/app/fes');
define('RUTA_PUBLICACION_PLANO_FES_BD', 'http://10.43.51.9/achagua/sistema/app/fes');
define('RUTA_PUBLICACION_PLANO_FES_WEB', 'http://10.43.51.8/achagua/sistema/app/fes');
define('RUTA_ARCHIVO_PLANO_CONTACTO', '/var/www/html/achagua/sistema/app/contacto');
define('RUTA_PUBLICACION_PLANO_CONTACTO', 'http://10.43.51.9/achagua/sistema/app/contacto');
define('CODIGO_PROGRAMA_PLANO_CONTACTO', 664);

//Codigo Programa Amortizacion Proyectos Constructoras 
define('CODIGO_PROGRAMA_GENERAR_AMORTIZACION_CONSTRUCTORAS', 55);

//Ruta Publicación Webservice Java Procesa INformacion FES 
define('URL_WEBSERVICE_FES_COMERCIAL', 'http://10.43.51.150/AchaguaServices/webresources/iniciaActualizacionFesComercial');


//Error de sintaxis del interpreteXml
define('ERROR_SYNTAX_XML_PARSER', 140);
define('XML_ERROR_INVALID_SYNTAX', 64);
define('ERROR_INVALID_SYNTAX_XML', 76);

//Recaudadores Externos
define('RECAUDADOR_COTREM', 165);
define('RECAUDADOR_CONSUERTE', 183);
define('RECAUDADOR_ATH', 166);
define('RECAUDADOR_BANCOPOPULAR', 79);
define('RECAUDADOR_REDMULTICOLOR', 164);
define('RECAUDADOR_BANCOBOGOTA', 250);
define('RECAUDADOR_COLPATRIA', 502);
define('RECAUDADOR_CONAPUESTAS', 503);
define('RECAUDADOR_ATHBARRAS', 504);
define('RECAUDADOR_DAVIVIENDA', 505);
define('RECAUDADOR_GANE', 503); //Se modifica 503 por 799 ya que gane y conapuestas es el mismo
define('RECAUDADOR_BIOAGRICOLA', 196);
define('RECAUDADOR_LIBRANZA_LLANOGAS', 1185);
define('RECAUDADOR_LIBRANZA_BIOAGRICOLA', 1186);
define('RECAUDADOR_LIBRANZA_CUSIANA', 1187);
define('RECAUDADOR_LIBRANZA_ALIS', 1188);
define('RECAUDADOR_LIBRANZA_ACCIONES', 1189);
define('RECAUDADOR_LIBRANZA_POTENZA', 1190);
define('RECAUDADOR_EMPRESARIAL_CUSIANA', 1191);
define('RECAUDADOR_EMPRESARIAL_LLANO', 1192);
define('RECAUDADOR_EFECTY', 1211);
define('RECAUDADOR_LIBRANZA_CONVBOGOTA', 1337);
define('RECAUDADOR_EMSA', 3980);
define('RECAUDADOR_WERE', 3042);
define('RECAUDADOR_APACHE_POTENZA', 1307);
define('RECAUDADOR_SCOTIABANK', 3624);
define('RECAUDADOR_AVALPAYCENTER', 4635);
define('RECAUDADOR_REDMULTICOLOR_41', 4643);
define('RECAUDADOR_ATH074', 4637);
define('RECAUDADOR_ATH1237', 4636);
define('RECAUDADOR_ATH10081', 4638);
define('RECAUDADOR_ATH11181', 4639);
define('RECAUDADOR_RECOFICINA', 4640);
define('RECAUDADOR_CONVC001', 4641);
define('RECAUDADOR_CONVC99RBM', 4642);
define('RECAUDADOR_CONVC41RBM', 4643);
define('RECAUDADOR_CONVCEFC20', 4644);
define('RECAUDADOR_COLPAINT', 4645);
define('RECAUDADOR_CONSUC2', 4646);
define('RECAUDADOR_DAVIVCM', 4647);
define('RECAUDADOR_BOGOTCM', 4648);
define('RECAUDADOR_RECAUDO_OFICINA', 4640);

/* * *****************************POTENZA***************************************** */
define('LLANOGAS_IDPROYCTO', 322);
define('CUSIANAGAS_IDPROYECTO', 319);
define('POTENZA_IDPROYCTO', 325);

//ESTRUCTURAS
//define('ESTRUCTURA_NIVELEDUCATIVO', 39);
//define('ESTRUCTURA_ESTADOCIVIL', 38);
define('ESTRUCTURA_DESTINOCREDITO', 37);
//define('ESTRUCTURA_PARENTESCO', 32);
//define('ESTRUCTURA_PROFESIONES', 40);
//define('ESTRUCTURA_TIPOACTIVOS', 47);
//define('ESTRUCTURA_TIPOVIVIENDA', 41);
//define('ESTRUCTURA_ENVIOCORRESPONDECIA', 42);
//define('ESTRUCTURA_ACTIVIDADECONOMICA', 44);
//define('ESTRUCTURA_TIPOCARGO', 45);
//define('ESTRUCTURA_TIPOCONTRATO', 46);
//define('ESTRUCTURA_EXPERIENCIAFINANCIERA', 17);
define('ESTRUCTURA_MOTIVO_APROBACION', 50);
define('ESTRUCTURA_MOTIVO_RECHAZO', 49);
define('ESTRUCTURA_VARIABLES_CREDITO', 43);
define('ESTRUCTURA_TERCEROS', 5);
define('ESTRUCTURA_ETAPACREDITO', 36);
define('ESTRUCTURA_CONCEPTOS_CREDITOS', 51);
define('ESTRUCTURA_LIQUIDACION_CREDITOS', 52);
define('ESTRUCTURA_TIPOIDENTIFICACION', 53);
define('ESTRUCTURA_TIPOSUSCRIPCIONBIO', 24);
define('ESTRUCTURA_UNIDAD_TIPOSUSCRIPCIONBIO', 1);
define('ESTRUCTURA_TIPOUSOBIO', 21);
define('ESTRUCTURA_TIPOSUSCRIPCIONACE', 26);
define('ESTRUCTURA_UNIDAD_TIPOSUSCRIPCIONACE', 277);
define('ESTRUCTURA_TIPOUSOACE', 57);
define('ESTRUCTURA_UNIDAD_TIPO_USO_ACE', 1020);
define('ESTRUCTURA_LIQUIDACION_SEGUROS', 28);
define('ESTRUCTURA_UNIDAD_LIQUIDACION_ACE', 289);
define('ESTRUCTURA_LIQUIDACION_ASEO', 9);
define('ESTRUCTURA_UNIDAD_LIQUIDACION_BIO', 167);
define('ESTRUCTURA_PERMISOS_USUARIO_SSRX', 74);
define('ESTRUCTURA_PERMISOS_NOTA_CONTABILIZACION', 77);

//CLASES 
define('CLASE_BANCOS', 280);
define('CLASE_BANCOS_DESEMBOLO', 1060);
define('CLASE_EMPRESAS', 880);
define('CLASE_TIPOCARGO', 36);
define('CLASE_PROFESIONES', 31);
define('CLASE_TIPOSOCIEDAD', 42);
define('CLASE_ACTIVIDADECONOMICA', 35);
define('CLASE_TIPOSUSCRIPCION', 1);
define('CLASE_TIPOUSOSUSCRIPCION', 2);
define('CLASE_TIPOLIQUIDACION', 3);
define('CLASE_NIVELEDUCATIVO', 30);
define('CLASE_ESTADOCIVIL', 29);
define('CLASE_DESTINOCREDITO', 28);
define('CLASE_PARENTESCO', 24);
define('CLASE_PRODUCTO_FINANCIERO_EXTERNO', 49);
define('CLASE_TIPOACTIVOS', 38);
define('CLASE_TIPOVIVIENDA', 32);
define('CLASE_ENVIOCORRESPONDECIA', 33);
define('CLASE_TIPOCONTRATO', 37);
define('CLASE_EXPERIENCIAFINANCIERA', 15);
define('CLASE_TIPOIDENTIFICACION', 40);
define('CLASE_REPOR_CENTRALES_POT', 1497);
define('CLASE_EMPRESAS_EXTERNAS', 1486);
define('CLASE_EMPRESAS_INSTALADORA_PROVEEDOR', 1487);
define('CLASE_EMPRESAS_FACTURA_COMPRA_CARTERA', 1485);
//Conceptos
//Lista de conceptos que se puede ajustar en la interfaz de modificar lecturas, se debe de registrar separados por coma
define("CONCEPTOS_CONSUMO", "35");

//Ejecucion Clases
define('CLASE_CALIFICAR_CREDITO', "Libranza\LibranzaBundle\Delegado\FuncionesCreditoDelegado");


//ESTADOS DE CREDITO 
define('ESTADO_RADICACION_CREDITO', 836);
define('ESTADO_RADICACION_VALIDADO', 837);
define('ESTADO_RADICACION_RECHAZADO', 836);
define('ESTADO_RADICACION_CALIFICAR_APROBADO', 838);
define('ESTADO_RADICACION_CALIFICAR_RECHAZADO', 836);
define('ESTADO_RADICACION_APROBACION_APROBAR', 839);
define('ESTADO_RADICACION_APROBACION_RECHAZADO', 837);
define('ESTADO_RADICACION_APROBACION_NEGAR', 850);
define('ESTADO_RADICACION_DESEMBOLSO_APROBADO', 840);
define('ESTADO_RADICACION_DESEMBOLSO_NODESEMBOLSADO', 884);



//RUTA EN SERVIDOR DE APLICACIONES PARA ALOJAR RESULTADO DE REPORTES GRANDES RETORNADOS POR WS JASPERS DE WILDFLY
define('RUTA_REPORTES_GRANDES', "/var/www/html/achagua/reportesGrandes/");
//define('RUTA_REPORTES_GRANDES', "c:/reportes/MyReports");
define("WEB_SERVICE_JASPER_REPORT_BYTES", "http://10.43.51.150/JasperBridge-1.0-SNAPSHOT/ws/jasper/bytes");
//define("WEB_SERVICE_JASPER_REPORT_BYTES", "http://localhost:8080/JasperBridge-1.0-SNAPSHOT/ws/jasper/bytes");
//define("WEB_SERVICE_JASPER_REPORT_BYTES", "http://localhost:8080/JasperBridge-1.0-SNAPSHOT/ws/jasper/bytes");
//define("WEB_SERVICE_JASPER_REPORT_BYTES", "http://10.43.36.249:8080/JasperBridge-1.0-SNAPSHOT/ws/jasper/bytes");
//define("WEB_SERVICE_JASPER_REPORT_BYTES", "http://10.43.51.7:8080/JasperBridge-1.0-SNAPSHOT/ws/jasper/bytes");
//define("WEB_SERVICE_JASPER_REPORT", "http://10.43.51.7:8080/JasperBridge-1.0-SNAPSHOT/ws/jasper/json");
//define("WEB_SERVICE_JASPER_REPORT_BYTES", "http://localhost:8080/JasperBridge-1.0-SNAPSHOT/ws/jasper/bytes");
// mensajes generacion de resumen procesos de suspensiones y reconexiones
// mensajes de cierre
define('MENSAJE_CIERRE_ENCABEZADO', "Se realiza cierre de encabezado de suspension sin generar encabezado para el siguiente ciclo");
define('MENSAJE_CIERRE_DETALLE', "Se realiza el cierre de encabezado de suspension, se envia encabezado y detalle de suspension al siguiente ciclo");
define('MENSAJE_CIERRE_RECONEXION', "Se realiza el cierre del encabezado de suspension, se envia encabezado, detalle de suspension y reconexion al siguiente ciclo");
define('MENSAJE_CIERRE_NO_ENCABEZADO', "La suspension no tiene un encabezado");

// mensajes de suspensiones
define('MENSAJE_ENCABEZADO_DETALLE_GENERADO', "Se genera nuevo encabezado y detalle de suspension");
define('MENSAJE_DETALLE_GENERADO', "Se genera un nuevo detalle de suspension");
define('MENSAJE_SIN_SUSPENSIONES', "No se generaron suspensiones");
define('MENSAJE_DETALLE_CANCELAR_RECONEXION', "Se cancela la reconexion asignada a la suscripcion");

// mensajes de reconexiones$idFactura
define('MENSAJE_SUSCRIPCION_SIN_FECHAS', "La suscripcion no cuenta con las fechas del estado");
define('MENSAJE_SUSCRIPCION_ACTUALIZADAS', "Suscripciones activadas que estaban suspendidas por usuario o por remodelacion");
define('MENSAJE_RECONEXION_GENERADO', "Se genera una nueva reconexion");
define('MENSAJE_ENCABEZADO_RECONEXION_GENERADO', "Se genera encabezado para reconexion");
define('MENSAJE_RECONEXION_ACTUALIZADA', "Se actualiza la fecha de programacion de la reconexion");
define('MENSAJE_CANCELAR_DETALLE_SUSPENSION', "Se cancela el detalle de suspension generado previamente");

// mensajes generacion de resumen proceso de interes por mora
define('MENSAJE_FACTURA_CREADA', "Ha sido registrada una nueva factura de interes por mora");
define('MENSAJE_FACTURA_NO_CREADA', "Ha sido encontrada una factura de interes por mora para esta factura en este ciclo");
define('MENSAJE_FACTURA_NO_CREADA_POR_VALOR', "La factura no se genero por no tener valor.");
define('MENSAJE_SIN_FACTURAS', "No se crearon facturas de interes por mora.");

//Ruta para accede a potenza
define("RUTA_WEB_POTENZA", 'http://www.potenzainversiones.com/estado_solicitud.php');
define("RUTA_WEB_POTENZA_IMG", 'http://www.potenzainversiones.com/img/etapas/');


// Codigos Convenios para Recaudo

define("CODIGO_CONV_GASBIOACE", 1);
define("CODIGO_CONV_GASBIO", 2);
define("CODIGO_CONV_GASACE", 5);
define("CODIGO_CONV_GASSER", 10);


// Cantidad Registros a Eliminar de BD 
define("CANTIDAD_REGISTROS_ELMINAR_BD", 2000);
//Novedades que permiten suspender por suspendido consumiendo
define("NOVEDADES_PARA_SUSPENSION_FRAUDE", '311,1033,58');
//Valor para suspensión (mayor que) y reconexión (menor que)
define("VALOR_SUSPENSION_RECONEXION", 7000);
// Cantidad de veces que se puede cambiar una venta una vez halla sido aprobada
define("PARAMETRO_MAX_CAMBIO_VENTA", 3);
define("CUOTAEMERGENCIA", 36);
define("DOCUMENTOEMERGENCIA", 24);
define("TIPODOCUMENTOEMERGENCIA", 302);
define("ESTRATOEMERGENCIA", '1,2');
define("TIPOUSOEMERGENCIA", 6);
define("SALDOBASEEMERGENCIA", 0);
define("LIQUIDACIONEMERGENCIA", 3127);
define("IDPARENTESCOEMERGENCIA", 944);
define("IDFINANCIAEMERGENCIA", 285977);
define("COD_REC_DXD", '135,226');
