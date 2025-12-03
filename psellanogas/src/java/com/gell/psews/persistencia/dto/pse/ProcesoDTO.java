/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.persistencia.dto.pse;

/**
 *
 * @author spiwer
 */
public class ProcesoDTO
{

  private Long tiempoProcesoPSE;
  private Long tiempoProcesoAplicacion;

  public ProcesoDTO()
  {
  }

  public ProcesoDTO(Long tiempoProcesoPSE, Long tiempoProcesoAplicacion)
  {
    this.tiempoProcesoPSE = tiempoProcesoPSE;
    this.tiempoProcesoAplicacion = tiempoProcesoAplicacion;
  }

  public Long getTiempoProcesoPSE()
  {
    return tiempoProcesoPSE;
  }

  public ProcesoDTO setTiempoProcesoPSE(Long tiempoProcesoPSE)
  {
    this.tiempoProcesoPSE = tiempoProcesoPSE;
    return this;
  }

  public Long getTiempoProcesoAplicacion()
  {
    return tiempoProcesoAplicacion;
  }

  public ProcesoDTO setTiempoProcesoAplicacion(Long tiempoProcesoAplicacion)
  {
    this.tiempoProcesoAplicacion = tiempoProcesoAplicacion;
    return this;
  }

}
