/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.autenticador.persistencia.constante;

import com.gell.estandar.plantilla.IGenericoMensaje;

/**
 *
 * @author god
 */
public enum EMensajePersistencia implements IGenericoMensaje {

   OK(1, "Se ejecutó correctamente"),
   EDICION_OK(1, "Se hizo la edición"),
   NO_RESULTADOS(0, "No se encontraron  registros"),
   ERROR_CONEXION_BD(-1, "No hay conexion con la base de datos"),
   ERROR_MODIFICAR(-3, "Error al modificar el registro"),
   ERROR_AUTENTICACION(-1, "Error al autenticar"),
   
   ERROR_CONSULTAR_TERCERO(-4, "Error al consultar los terceros"),
   ERROR_NO_ENCONTRADA_ESTRUCTURA(-6, "Error la estructura no fue encontrada o no está parametrizada para la empresa "),
   ERROR_NO_ENCONTRADO_PUNTO_SALIDA(-7, "El punto de salida no se encontró"),
   ERROR_TERCERO_CONTACTO(-8, "El tercero no está clasificado como contacto "),
   ERROR_SESION(-9, "Error al iniciar la sesión, verifique el usuario y/o clave"),
   ERROR_UNIDAD_NOMBRE(-10, "Error el nombre ya existe"),
   ERROR_CONVERSOR(-11, "Las unidad de medida no están Parametrizadas"),
   ERROR_REGISTRO_VERSION(-12, "El registro fue modificado por otro proceso"),
   ERROR_CONFIRMAR(-13, "Error al confirmar los cambios en la base de datos"),
   ERROR_TIPOS_CONTRATO(-14, "No se encontraton los tipos de contrato"),
   ERROR_CONSULTAR_UNIDAD(-15, "No hay datos de la unidad ingresado"),
   ERROR_CONSULTAR_PUNTO_CONSUMO(-12, "No hay datos del código gestor ingresado"),
   ERROR_VARIABLE_UNIDAD_MEDIDA(-13, "La variable no tiene parametrizada la unidad de medida "),
   ERROR_CONSULTA_CONTRATO(-18, "El contrato no se encuentra en el sistema"),
   ERROR_CANTIDAD_CONTRATADA(-19, "La cantidad digita excede la contrata"),
   ERROR_BUSQUEDA_TERCERO(-20, "El nombre del tercero no se encuentra con contratos vigentes"),
   ERROR_UNIDAD_MEDIDADA(-21, "Error la unidad de medida (__COMPLEMENTO__) no se encontró"),
   ERROR_INGRESO_FECHA(-22, "La fecha ingresada no debe pasar la fecha actual"),
   ERROR_FORMATO_FECHA (-23,"La fecha ingresada debe esta en el formato Año-Mes"),
   ERROR_FECHA_FINAL (-24,"La fecha final ingresada no debe ser menor a la fecha inicial");
  
   /**
    * Código de respuesta
    */
   private final int codigo;

   /**
    * Descripción del mensaje o el evento que sucedió
    */
   private final String mensaje;

   private EMensajePersistencia(int codigo, String mensaje)
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
