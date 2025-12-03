/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.negocio.constantes;

/**
 * Clase encargada de registrar todos los mensajes de la aplicación
 *
 * @author lrey
 */
public enum EMensajes
{

  Ok(1, "Petición ejecutada correctamente"),
  NO_HAY_DATOS(0, "No se encontraron registros"),
  /**
   * Errores de la capa de persistencia
   */
  ERROR_PERSISTENCIA_CONEXION(-1, "Error con la conexión a la base de datos "),
  ERROR_PERSISTENCIA_COMMIT(-2, "Error al guardar los datos "),
  ERROR_PERSISTENCIA_ROLLBACK(-3, "Error al devolver los datos "),
  ERROR_PERSISTENCIA_CONSULTAR(-4, "Error al ejecutar la consulta "),
  ERROR_PERSISTENCIA_CONSULTAR_SUSCRIPCION_CONVENIO(-5, "Error al consultar las suscripciones asociadas al convenio"),
  ERROR_PERSISTENCIA_CONSULTAR_FACTURAS(-6, "Error al consultar las facturas"),
  ERROR_PERSISTENCIA_CONVERTIR(-7, "Error al convertir el dato"),
  ERROR_PERSISTENCIA_CONSULTAR_DOCUMENTO(-8, "Error al ejecutar la sentencia de consultar documentos "),
  ERROR_PERSISTENCIA_INSERTAR_RECAUDO(-9, "Error al insertar el recaudo "),
  ERROR_PERSISTENCIA_CONSULTAR_DETALLES(-10, "Error al consultar los detalles de las facturas"),
  ERROR_PERSISTENCIA_INSERTAR_DETALLE_RECAUDO(-11, "Error al insertar los detalles del recaudo"),
  ERROR_PERSISTENCIA_ACTUALIZAR_FACTURA(-12, " Error al actualizar los detalles de las factura"),
  ERROR_PERSISTENCIA_RECAUDO_FORMA(-13, "Error al insertar las formas de pago __COMPLEMENTO__"),
  ERROR_PERSISTENCIA_ID_RECAUDO_WEB(-14, "Error al consultar el id del recaudo web"),
  ERROR_PERSISTENCIA_INSERTAR_RECAUDO_WEB(-15, "Error al insertar el seguimiento de la transacción "),
  ERROR_PERSISTENCIA_ACTUALIZAR_RECAUDO_WEB(-16, "Error al actualizar el registro del recaudo web"),
  ERROR_PERSISTENCIA_CONSULTAR_DETALLES_RECAUDO_WEB(-17, "Error al consultar los detalles del recaudo "),
  ERROR_PERSISTENCIA_CONSULTAR_TRANSACCIONES(-18, "Error al consultar la cantidad de transacciones pendientes "),
  ERROR_PERSISTENCIA_ACTUALIZAR_RECAUDO_LOG(-19, "Error al actualizar el recaudo "),
  ERROR_PERSISTENCIA_CONSULTAR_SALDO_FACTURAS_SUSCRIPCION(-20, "Error al consultar Saldos de las Facturas por Suscripción"),
  ERROR_PERSISTENCIA_RECAUDO_FACTURA(-21, "Error al asociar las facturas con el recaudo"),
  /**
   * Errores de la capa de negocio
   */
  ERROR_NEGOCIO_SUSCRIPCION_NO_ENCONTRADA(-1000, "Error la suscripción no se encontró"),
  ERROR_NEGOCIO_FACTURA_SIN_SALDO(-1001, "Error no hay facturas con saldo"),
  ERROR_NEGOCIO_FACTURAS_INCONSISTENTES(-1002, "Hay facturas inconsistentes "),
  ERROR_NEGOCIO_CONSULTAR_DOCUMENTO(-1008, "Error al consultar el documento del recaudo (__COMPLEMENTO__)"),
  ERROR_NEGOCIO_CICLO_NO_ENCONTRADO(-1009, "Error al consultar el ciclo"),
  ERROR_NEGOCIO_DETALLE_FACTURA_NEGATIVO(-1010, " Los detalles de la factura genera saldo negativo"),
  ERROR_NEGOCIO_ACTUALIZAR_FACTURA(-1011, "Error al actualizar la factura otro proceso ya modificó la factura"),
  ERROR_NEGOCIO_SUSCRIPCION_INICIAL_NO_ENCONTRADA(-1012, "Error al buscar la suscripción __COMPLEMENTO__"),
  ERROR_NEGOCIO_ACTUALIZAR_FACTURA_JSON(-1013, "La información no tiene el formato correcto "),
  ERROR_NEGOCIO_FATAL(-1014, "Error inesperado consulte con el administrador del sistema"),
  ERROR_NEGOCIO_RUTA_NO_ENCONTRADA(-1013, "La ruta solicitada no se encuentra disponible"),
  ERROR_NEGOCIO_RESPUESTA_INCOMPLETA(-1014, "La respuesta de PSE está incompleta "),
  ERROR_NEGOCIO_PETICION(-1015, "Error al procesar la petición a PSE"),
  ERROR_NEGOCIO_CONSULTAR_RECAUDO_WEB(-1016, "No se encontró el registro solicitado "),
  ERROR_NEGOCIO_CONSULTAR_PARAMETROS(-1017, "Error al consultar los parámetros"),
  ERROR_NEGOCIO_TRANSACCION_PENDIENTE(-1018, "La suscripción tiene transacciones pendientes. Por favor intentar más tarde nuevamente"),
  ERROR_NEGOCIO_CONSULTAR_AUTORIZACION(-1019, "Error al consultar el documento de autorización de tratamiento de datos"),
  ERROR_NEGOCIO_FACTURA_VENCIDA(-1020, "El usuario tiene facturas vencidas"),
  ERROR_NEGOCIO_FACTURA_SIN_FECHA(-1021, "La factura no tiene fecha de vencimiento"),
  ERROR_NEGOCIO_CONSULTAR_RESUMEN(-1022, "Error al consultar el resumen de la transacción"),
  ERROR_NEGOCIO_CONSULTAR_TIPODOCUMENTO(-1023, "Error al consultar el tipo de Documento "),
  ERROR_NEGOCIO_CONFIGURACION(-1024, "No se encontró la configuración para la empresa __COMPLEMENTO__"),
  ERROR_NEGOCIO_CONFIGURACION_TICKET(-1024, "No se encontró la configuración ticketOfficeId __COMPLEMENTO__");

  /**
   * Código de respuesta
   */
  private final int codigo;

  /**
   * Mensaje que va a llegar al usuario final
   */
  private final String mensaje;

  private EMensajes(int codigo, String mensaje)
  {
    this.codigo = codigo;
    this.mensaje = mensaje;
  }

  public int getCodigo()
  {
    return codigo;
  }

  public String getMensaje()
  {
    return mensaje;
  }

}
