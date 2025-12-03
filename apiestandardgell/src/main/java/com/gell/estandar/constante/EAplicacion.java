/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.constante;

/**
 *
 * @author God
 */
public enum EAplicacion
{    
  NULA(""),
  NOCON("nocon"),
  PRISMA("prisma"),
  REIAL("reial"),
  AGAU("agau"),
  ARCHIVOS("archivos"),
  INFIS("infis"),
  PAWEB("paweb"),
  DORBI("dorbi"),
  VEPOS("vepos"),
  RUGII("rugii"),
  INCAIN("incain"),
  SURES("sures"),
  DIRO("diro"),
  HOMAFO("homafo"),
  RISISE("risise"),
  TARGAS("targas"),
  EMERGENCIAS("emergencias"),
  NOVECO("noveco");
  private final String nombreAplicacion;

  private EAplicacion(String nombreAplicacion)
  {
    this.nombreAplicacion = nombreAplicacion;
  }

  public String getNombreAplicacion()
  {
    return nombreAplicacion;
  }

  public static EAplicacion convertir(String nombre)
  {
    EAplicacion[] listaAplicaciones = EAplicacion.values();
    for (EAplicacion aplicacion : listaAplicaciones) {
      if (aplicacion.getNombreAplicacion().equalsIgnoreCase(nombre)) {
        return aplicacion;
      }
    }
    return NULA;
  }

}
