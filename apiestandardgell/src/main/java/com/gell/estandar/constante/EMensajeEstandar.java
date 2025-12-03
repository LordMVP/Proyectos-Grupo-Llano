/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.constante;

import com.gell.estandar.plantilla.IGenericoMensaje;

/**
 *
 * @author god
 */
public enum EMensajeEstandar implements IGenericoMensaje
{
  OK(1, "Petición ejecutada correctamente"),
  NO_RESULTADOS(0, "No se encontraron resultados "),
  ERROR(-1, "Error al procesar la petición"),
  ERROR_SESION_EXPIRADO(-2, "La sesión ha expirado"),
  ERROR_TOKEN_CORRUPTO(-2, "El token es incorrecto"),
  ERROR_ADJUNTAR_ARCHIVO(-3, "Error al adjuntar los documentos en el servicio "),
  ERROR_ARCHIVO_NO_EXISTE(-4, "Error el archivo solicitado no se encuentra"),
  ERROR_CONECTAR(-5, "Error al conectar con el servidor"),
  ERROR_NOMBRE_APLICACION(-6, "Error el nombre de la aplicación es obligatorio"),
  ERROR_USUARIO(-7, "Error el identificador del usuario es obligatorio"),
  ERROR_CONVERTIR_ARCHIVO(-8, "Error al convertir el archivo a un ArchivoDTO"),
  ERROR_CONSULTAR(-9, "Error al consultar el registro"),
  ERROR_COLUMNA_NO_ENCONTRADA(-10, "No se encontró la columna"),
  ERROR_EDITAR(-11, "Error al editar"),
  ERROR_INSERTAR(-12, "Error al insertar el registro"),
  ERROR_ENTIDAD(-10004, "La información a validar está vacía "),
  ERROR_REGLAS(-10005, "Debe especificar las validaciones que se van a realizar a la entidad "),
  ERROR_CAMPO(-10006, "El atributo __COMPLEMENTO__ no existe en la entidad "),
  ERROR_REGLA_NO_EXISTE(-10009, "Error la regla de validación no existe"),
  ERROR_VALIDACION_MENSAJE(-10015, "__COMPLEMENTO__"),
  ERROR_JSON_MAP(-10016, "Error al procesar el json a un map"),
  ERROR_REGLAS_DEMASIADO(-10018, "Error no se puede invocar este método porque hay más de un dato para validar "),
  ERROR_JSON(-10021, "Error al convertir el objeto en un JSON"),
  ERROR_GENERAR_REPORTE(-10022, "Error al invocar el reporte "),
  ERROR_INVOCAR_SERVICIO(-10023, "Error al invocar el servicio de AZDigital"),
  ERROR_APLICACION_NO_ENTRADA(-10024, "Error la aplicación __COMPLEMENTO__ no fue encontrada"),
  ERROR_SOAP_METODO(-10025, "__COMPLEMENTO__"),
  ERROR_SOAP_RESPUESTA(-10026, "Error al procesar la respuesat de AZDigital "),
  ERROR_CREAR_ARREGLO(-10027, "Error al crear el arreglo"),
  ERROR_APLICACION(-10028, "Error debe enviar el identificador de la aplicación"),
  ERROR_CONECTAR_BD(-10029, "Error al conectar con la base de datos"),
  ERROR_CONSULTAR_PERSONALIZADO(-10030, "__COMPLEMENTO__"),
  ERROR_FECHA(-10031,"Error al convertir la fecha ");
  /**
   * Código del error
   */
  private final int codigo;
  /**
   * Mensaje del evento
   */
  private final String mensaje;

  private EMensajeEstandar(int codigo, String mensaje)
  {
    this.codigo = codigo;
    this.mensaje = mensaje;
  }

  @Override
  public int getCodigo()
  {
    return codigo;
  }

  @Override
  public String getMensaje()
  {
    return mensaje;
  }

}
