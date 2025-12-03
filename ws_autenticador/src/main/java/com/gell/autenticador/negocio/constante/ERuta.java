/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.autenticador.negocio.constante;

/**
 * Clase encargada de registrar todas las Rutas del sistema
 *
 * @author god
 */
public class ERuta {

  /**
   * Las rutas que se registran en esta clase es porque no requieren
   * autenticación y debe empezar con la palabra "global"
   */
  public final static class Global {

    public static final String INICIO_SESION = "/global/iniciosesion";
    public static final String INICIO_SESION_PRISMA = "/global/iniciosesion/prisma";
    public static final String INICIO_SESION_NOCON_EXTERNO = "/global/iniciosesion/tercero";
    public static final String PASS_RESTABLECER = "/global/pass/restablecer";
    public static final String PASS_CAMBIAR = "/global/pass/cambiar";
    public static final String MENU_PRISMA = "/api/global/menu/prisma";
    public static final String VALIDAR_TOKEN = "/api/global/token/validar";
    public static final String RENOVAR = "/api/global/token/renovar";

  }

}
